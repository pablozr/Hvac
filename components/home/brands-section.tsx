'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';

// Dados de demonstração para marcas parceiras
const brands = [
  {
    id: 1,
    name: 'Daikin',
    logo: '/images/brands/brand-placeholder.svg'
  },
  {
    id: 2,
    name: 'Carrier',
    logo: '/images/brands/brand-placeholder.svg'
  },
  {
    id: 3,
    name: 'Mitsubishi Electric',
    logo: '/images/brands/brand-placeholder.svg'
  },
  {
    id: 4,
    name: 'LG',
    logo: '/images/brands/brand-placeholder.svg'
  },
  {
    id: 5,
    name: 'Samsung',
    logo: '/images/brands/brand-placeholder.svg'
  },
  {
    id: 6,
    name: 'Trane',
    logo: '/images/brands/brand-placeholder.svg'
  }
];

export function BrandsSection() {
  const { locale } = useI18n();
  
  return (
    <section className="py-12 bg-white border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-8">
          {locale === 'fr' ? 'Nos Marques Partenaires' : 'Our Partner Brands'}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand.id}
              className="flex items-center justify-center p-4 bg-[#f8f8f8] rounded-md border border-[#e0e0e0] h-24"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#666666] font-medium">{brand.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[#666666]">
            {locale === 'fr' 
              ? 'Nous sommes distributeurs officiels des meilleures marques de climatisation et réfrigération.' 
              : 'We are official distributors of the best air conditioning and refrigeration brands.'}
          </p>
        </div>
      </div>
    </section>
  );
}
