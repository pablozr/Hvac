'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import Link from 'next/link';

// Dados de demonstração para produtos em destaque
const demoProducts = [
  {
    id: 1,
    title: 'Ar Condicionado Split Inverter 12000 BTUs',
    price: '2.499,00',
    image: '/images/products/ar-condicionado-split.jpg',
    link: '/product/ar-condicionado-split-inverter-12000'
  },
  {
    id: 2,
    title: 'Geladeira Comercial 4 Portas Inox',
    price: '5.890,00',
    image: '/images/products/geladeira-comercial.jpg',
    link: '/product/geladeira-comercial-4-portas'
  },
  {
    id: 3,
    title: 'Kit Ferramentas para Refrigeração',
    price: '899,00',
    image: '/images/products/kit-ferramentas.jpg',
    link: '/product/kit-ferramentas-refrigeracao'
  }
];

interface ProductCardProps {
  product: typeof demoProducts[0];
  size: 'full' | 'half';
}

function ProductCard({ product, size }: ProductCardProps) {
  return (
    <div className={`${size === 'full' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'} group`}>
      <Link href={product.link} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-sm transition-all group-hover:shadow-md">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
              priority={size === 'full'}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-medium text-[#333333] line-clamp-2">{product.title}</h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#0052cc]">R$ {product.price}</p>
              <span className="rounded-md bg-[#0052cc] px-3 py-1 text-xs font-medium text-white">
                Em destaque
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedProducts() {
  const { t } = useI18n();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-8">{t('home.featuredProducts')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductCard product={demoProducts[0]} size="full" />
          <ProductCard product={demoProducts[1]} size="half" />
          <ProductCard product={demoProducts[2]} size="half" />
        </div>

        {/* Botão "Ver todos os produtos" */}
        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-[#0052cc] text-white rounded-md font-medium hover:bg-[#003d99] transition-colors"
          >
            {t('common.allProducts')}
          </Link>
        </div>
      </div>
    </section>
  );
}
