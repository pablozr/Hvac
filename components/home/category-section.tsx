'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    title: 'Ar Condicionado',
    image: '/images/categories/ar-condicionado.jpg',
    link: '/search/ar-condicionado'
  },
  {
    id: 2,
    title: 'Refrigeração Comercial',
    image: '/images/categories/refrigeracao-comercial.jpg',
    link: '/search/refrigeracao-comercial'
  },
  {
    id: 3,
    title: 'Peças e Componentes',
    image: '/images/categories/pecas-componentes.jpg',
    link: '/search/pecas-componentes'
  },
  {
    id: 4,
    title: 'Ferramentas e Equipamentos',
    image: '/images/categories/ferramentas.jpg',
    link: '/search/ferramentas-equipamentos'
  }
];

export function CategorySection() {
  const { t } = useI18n();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">{t('home.refrigerationSolutions')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group"
            >
              <div className="relative h-64 overflow-hidden rounded-lg shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">
                    {t(`categories.${category.id === 1 ? 'airConditioning' :
                                     category.id === 2 ? 'commercialRefrigeration' :
                                     category.id === 3 ? 'partsComponents' : 'tools'}`)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
