'use client';

import { BenefitsSection } from 'components/home/benefits-section';
import { BrandsSection } from 'components/home/brands-section';
import { CategorySection } from 'components/home/category-section';
import { FeaturedProducts } from 'components/home/featured-products';
import { HeroBanner } from 'components/home/hero-banner-local';
import { NewsletterSection } from 'components/home/newsletter-section';
import { PopularProducts } from 'components/home/popular-products';
import { TestimonialSection } from 'components/home/testimonial-section';
import { useI18n } from 'lib/i18n/i18n-context';

// Metadata movida para layout.tsx para compatibilidade com 'use client'

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* Banner principal com slider */}
      <HeroBanner/>

      {/* Seção de produtos em destaque */}
      <FeaturedProducts />

      {/* Seção de categorias */}
      <CategorySection />

      {/* Seção de produtos populares */}
      <PopularProducts />

      {/* Seção de benefícios */}
      <BenefitsSection />

      {/* Seção de depoimentos */}
      <TestimonialSection />

      {/* Seção de marcas parceiras */}
      <BrandsSection />

      {/* Seção de newsletter */}
      <NewsletterSection />
    </>
  );
}
