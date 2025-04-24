'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import { useState } from 'react';

// Dados de demonstração para depoimentos
const testimonials = [
  {
    id: 1,
    name: 'Jean Dupont',
    role: 'Proprietário de Restaurante',
    content: 'Excelente serviço e produtos de alta qualidade. A instalação foi rápida e profissional. Recomendo fortemente para qualquer negócio que precise de soluções de refrigeração confiáveis.',
    rating: 5,
    image: 'https://picsum.photos/id/1012/300/300'
  },
  {
    id: 2,
    name: 'Marie Laurent',
    role: 'Gerente de Hotel',
    content: 'Os sistemas de ar condicionado que instalamos são extremamente eficientes e reduziram significativamente nossa conta de energia. O suporte técnico é excelente e sempre disponível quando precisamos.',
    rating: 5,
    image: 'https://picsum.photos/id/1027/300/300'
  },
  {
    id: 3,
    name: 'Pierre Martin',
    role: 'Proprietário de Supermercado',
    content: 'Nossos freezers e câmaras frias funcionam perfeitamente há mais de 3 anos sem nenhum problema. Quando precisamos de manutenção, a equipe técnica é sempre rápida e eficiente.',
    rating: 4,
    image: 'https://picsum.photos/id/1025/300/300'
  }
];

export function TestimonialSection() {
  const { t, locale } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">
          {locale === 'fr' ? 'Témoignages de Clients' : 'Customer Testimonials'}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#f8f8f8] rounded-lg p-8 shadow-sm">
            {/* Aspas decorativas */}
            <div className="absolute top-6 left-8 text-[#0052cc] opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-[#666666] italic mb-4">"{testimonials[activeIndex].content}"</p>

                  <div>
                    <h4 className="font-semibold text-[#333333]">{testimonials[activeIndex].name}</h4>
                    <p className="text-sm text-[#666666]">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de navegação */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? 'bg-[#0052cc]' : 'bg-[#cccccc]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Botões de navegação */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-[#0052cc] hover:bg-[#f0f0f0]"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-[#0052cc] hover:bg-[#f0f0f0]"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
