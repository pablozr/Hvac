import type { Metadata } from 'next';

import { ArrowLeftIcon, ShieldCheckIcon, StarIcon, TruckIcon } from '@heroicons/react/24/outline';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import { Image } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  let product = await getProduct(params.handle);

  // Se o produto não existir no Shopify, cria um produto de demonstração para metadados
  if (!product) {
    const handle = params.handle;
    const title = handle
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title: title,
      description: `Compre ${title} com o melhor preço e entrega rápida.`,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true
        }
      },
      openGraph: {
        images: [
          {
            url: `https://picsum.photos/seed/${handle}/800/800`,
            width: 800,
            height: 800,
            alt: title
          }
        ]
      }
    };
  }

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  let product = await getProduct(params.handle);

  // Se o produto não existir no Shopify, cria um produto de demonstração
  if (!product) {
    product = generateDemoProduct(params.handle);
  }

  // Obter produtos da mesma categoria para "Você também pode gostar"
  const categoryProducts = await getProducts({ query: '', reverse: false, sortKey: 'RELEVANCE' });
  const similarProducts = categoryProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Função para gerar um produto de demonstração
  function generateDemoProduct(handle: string) {
  const title = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: `demo-${handle}`,
    handle,
    availableForSale: true,
    title,
    description: `Descrição detalhada do produto ${title}. Este é um produto de demonstração com todas as características e especificações que você esperaria de um produto de alta qualidade.`,
    descriptionHtml: `<p>Descrição detalhada do produto ${title}. Este é um produto de demonstração com todas as características e especificações que você esperaria de um produto de alta qualidade.</p><ul><li>Característica 1</li><li>Característica 2</li><li>Característica 3</li></ul>`,
    options: [
      {
        id: 'option1',
        name: 'Tamanho',
        values: ['Pequeno', 'Médio', 'Grande']
      },
      {
        id: 'option2',
        name: 'Cor',
        values: ['Branco', 'Preto', 'Azul']
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: String(Math.floor(Math.random() * 10000) + 500),
        currencyCode: 'BRL'
      },
      minVariantPrice: {
        amount: String(Math.floor(Math.random() * 500) + 100),
        currencyCode: 'BRL'
      }
    },
    variants: [
      {
        id: `variant-1-${handle}`,
        title: 'Pequeno / Branco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Tamanho', value: 'Pequeno' },
          { name: 'Cor', value: 'Branco' }
        ],
        price: {
          amount: String(Math.floor(Math.random() * 500) + 100),
          currencyCode: 'BRL'
        }
      },
      {
        id: `variant-2-${handle}`,
        title: 'Médio / Preto',
        availableForSale: true,
        selectedOptions: [
          { name: 'Tamanho', value: 'Médio' },
          { name: 'Cor', value: 'Preto' }
        ],
        price: {
          amount: String(Math.floor(Math.random() * 700) + 300),
          currencyCode: 'BRL'
        }
      },
      {
        id: `variant-3-${handle}`,
        title: 'Grande / Azul',
        availableForSale: true,
        selectedOptions: [
          { name: 'Tamanho', value: 'Grande' },
          { name: 'Cor', value: 'Azul' }
        ],
        price: {
          amount: String(Math.floor(Math.random() * 1000) + 500),
          currencyCode: 'BRL'
        }
      }
    ],
    featuredImage: {
      url: `https://picsum.photos/seed/${handle}/800/800`,
      altText: title,
      width: 800,
      height: 800
    },
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `https://picsum.photos/seed/${handle}-${i}/800/800`,
      altText: `${title} - Imagem ${i + 1}`,
      width: 800,
      height: 800
    })),
    seo: {
      title,
      description: `Compre ${title} com o melhor preço e entrega rápida.`
    },
    tags: [],
    updatedAt: new Date().toISOString()
  };
}

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />

      <div className="bg-[#f8f9fa] min-h-screen">
        {/* Breadcrumb e navegação */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-[#666666] mb-4">
            <Link href="/" className="hover:text-[#0052cc]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-[#0052cc]">Produtos</Link>
            <span className="mx-2">/</span>
            <span className="text-[#333333] font-medium">{product.title}</span>
          </div>

          <Link href="/search" className="inline-flex items-center text-[#0052cc] hover:underline mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            <span>Voltar para produtos</span>
          </Link>
        </div>

        {/* Seção principal do produto */}
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Galeria de imagens */}
              <div className="relative">
                <Suspense
                  fallback={
                    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
                  }
                >
                  <Gallery
                    images={product.images.slice(0, 5).map((image: Image) => ({
                      src: image.url,
                      altText: image.altText
                    }))}
                  />
                </Suspense>
              </div>

              {/* Informações do produto */}
              <div className="flex flex-col">
                <Suspense fallback={null}>
                  <ProductDescription product={product} />
                </Suspense>

                {/* Informações adicionais */}
                <div className="mt-8 border-t border-[#e0e0e0] pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-[#333333]">Informações do Produto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#f8f9fa] p-4 rounded-md">
                      <h4 className="font-medium text-[#333333] mb-2">Especificações</h4>
                      <ul className="text-sm text-[#666666] space-y-2">
                        <li>Marca: Premium HVAC</li>
                        <li>Modelo: {product.title}</li>
                        <li>Garantia: 12 meses</li>
                        <li>Origem: Importado</li>
                      </ul>
                    </div>
                    <div className="bg-[#f8f9fa] p-4 rounded-md">
                      <h4 className="font-medium text-[#333333] mb-2">Entrega</h4>
                      <ul className="text-sm text-[#666666] space-y-2">
                        <li className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-2 text-[#0052cc]" />
                          <span>Entrega em todo Brasil</span>
                        </li>
                        <li className="flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 mr-2 text-[#0052cc]" />
                          <span>Garantia de 12 meses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição detalhada */}
            <div className="border-t border-[#e0e0e0] p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-[#333333]">Descrição Detalhada</h2>
                <div className="prose prose-blue max-w-none text-[#666666]">
                  {product.descriptionHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                  ) : (
                    <p>{product.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 text-[#333333]">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RelatedProducts id={product.id} />
          </div>
        </div>

        {/* Você também pode gostar */}
        <div className="container mx-auto px-4 py-12 border-t border-[#e0e0e0]">
          <h2 className="text-2xl font-bold mb-6 text-[#333333]">Você Também Pode Gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <div key={product.handle} className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm transition-all hover:shadow-md">
                <Link href={`/product/${product.handle}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.featuredImage?.url || '/images/placeholder.png'}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-[#333333] mb-1 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-[#ff9800]">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-[#666666] ml-1">(5.0)</span>
                    </div>
                    <p className="text-lg font-bold text-[#0052cc]">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: product.priceRange.maxVariantPrice.currencyCode
                      }).format(parseFloat(product.priceRange.maxVariantPrice.amount))}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  let relatedProducts: any[] = [];
  try {
    relatedProducts = await getProductRecommendations(id);
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
  }

  if (!relatedProducts.length) {
    // Fallback para produtos de demonstração se não houver recomendações
    return (
      <>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-[#f8f9fa]">
              <div className="absolute inset-0 flex items-center justify-center text-[#cccccc]">
                Produto Indisponível
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-[#333333] mb-1">Produto Relacionado</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-[#ff9800]">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#666666] ml-1">(5.0)</span>
              </div>
              <p className="text-lg font-bold text-[#0052cc]">R$ 0,00</p>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {relatedProducts.slice(0, 4).map((product) => (
        <div key={product.handle} className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm transition-all hover:shadow-md">
          <Link href={`/product/${product.handle}`} className="block">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.featuredImage?.url || '/images/placeholder.png'}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-[#333333] mb-1 line-clamp-2">{product.title}</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-[#ff9800]">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#666666] ml-1">(5.0)</span>
              </div>
              <p className="text-lg font-bold text-[#0052cc]">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: product.priceRange.maxVariantPrice.currencyCode
                }).format(parseFloat(product.priceRange.maxVariantPrice.amount))}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
