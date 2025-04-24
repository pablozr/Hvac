import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import { BenefitsSection } from 'components/home/benefits-section';
import { CategorySection } from 'components/home/category-section';
import { HeroBanner } from 'components/home/hero-banner';
import { NewsletterSection } from 'components/home/newsletter-section';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <div className="container mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-8">Produtos em Destaque</h2>
        <ThreeItemGrid />
      </div>

      <CategorySection />

      <div className="container mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-8">Produtos Populares</h2>
        <Carousel />
      </div>

      <BenefitsSection />

      <NewsletterSection />
    </>
  );
}
