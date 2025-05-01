'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const demoProducts = [
  {
    id: 1,
    title: 'Support mural 800 x 465 mm',
    price: '149.90',
    oldPrice: '159.90',
    image: '/images/products/support-mural.png',
    link: '/product/support-mural',
    translationKey: 'products.wallMount'
  },
  {
    id: 2,
    title: 'Mini Aqua Silencer',
    price: '91.93',
    oldPrice: '89.73',
    image: '/images/products/mini-aqua.png',
    link: '/product/mini-aqua-silencer',
    translationKey: 'products.miniAqua'
  },
  {
    id: 3,
    title: 'Liaison frigorifique double 1/4',
    price: '92.10',
    oldPrice: '89.10',
    image: '/images/products/liaison.png',
    link: '/product/liaison-frigorifique',
    translationKey: 'products.refrigerantLine'
  },
  {
    id: 4,
    title: 'Kit Grille de soufflage double',
    price: '22.64',
    oldPrice: '21.84',
    image: '/images/products/kit-grille.png',
    link: '/product/kit-grille',
    translationKey: 'products.blowingGrid'
  },
  {
    id: 5,
    title: 'Tuyau d\'évacuation condensats',
    price: '14.90',
    oldPrice: '16.90',
    image: '/images/products/tuyau.png',
    link: '/product/tuyau-evacuation',
    translationKey: 'products.drainPipe'
  },
  {
    id: 6,
    title: 'Pompe à chaleur air/eau',
    price: '2499.90',
    oldPrice: '2699.90',
    image: '/images/products/pompe-chaleur.png',
    link: '/product/pompe-chaleur',
    translationKey: 'products.heatPump'
  },
  {
    id: 7,
    title: 'Thermostat intelligent WiFi',
    price: '129.90',
    oldPrice: '149.90',
    image: '/images/products/thermostat.png',
    link: '/product/thermostat-wifi',
    translationKey: 'products.smartThermostat'
  },
  {
    id: 8,
    title: 'Kit installation climatisation',
    price: '199.90',
    oldPrice: '219.90',
    image: '/images/products/kit-installation.png',
    link: '/product/kit-installation',
    translationKey: 'products.installationKit'
  },
  {
    id: 9,
    title: 'Détecteur de fuite de gaz',
    price: '79.90',
    oldPrice: '89.90',
    image: '/images/products/detecteur.png',
    link: '/product/detecteur-fuite',
    translationKey: 'products.leakDetector'
  },
  {
    id: 10,
    title: 'Support sol climatisation',
    price: '45.90',
    oldPrice: '49.90',
    image: '/images/products/support-sol.png',
    link: '/product/support-sol',
    translationKey: 'products.floorMount'
  }
];

export function FeaturedProducts() {
  const { t } = useI18n();
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainer.current;
    if (!container) return;

    const scrollAmount = 304; // largura do card (280) + gap (24)
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    
    let newScrollPosition;
    
    if (direction === 'right') {
      if (currentScroll >= maxScroll - 10) {
        newScrollPosition = 0;
      } else {
        newScrollPosition = currentScroll + scrollAmount;
      }
    } else {
      if (currentScroll <= 10) {
        newScrollPosition = maxScroll;
      } else {
        newScrollPosition = currentScroll - scrollAmount;
      }
    }

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-12 bg-[#fafdff] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1a2333]">
            {t('home.topProducts')}
            <div className="h-1 w-16 bg-[#0052cc] mt-2"></div>
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo('left')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0052cc] hover:bg-[#003d99] transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => scrollTo('right')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0052cc] hover:bg-[#003d99] transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        >
          {demoProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[280px]"
            >
              <Link href={product.link} className="block group">
                <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 transition-shadow hover:shadow-md">
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={product.image}
                      alt={t(product.translationKey)}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 280px) 100vw, 280px"
                    />
                  </div>
                  
                  <h3 className="text-sm text-[#1a2333] font-medium mb-2 line-clamp-2">
                    {t(product.translationKey)}
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#0052cc]">
                      {product.price}€
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-[#666666] line-through">
                        {product.oldPrice}€
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
