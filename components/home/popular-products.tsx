'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// Dados de demonstração para produtos populares
const demoProducts = [
  {
    id: 1,
    title: 'Ar Condicionado Split 9000 BTUs',
    price: '1.899,00',
    image: 'https://picsum.photos/id/1081/600/600',
    link: '/product/ar-condicionado-split-9000'
  },
  {
    id: 2,
    title: 'Freezer Horizontal 400L',
    price: '3.290,00',
    image: 'https://picsum.photos/id/1083/600/600',
    link: '/product/freezer-horizontal-400l'
  },
  {
    id: 3,
    title: 'Compressor de Ar 2HP',
    price: '1.250,00',
    image: 'https://picsum.photos/id/1040/600/600',
    link: '/product/compressor-ar-2hp'
  },
  {
    id: 4,
    title: 'Expositor Refrigerado Vertical',
    price: '4.590,00',
    image: 'https://picsum.photos/id/1084/600/600',
    link: '/product/expositor-refrigerado-vertical'
  },
  {
    id: 5,
    title: 'Gás Refrigerante R410A',
    price: '590,00',
    image: 'https://picsum.photos/id/1026/600/600',
    link: '/product/gas-refrigerante-r410a'
  },
  {
    id: 6,
    title: 'Ar Condicionado Portátil',
    price: '2.190,00',
    image: 'https://picsum.photos/id/1082/600/600',
    link: '/product/ar-condicionado-portatil'
  }
];

// Duplicamos os produtos para criar um efeito de carrossel infinito
// Triplicamos para garantir espaço para o loop infinito
const carouselProducts = [...demoProducts, ...demoProducts, ...demoProducts];

export function PopularProducts() {
  const { t } = useI18n();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Efeito de animação do carrossel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Usar um ref para guardar o id do intervalo
    const intervalRef = { current: null as NodeJS.Timeout | null };
    // Largura de um "bloco" de produtos (uma cópia)
    const itemCount = demoProducts.length;

    // Inicializa o scroll no início da segunda cópia
    const itemWidth = carousel.firstElementChild?.firstElementChild?.clientWidth || 280;
    const initialScroll = itemWidth * itemCount;
    carousel.scrollLeft = initialScroll;

    const startAutoScroll = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        // Quando chegar no final da segunda cópia, volta para o início da segunda cópia
        if (carousel.scrollLeft >= initialScroll * 2) {
          // Reset sem animação
          carousel.scrollTo({ left: initialScroll, behavior: 'auto' });
        } else {
          carousel.scrollLeft += 1;
        }
      }, 30);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startAutoScroll();

    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    return () => {
      stopAutoScroll();
      carousel.removeEventListener('mouseenter', stopAutoScroll);
      carousel.removeEventListener('mouseleave', startAutoScroll);
    };
  }, []);

  return (
    <section className="py-12 bg-[#f8f8f8]">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-8">{t('home.popularProducts')}</h2>

        <div
          ref={carouselRef}
          className="overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 min-w-max">
            {carouselProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-[280px] flex-none"
              >
                <Link href={product.link} className="block group">
                  <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="280px"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-sm font-medium text-[#333333] line-clamp-2">{product.title}</h3>
                      <p className="text-lg font-bold text-[#0052cc]">R$ {product.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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
