'use client';

import { useInViewport } from 'lib/hooks/useInViewport';
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useI18n();
  
  // Use our custom hook to detect if the banner is in viewport
  const [bannerRef, isInViewport] = useInViewport<HTMLDivElement>({ threshold: 0.3 });

  // Limpar o timer quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Iniciar o timer para mudar os slides automaticamente
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
  }, []);

  // Pausar ou iniciar o timer com base na visibilidade
  useEffect(() => {
    if (isInViewport) {
      startTimer();
      console.log('Banner is visible, starting timer');
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('Banner is not visible, stopping timer');
    }
  }, [isInViewport, startTimer]);

  // Reiniciar o timer quando o slide mudar (apenas se estiver visível)
  useEffect(() => {
    if (isInViewport) {
      startTimer();
    }
  }, [currentSlide, startTimer, isInViewport]);

  // Função para ir para um slide específico
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Desativar a transição após a animação terminar
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [currentSlide, isTransitioning]);

  // Função para ir para o próximo slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    goToSlide((currentSlide + 1) % bannerSlides.length);
  }, [currentSlide, goToSlide, isTransitioning]);

  // Função para ir para o slide anterior
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length);
  }, [currentSlide, goToSlide, isTransitioning, bannerSlides.length]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden" ref={bannerRef}>
      {/* Slides */}
      <div className="w-full h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } ${slide.bgColor}`}
          >
            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {slide.id === 1 ? t('banner.slide1.title') :
                 slide.id === 2 ? t('banner.slide2.title') :
                 t('banner.slide3.title')}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-md">
                {slide.id === 1 ? t('banner.slide1.subtitle') :
                 slide.id === 2 ? t('banner.slide2.subtitle') :
                 t('banner.slide3.subtitle')}
              </p>
              <Link
                href={slide.buttonLink}
                className="bg-white hover:bg-gray-100 text-blue-700 py-3 px-6 rounded-md font-medium transition-colors"
              >
                {slide.id === 1 ? t('banner.slide1.button') :
                 slide.id === 2 ? t('banner.slide2.button') :
                 t('banner.slide3.button')}
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden md:block">
              {slide.id === 1 && (
                <div className="w-64 h-64 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-blue-500 bg-opacity-40"></div>
                  </div>
                </div>
              )}
              {slide.id === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-24 h-24 rounded-lg bg-blue-500 bg-opacity-20"></div>
                  <div className="w-24 h-24 rounded-lg bg-blue-500 bg-opacity-30"></div>
                  <div className="w-24 h-24 rounded-lg bg-blue-500 bg-opacity-40"></div>
                  <div className="w-24 h-24 rounded-lg bg-blue-500 bg-opacity-50"></div>
                </div>
              )}
              {slide.id === 3 && (
                <div className="flex flex-col space-y-4">
                  <div className="w-64 h-8 rounded-full bg-blue-500 bg-opacity-20"></div>
                  <div className="w-48 h-8 rounded-full bg-blue-500 bg-opacity-30"></div>
                  <div className="w-32 h-8 rounded-full bg-blue-500 bg-opacity-40"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
}
