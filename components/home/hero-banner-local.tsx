'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: 'Ar Condicionado de Alta Eficiência',
    subtitle: 'Economize até 40% na conta de energia com nossos modelos inverter',
    buttonText: 'Ver Modelos',
    buttonLink: '/search/ar-condicionado',
    imageUrl: '/images/banners/banner1.png'
  },
  {
    id: 2,
    title: 'Refrigeração Comercial',
    subtitle: 'Soluções completas para seu negócio: freezers, câmaras frias e expositores',
    buttonText: 'Soluções Comerciais',
    buttonLink: '/search/refrigeracao-comercial',
    imageUrl: '/images/banners/banner2.png'
  },
  {
    id: 3,
    title: 'Instalação Profissional',
    subtitle: 'Equipe técnica especializada para garantir o melhor desempenho do seu equipamento',
    buttonText: 'Saiba Mais',
    buttonLink: '/servicos',
    imageUrl: '/images/banners/seila2.webp'
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div className="w-full h-[600px] px-8 md:px-16 my-12">
      <div className="w-full h-full flex">
        {/* Banner fixo à esquerda */}
        <div className="w-2/3 h-full bg-white rounded-l-2xl overflow-hidden shadow-lg">
          <div className="h-full flex flex-col p-12">
            <div className="mb-8">
              <h2 className="text-5xl mb-4">
                <span className="text-[#00d67d] font-bold">APPROVISIONNEMENT</span><br />
                <span className="text-[#1a2333] font-bold">PIÈCES DÉTACHÉES</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Simplicité, facilité et rapidité : AIRCCO simplifie le quotidien des pros <span className="text-[#00d67d]">en quelques clics</span>
              </p>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/app-preview.png"
                  alt="App Preview"
                  width={250}
                  height={500}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-auto">
              <div className="bg-[#12234d] text-white p-8 rounded-xl">
                <p className="mb-4">
                  <span className="text-white font-semibold">Nous </span>
                  <span className="text-[#00d67d] font-semibold">trouvons </span>
                  <span className="text-white font-semibold">votre pièce détachée clim et chauffage</span>
                </p>
                <p className="mb-6">
                  <span className="text-white font-semibold">et nous la </span>
                  <span className="text-[#00d67d] font-semibold">livrons sur votre chantier</span>
                  <span className="text-white font-semibold">!</span>
                </p>
                <button className="bg-[#00d67d] text-white px-6 py-3 rounded-full hover:bg-[#00bf6f] transition-colors text-sm font-medium">
                  Découvrir le service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carrossel à direita */}
        <div className="w-1/3 h-full relative rounded-r-2xl overflow-hidden">
          <div className="w-full h-full">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/20 px-4 py-1 rounded-full text-sm">
                      Nouveauté
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">
                    {t(`banner.slide${slide.id}.title`)}
                  </h1>
                  <p className="text-base md:text-lg mb-6 max-w-md">
                    {t(`banner.slide${slide.id}.subtitle`)}
                  </p>
                  <Link
                    href={slide.buttonLink}
                    className="bg-white text-blue-700 px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors w-fit text-sm"
                  >
                    {t(`banner.slide${slide.id}.button`)}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-8 right-8 flex gap-2 z-20">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-8 flex space-x-2 z-20">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
