import { CartProvider } from 'components/cart/cart-context';
import Footer from 'components/layout/footer';
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
  robots: {
    follow: true,
    index: true
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
      <body className="bg-white text-[#333333]">
        <I18nProvider>
          <CartProvider cartPromise={cart}>
            <Navbar />
            <main className="min-h-screen">
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
