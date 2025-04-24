'use client';

import Link from 'next/link';
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
    imageUrl: 'https://images.unsplash.com/photo-1581275233124-e1e5b9df5f9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 2,
    title: 'Refrigeração Comercial',
    subtitle: 'Soluções completas para seu negócio: freezers, câmaras frias e expositores',
    buttonText: 'Soluções Comerciais',
    buttonLink: '/search/refrigeracao-comercial',
    imageUrl: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 3,
    title: 'Instalação Profissional',
    subtitle: 'Equipe técnica especializada para garantir o melhor desempenho do seu equipamento',
    buttonText: 'Saiba Mais',
    buttonLink: '/servicos',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80'
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
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      <div
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex-shrink-0"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
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
                className="bg-[#0052cc] hover:bg-[#003d99] text-white py-3 px-6 rounded-md font-medium transition-colors"
              >
                {slide.id === 1 ? t('banner.slide1.button') :
                 slide.id === 2 ? t('banner.slide2.button') :
                 t('banner.slide3.button')}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
