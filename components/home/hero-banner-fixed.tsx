'use client';

import { useI18n } from 'lib/i18n/i18n-context';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: 'Ar Condicionado de Alta Eficiência',
    subtitle: 'Economize até 40% na conta de energia com nossos modelos inverter',
    buttonText: 'Ver Modelos',
    buttonLink: '/search/ar-condicionado',
    bgColor: 'bg-gradient-to-r from-blue-700 to-blue-900'
  },
  {
    id: 2,
    title: 'Refrigeração Comercial',
    subtitle: 'Soluções completas para seu negócio: freezers, câmaras frias e expositores',
    buttonText: 'Soluções Comerciais',
    buttonLink: '/search/refrigeracao-comercial',
    bgColor: 'bg-gradient-to-r from-blue-800 to-indigo-900'
  },
  {
    id: 3,
    title: 'Instalação Profissional',
    subtitle: 'Equipe técnica especializada para garantir o melhor desempenho do seu equipamento',
    buttonText: 'Saiba Mais',
    buttonLink: '/servicos',
    bgColor: 'bg-gradient-to-r from-indigo-700 to-purple-900'
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useI18n();

  return (
    <div className="w-full h-[500px] flex gap-4 px-4 md:px-8">
      {/* Banner fixo à esquerda */}
      <div className="w-1/3 h-full bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-full flex flex-col items-start justify-center p-8 bg-gradient-to-br from-[#00ff9d]/10 to-[#00ff9d]/5">
          <h2 className="text-4xl font-bold text-[#1a2333] mb-4">
            Approvisionnement<br />
            <span className="text-[#00ff9d]">Pièces Détachées</span>
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Simplicité, facilité et rapidité : AIRCCO simplifie le quotidien des pros en quelques clics
          </p>
          <div className="mb-8">
            <Image
              src="/images/app-preview.png" // Substitua pelo caminho da sua imagem
              alt="App Preview"
              width={300}
              height={600}
              className="mx-auto"
            />
          </div>
          <button className="bg-[#1a2333] text-white px-8 py-3 rounded-full hover:bg-[#2a3343] transition-colors">
            Découvrir le service →
          </button>
        </div>
      </div>

      {/* Carrossel à direita */}
      <div className="w-2/3 h-full relative rounded-2xl overflow-hidden">
        <div className="w-full h-full">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              } ${slide.bgColor}`}
            >
              <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    Nouveauté
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {t(`banner.slide${slide.id}.title`)}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-md">
                  {t(`banner.slide${slide.id}.subtitle`)}
                </p>
                <Link 
                  href={slide.buttonLink}
                  className="bg-white text-blue-700 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors w-fit"
                >
                  {t(`banner.slide${slide.id}.button`)}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação do carrossel */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-20">
          <button
            onClick={() => !isTransitioning && setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => !isTransitioning && setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Indicadores do carrossel */}
        <div className="absolute bottom-8 left-8 flex space-x-2 z-20">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => !isTransitioning && setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
