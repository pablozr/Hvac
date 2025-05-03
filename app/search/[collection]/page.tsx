import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';

import { defaultSort, sorting } from 'lib/constants';
import { Collection, Product } from 'lib/shopify/types';
import CollectionClient from './page-client';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  // Se a coleção não existir no Shopify, use o mapeamento de coleções do page-client.tsx
  if (!collection) {
    // Obtenha o nome da coleção formatado
    const collectionName = params.collection
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title: collectionName,
      description: `Produtos da categoria ${collectionName}`
    };
  }

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  console.log(`Category page: ${params.collection}`);

  // Tenta obter produtos da coleção do Shopify
  let products: Product[] = [];
  let collection: Collection | undefined;

  try {
    products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });
    collection = await getCollection(params.collection);

    if (collection) {
      console.log(`Found collection: ${collection.title}`);
      if (collection.metafields) {
        console.log('Collection metafields:');
        collection.metafields.forEach((meta: { namespace: string; key: string; value: string }) => {
          console.log(`- ${meta.namespace}.${meta.key}: ${meta.value}`);
        });
      }
    } else {
      console.log(`Collection not found for: ${params.collection}`);
    }
  } catch (error) {
    console.error(`Error fetching collection or products for ${params.collection}:`, error);
  }

  // Se não encontrar a coleção no Shopify, usa dados de demonstração
  if (!collection) {
    // Produtos de demonstração para exibir quando a coleção não existe no Shopify
    const demoProducts = generateDemoProducts(params.collection);

    // Retorna a página com produtos de demonstração
    return (
      <CollectionClient
        collection={params.collection}
        products={demoProducts}
        title={params.collection}
        description=""
      />
    );
  }

  // Se não houver produtos na coleção, usa produtos de demonstração
  if (products.length === 0) {
    products = generateDemoProducts(params.collection);
  }

  return (
    <CollectionClient
      collection={params.collection}
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

    return {
      id: `demo-${collection}-${i}`,
      title: `Produto ${i + 1} - ${collection}`,
      handle: `produto-${i + 1}-${collection}`,
      availableForSale: Math.random() > 0.2, // 80% dos produtos estão disponíveis
      featuredImage: {
        url: `https://picsum.photos/seed/${collection}-${i}/800/800`,
        altText: `Produto ${i + 1} - ${collection}`,
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
      description: `Descrição do produto ${i + 1} - ${collection}`,
      descriptionHtml: `<p>Descrição do produto ${i + 1} - ${collection}</p>`,
      options: [],
      variants: [],
      images: [{
        url: `https://picsum.photos/seed/${collection}-${i}/800/800`,
        altText: `Produto ${i + 1} - ${collection}`,
        width: 800,
        height: 800
      }],
      seo: {
        title: `Produto ${i + 1} - ${collection}`,
        description: `Descrição do produto ${i + 1} - ${collection}`
      },
      tags: [],
      updatedAt: new Date().toISOString(),
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: Math.floor(Math.random() * 100)
    };
  });
}
