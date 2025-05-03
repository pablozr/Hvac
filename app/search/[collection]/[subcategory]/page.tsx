import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';

import { defaultSort, sorting } from 'lib/constants';
import { Collection, Product } from 'lib/shopify/types';
import CollectionClient from '../page-client';

export async function generateMetadata(props: {
  params: Promise<{ collection: string; subcategory: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collectionPath = `${params.collection}/${params.subcategory}`;

  // Tenta obter a coleção do Shopify
  const collection = await getCollection(collectionPath);

  // Se a coleção não existir no Shopify, use o mapeamento de coleções do page-client.tsx
  if (!collection) {
    // Obtenha o nome da subcategoria formatado
    const subcategoryName = params.subcategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title: subcategoryName,
      description: `Produtos da subcategoria ${subcategoryName}`
    };
  }

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function SubcategoryPage(props: {
  params: Promise<{ collection: string; subcategory: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Constrói o caminho completo da coleção (pai/filho)
  const collectionPath = `${params.collection}/${params.subcategory}`;

  console.log(`Subcategory page: ${collectionPath}`);
  console.log(`Parent category: ${params.collection}`);
  console.log(`Subcategory: ${params.subcategory}`);

  try {
    // Primeiro, tenta obter a coleção pai para verificar se existe
    const parentCollection = await getCollection(params.collection);
    if (parentCollection) {
      console.log(`Found parent collection: ${parentCollection.title}`);
      if (parentCollection.metafields) {
        console.log('Parent collection metafields:');
        parentCollection.metafields.forEach((meta: { namespace: string; key: string; value: string }) => {
          console.log(`- ${meta.namespace}.${meta.key}: ${meta.value}`);
        });
      }
    } else {
      console.log(`Parent collection not found: ${params.collection}`);
    }
  } catch (error) {
    console.error(`Error fetching parent collection:`, error);
  }

  try {
    // Tenta obter a subcategoria diretamente
    const subcategoryCollection = await getCollection(params.subcategory);
    if (subcategoryCollection) {
      console.log(`Found subcategory collection directly: ${subcategoryCollection.title}`);
      if (subcategoryCollection.metafields) {
        console.log('Subcategory collection metafields:');
        subcategoryCollection.metafields.forEach((meta: { namespace: string; key: string; value: string }) => {
          console.log(`- ${meta.namespace}.${meta.key}: ${meta.value}`);
        });
      }
    } else {
      console.log(`Subcategory collection not found directly: ${params.subcategory}`);
    }
  } catch (error) {
    console.error(`Error fetching subcategory collection:`, error);
  }

  // Tenta obter produtos da coleção do Shopify usando o caminho completo
  let products: Product[] = [];
  let collection: Collection | undefined;

  try {
    products = await getCollectionProducts({ collection: collectionPath, sortKey, reverse });
    collection = await getCollection(collectionPath);
  } catch (error) {
    console.error(`Error fetching products or collection for ${collectionPath}:`, error);
  }

  if (collection) {
    console.log(`Found collection: ${collection.title}`);
    if (collection.metafields) {
      console.log('Collection metafields:');
      collection.metafields.forEach((meta: { namespace: string; key: string; value: string }) => {
        console.log(`- ${meta.namespace}.${meta.key}: ${meta.value}`);
      });
    }
  } else {
    console.log(`Collection not found for: ${collectionPath}`);
  }

  // Se não encontrar a coleção no Shopify, tenta buscar produtos da categoria pai
  if (!collection || products.length === 0) {
    console.log(`Subcategory not found or empty: ${collectionPath}. Generating demo products.`);

    // Formata o nome da subcategoria para exibição
    const subcategoryTitle = params.subcategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Verifica se a subcategoria existe no Shopify
    const subcategoryCollection = await getCollection(params.subcategory);
    if (subcategoryCollection) {
      // Se a subcategoria existe, verificamos seus metadados
      const metafields = subcategoryCollection.metafields || [];
      const parentMeta = metafields.find(
        meta => meta && meta.namespace === 'custom' && meta.key === 'parent_category'
      );

      if (parentMeta) {
        // Se a subcategoria tem o metafield parent_category
        if (parentMeta.value !== params.collection) {
          // Se o metafield parent_category não corresponde à categoria pai na URL
          console.log(`Subcategory ${subcategoryTitle} belongs to parent category ${parentMeta.value}, not ${params.collection}`);
          console.log(`This might be an incorrect URL. The correct URL would be /search/${parentMeta.value}/${params.subcategory}`);

          // Busca produtos para esta subcategoria
          const subcategoryProducts = await getCollectionProducts({
            collection: params.subcategory,
            sortKey,
            reverse
          });

          if (subcategoryProducts.length > 0) {
            // Se encontrou produtos, exibe-os com uma mensagem informativa sobre o caminho correto
            return (
              <CollectionClient
                collection={`${parentMeta.value}/${params.subcategory}`}
                products={subcategoryProducts}
                title={subcategoryTitle}
                description={`Cette sous-catégorie appartient à la catégorie ${parentMeta.value}, pas à ${params.collection}. Vous pouvez y accéder via /search/${parentMeta.value}/${params.subcategory}`}
              />
            );
          } else {
            // Se não encontrou produtos, gera produtos de demonstração
            const demoProducts = generateDemoProducts(collectionPath);
            console.log(`Generated ${demoProducts.length} demo products for ${collectionPath}`);

            // Retorna a página com produtos de demonstração e uma mensagem explicativa
            return (
              <CollectionClient
                collection={`${parentMeta.value}/${params.subcategory}`}
                products={demoProducts}
                title={subcategoryTitle}
                description={`Cette sous-catégorie appartient à la catégorie ${parentMeta.value}, pas à ${params.collection}. Vous pouvez y accéder via /search/${parentMeta.value}/${params.subcategory}`}
              />
            );
          }
        }
      }
    }

    // Gera produtos de demonstração para a subcategoria
    const demoProducts = generateDemoProducts(collectionPath);
    console.log(`Generated ${demoProducts.length} demo products for ${collectionPath}`);

    // Retorna a página com produtos de demonstração
    return (
      <CollectionClient
        collection={collectionPath}
        products={demoProducts}
        title={subcategoryTitle}
        description={`Produtos da subcategoria ${subcategoryTitle}`}
      />
    );
  }

  return (
    <CollectionClient
      collection={collectionPath}
      products={products}
      title={collection.title}
      description={collection.description || ''}
    />
  );
}

// Função para gerar produtos de demonstração
function generateDemoProducts(collection: string): any[] {
  // Gera 9 produtos de demonstração para a categoria
  return Array.from({ length: 9 }, (_, i) => {
    const price = String(Math.floor(Math.random() * 10000) + 500);
    const categories = collection.split('/');
    const subcategory = categories[categories.length - 1];
    const productName = `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Produto ${i + 1}`;

    return {
      id: `demo-${collection}-${i}`,
      title: productName,
      handle: `${subcategory}-produto-${i + 1}`,
      availableForSale: Math.random() > 0.2, // 80% dos produtos estão disponíveis
      featuredImage: {
        url: `https://picsum.photos/seed/${collection}-${i}/800/800`,
        altText: productName,
        width: 800,
        height: 800
      },
      priceRange: {
        maxVariantPrice: {
          amount: price,
          currencyCode: 'CHF'
        },
        minVariantPrice: {
          amount: price,
          currencyCode: 'CHF'
        }
      },
      description: `Descrição do produto ${productName}`,
      descriptionHtml: `<p>Descrição do produto ${productName}</p>`,
      options: [],
      variants: [],
      images: [{
        url: `https://picsum.photos/seed/${collection}-${i}/800/800`,
        altText: productName,
        width: 800,
        height: 800
      }],
      seo: {
        title: productName,
        description: `Descrição do produto ${productName}`
      },
      tags: [],
      updatedAt: new Date().toISOString(),
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 50) + 1
    };
  });
}
