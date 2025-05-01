import { CartProvider } from 'components/cart/cart-context';
import FooterI18n from 'components/layout/footer-i18n';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { I18nProvider } from 'lib/i18n/i18n-context';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  description: 'Especialistas em soluções de refrigeração para residências e empresas, oferecendo produtos de alta eficiência energética e serviços de qualidade.',
  keywords: 'ar condicionado, refrigeração comercial, peças de refrigeração, ferramentas HVAC, climatização, refrigeração',
  robots: {
    follow: true,
    index: true
  },
  openGraph: {
    type: 'website',
    title: SITE_NAME!,
    description: 'Especialistas em soluções de refrigeração para residências e empresas, oferecendo produtos de alta eficiência energética e serviços de qualidade.',
    url: baseUrl,
    siteName: SITE_NAME!,
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'HVAC Commerce - Soluções em Refrigeração'
      }
    ],
    locale: 'fr_FR'
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME!,
    description: 'Especialistas em soluções de refrigeração para residências e empresas, oferecendo produtos de alta eficiência energética e serviços de qualidade.',
    images: [`${baseUrl}/images/og-image.jpg`]
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="fr" className={GeistSans.variable}>
      <body className="bg-[#fafdff] text-[#333333]">
        <I18nProvider>
          <CartProvider cartPromise={cart}>
            <Navbar />
            <main className="min-h-screen">
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
            <FooterI18n />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
