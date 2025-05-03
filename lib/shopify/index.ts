import {
    HIDDEN_PRODUCT_TAG,
    SHOPIFY_GRAPHQL_API_ENDPOINT
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
// Removendo importações do lado do servidor que causam problemas
// import { revalidateTag } from 'next/cache';
// import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
    addToCartMutation,
    createCartMutation,
    editCartItemsMutation,
    removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
    getCollectionProductsQuery,
    getCollectionQuery,
    getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
    getProductQuery,
    getProductRecommendationsQuery,
    getProductsQuery
} from './queries/product';
import {
    Cart,
    Collection,
    Connection,
    Image,
    Menu,
    Page,
    Product,
    ShopifyAddToCartOperation,
    ShopifyCart,
    ShopifyCartOperation,
    ShopifyCollection,
    ShopifyCollectionOperation,
    ShopifyCollectionProductsOperation,
    ShopifyCollectionsOperation,
    ShopifyCreateCartOperation,
    ShopifyMenuOperation,
    ShopifyPageOperation,
    ShopifyPagesOperation,
    ShopifyProduct,
    ShopifyProductOperation,
    ShopifyProductRecommendationsOperation,
    ShopifyProductsOperation,
    ShopifyRemoveFromCartOperation,
    ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      console.error('Shopify API error:', JSON.stringify(body.errors, null, 2));
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      console.error('Shopify error:', {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query: query.substring(0, 100) + '...' // Log apenas parte da query para não poluir o console
      });

      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    console.error('Unknown error in shopifyFetch:', e);

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  // Com identifiers, metafields é um array diretamente, não uma conexão com edges e nodes
  const metafields = collection.metafields || [];

  // Verificar se esta coleção é uma subcategoria (tem um metafield parent_category)
  const parentCategoryMetafield = metafields.find(
    meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
  );

  // Se for uma subcategoria, o caminho deve incluir a categoria pai
  let path = `/search/${collection.handle}`;
  if (parentCategoryMetafield) {
    path = `/search/${parentCategoryMetafield.value}/${collection.handle}`;
  }

  return {
    ...collection,
    path,
    metafields
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  const cart = reshapeCart(res.body.data.cartCreate.cart);

  // Salvar o cartId no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartId', cart.id);
  }

  return cart;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  // Modificado para usar localStorage em vez de cookies
  const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
  if (!cartId) {
    throw new Error('No cartId found');
  }

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  // Modificado para usar localStorage em vez de cookies
  const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
  if (!cartId) {
    throw new Error('No cartId found');
  }

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  // Modificado para usar localStorage em vez de cookies
  const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
  if (!cartId) {
    throw new Error('No cartId found');
  }

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  // Modificado para usar localStorage em vez de cookies
  const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  // 'use cache' removido

  try {
    // Verifica se o handle contém uma barra (/) indicando uma subcategoria
    if (handle.includes('/')) {
      // Divide o handle em categoria pai e subcategoria
      const [parentCategory, subcategory] = handle.split('/');

      console.log(`Getting collection for path: ${handle}`);
      console.log(`Parent category: ${parentCategory}, Subcategory: ${subcategory}`);

      try {
        // Busca a subcategoria diretamente pelo handle da subcategoria
        const subcategoryRes = await shopifyFetch<ShopifyCollectionOperation>({
          query: getCollectionQuery,
          variables: {
            handle: subcategory
          }
        });

        if (subcategoryRes.body.data.collection) {
          const subcollection = subcategoryRes.body.data.collection;
          console.log(`Found subcategory directly: ${subcollection.title}`);

          // Verifica se esta subcategoria tem o metafield parent_category
          const metafields = subcollection.metafields || [];
          const parentMeta = metafields.find(
            meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
          );

          // Se a subcategoria tem o metafield parent_category
          if (parentMeta) {
            console.log(`Subcategory ${subcollection.title} has parent_category: ${parentMeta.value}`);

            // Verifica se o metafield parent_category corresponde à categoria pai na URL
            if (parentMeta.value === parentCategory) {
              console.log(`Subcategory ${subcollection.title} has correct parent_category: ${parentMeta.value}`);
              // Se encontrou a coleção e o metafield parent_category corresponde, retorna com o caminho ajustado
              return {
                ...subcollection,
                path: `/search/${parentCategory}/${subcollection.handle}`,
                metafields
              };
            } else {
              console.log(`Subcategory ${subcollection.title} has parent_category but it doesn't match URL: ${parentMeta.value} vs ${parentCategory}`);
              console.log(`This might be an incorrect URL. The correct URL would be /search/${parentMeta.value}/${subcollection.handle}`);

              // Mesmo que o parent_category não corresponda à URL, retornamos a subcategoria
              // Isso permite que a página exiba uma mensagem informativa sobre o caminho correto
              return {
                ...subcollection,
                path: `/search/${parentMeta.value}/${subcollection.handle}`,
                metafields
              };
            }
          } else {
            console.log(`Subcategory ${subcollection.title} doesn't have parent_category metafield`);
            // Se encontrou a subcategoria mas não tem o metafield parent_category, retorna com o caminho ajustado
            // Isso permite que subcategorias sem metafield parent_category sejam exibidas
            return {
              ...subcollection,
              path: `/search/${parentCategory}/${subcollection.handle}`,
              metafields
            };
          }
        } else {
          console.log(`Subcategory not found directly: ${subcategory}`);
        }
      } catch (error) {
        console.error(`Error fetching subcategory ${subcategory}:`, error);
      }

      // Se não encontrou a subcategoria diretamente, tenta buscar todas as coleções
      try {
        console.log(`Trying to find subcategory by searching all collections...`);
        const allCollectionsRes = await shopifyFetch<ShopifyCollectionsOperation>({
          query: getCollectionsQuery
        });

        const allCollections = removeEdgesAndNodes(allCollectionsRes.body.data.collections);

        // Procura por uma coleção com o handle da subcategoria
        for (const coll of allCollections) {
          if (coll.handle === subcategory) {
            console.log(`Found collection with matching handle: ${coll.title}`);

            const metafields = coll.metafields || [];
            const parentMeta = metafields.find(
              meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
            );

            if (parentMeta) {
              console.log(`Collection ${coll.title} has parent_category: ${parentMeta.value}`);

              // Verifica se o metafield parent_category corresponde à categoria pai na URL
              if (parentMeta.value === parentCategory) {
                console.log(`Collection ${coll.title} has correct parent_category: ${parentMeta.value}`);
                return {
                  ...coll,
                  path: `/search/${parentCategory}/${coll.handle}`,
                  metafields
                };
              } else {
                console.log(`Collection ${coll.title} has parent_category but it doesn't match URL: ${parentMeta.value} vs ${parentCategory}`);
                console.log(`This might be an incorrect URL. The correct URL would be /search/${parentMeta.value}/${coll.handle}`);

                // Mesmo que o parent_category não corresponda à URL, retornamos a subcategoria
                return {
                  ...coll,
                  path: `/search/${parentMeta.value}/${coll.handle}`,
                  metafields
                };
              }
            } else {
              // Se não tem o metafield parent_category, retorna a coleção como subcategoria da categoria pai na URL
              return {
                ...coll,
                path: `/search/${parentCategory}/${coll.handle}`,
                metafields
              };
            }
          }
        }
      } catch (error) {
        console.error(`Error searching all collections:`, error);
      }

      // Se não encontrou, retorna undefined
      console.log(`No matching collection found for \`${handle}\``);
      return undefined;
    }

    // Comportamento original para coleções normais (sem subcategorias)
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        handle
      }
    });

    return reshapeCollection(res.body.data.collection);
  } catch (error) {
    console.error(`Error in getCollection for handle ${handle}:`, error);
    return undefined;
  }
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // 'use cache' removido

  try {
    // Verifica se o handle contém uma barra (/) indicando uma subcategoria
    if (collection.includes('/')) {
      // Divide o handle em categoria pai e subcategoria
      const [parentCategory, subcategory] = collection.split('/');

      console.log(`Fetching products for subcategory: ${subcategory} (parent: ${parentCategory})`);

      // Busca produtos diretamente da subcategoria, independentemente da categoria pai
      try {
        // Busca produtos para a subcategoria
        const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
          query: getCollectionProductsQuery,
          variables: {
            handle: subcategory,
            reverse,
            sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
          }
        });

        if (res.body.data.collection) {
          console.log(`Found products for subcategory: ${subcategory}`);

          // Busca a subcategoria para verificar seus metadados
          const subcategoryCollection = await getCollection(subcategory);

          if (subcategoryCollection) {
            console.log(`Found subcategory collection: ${subcategoryCollection.title}`);

            // Verifica se esta subcategoria tem o metafield parent_category
            const metafields = subcategoryCollection.metafields || [];
            const parentMeta = metafields.find(
              meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
            );

            // Se a subcategoria tem o metafield parent_category
            if (parentMeta) {
              console.log(`Subcategory ${subcategoryCollection.title} has parent_category: ${parentMeta.value}`);

              // Verifica se o metafield parent_category corresponde à categoria pai na URL
              if (parentMeta.value === parentCategory) {
                console.log(`Subcategory ${subcategoryCollection.title} has correct parent_category: ${parentMeta.value}`);
                // Se o metafield parent_category corresponde, retorna os produtos
                return reshapeProducts(
                  removeEdgesAndNodes(res.body.data.collection.products)
                );
              } else {
                console.log(`Subcategory ${subcategoryCollection.title} has parent_category but it doesn't match URL: ${parentMeta.value} vs ${parentCategory}`);
                console.log(`This might be an incorrect URL. The correct URL would be /search/${parentMeta.value}/${subcategory}`);

                // Mesmo que o parent_category não corresponda à URL, retornamos os produtos
                // Isso permite que a página exiba os produtos com uma mensagem informativa sobre o caminho correto
                return reshapeProducts(
                  removeEdgesAndNodes(res.body.data.collection.products)
                );
              }
            } else {
              console.log(`Subcategory ${subcategoryCollection.title} doesn't have parent_category metafield`);
              // Se não tem o metafield parent_category, retorna os produtos mesmo assim
              return reshapeProducts(
                removeEdgesAndNodes(res.body.data.collection.products)
              );
            }
          } else {
            console.log(`Subcategory collection not found in metadata, but products exist: ${subcategory}`);
            // Se não encontrou a subcategoria nos metadados, mas encontrou produtos, retorna os produtos mesmo assim
            return reshapeProducts(
              removeEdgesAndNodes(res.body.data.collection.products)
            );
          }
        } else {
          console.log(`No products found for subcategory: ${subcategory}`);
        }
      } catch (error) {
        console.error(`Error fetching products for subcategory ${subcategory}:`, error);
      }

      console.log(`No direct collection found for subcategory: ${subcategory}. Trying parent category.`);

      try {
        // Se não encontrou diretamente, tenta buscar produtos da categoria pai
        // e depois filtrar por metadados ou tags
        const parentRes = await shopifyFetch<ShopifyCollectionProductsOperation>({
          query: getCollectionProductsQuery,
          variables: {
            handle: parentCategory,
            reverse,
            sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
          }
        });

        if (!parentRes.body.data.collection) {
          console.log(`No collection found for parent category: ${parentCategory}`);
          return [];
        }

        try {
          // Busca todas as coleções para encontrar a subcategoria pelos metadados
          console.log(`Trying to find subcategory by searching all collections...`);
          const allCollectionsRes = await shopifyFetch<ShopifyCollectionsOperation>({
            query: getCollectionsQuery
          });

          const allCollections = removeEdgesAndNodes(allCollectionsRes.body.data.collections);

          // Procura por uma coleção com o handle da subcategoria e o metafield parent_category correto
          for (const coll of allCollections) {
            if (coll.handle === subcategory) {
              console.log(`Found collection with matching handle: ${coll.title}`);

              const metafields = coll.metafields || [];
              const parentMeta = metafields.find(
                meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
              );

              if (parentMeta && parentMeta.value === parentCategory) {
                console.log(`Collection ${coll.title} has correct parent_category: ${parentMeta.value}`);

                try {
                  // Busca produtos para esta subcategoria
                  const subcategoryRes = await shopifyFetch<ShopifyCollectionProductsOperation>({
                    query: getCollectionProductsQuery,
                    variables: {
                      handle: subcategory,
                      reverse,
                      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
                    }
                  });

                  if (subcategoryRes.body.data.collection) {
                    return reshapeProducts(
                      removeEdgesAndNodes(subcategoryRes.body.data.collection.products)
                    );
                  }
                } catch (error) {
                  console.error(`Error fetching products for subcategory ${subcategory} after finding it in all collections:`, error);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error searching all collections:`, error);
        }

        // Se não encontrou a subcategoria pelos metadados, retorna produtos da categoria pai
        console.log(`Returning all products from parent category: ${parentCategory}`);
        return reshapeProducts(
          removeEdgesAndNodes(parentRes.body.data.collection.products)
        );
      } catch (error) {
        console.error(`Error fetching products for parent category ${parentCategory}:`, error);
        return [];
      }
    }

    // Comportamento original para coleções normais (sem subcategorias)
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
      }
    });

    if (!res.body.data.collection) {
      console.log(`No collection found for \`${collection}\``);
      return [];
    }

    return reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products)
    );
  } catch (error) {
    console.error(`Error in getCollectionProducts for collection ${collection}:`, error);
    return [];
  }
}

export async function getCollections(): Promise<Collection[]> {
  // 'use cache' removido

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  // 'use cache' removido

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, '')
        .replace('/collections', '/search')
        .replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  // 'use cache' removido

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  // 'use cache' removido

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // 'use cache' removido

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // Simplificado para evitar o uso de headers() e revalidateTag()
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  // Simplificado para apenas retornar sucesso
  console.log('Revalidation request received');

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
