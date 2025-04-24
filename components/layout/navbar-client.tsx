'use client';

import { PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import CartModal from 'components/cart/modal';
import LanguageSelector from 'components/layout/language-selector';
import LogoSquare from 'components/logo-square';
import { useI18n } from 'lib/i18n/i18n-context';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './navbar/mobile-menu';
import Search, { SearchSkeleton } from './navbar/search';

interface NavbarClientProps {
  menu: Menu[];
  siteName: string;
}

export function NavbarClient({ menu, siteName }: NavbarClientProps) {
  const { t } = useI18n();

  return (
    <>
      {/* Top bar com informações de contato */}
      <div className="bg-[#0052cc] text-white py-1 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <span className="mr-4">5% de desconto na primeira compra com o código: BEMVINDO</span>
          </div>
          <div className="flex items-center">
            <Link href="/login" className="flex items-center mr-4 text-white hover:text-gray-200">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{t('common.login')}</span>
            </Link>
            <Link href="/contato" className="flex items-center mr-4 text-white hover:text-gray-200">
              <PhoneIcon className="h-4 w-4 mr-1" />
              <span>{t('common.contact')}</span>
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      {/* Navbar principal */}
      <nav className="relative bg-white border-b border-[#e0e0e0]">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          
          <div className="flex items-center">
            <Link
              href="/"
              prefetch={true}
              className="mr-6 flex items-center"
            >
              <LogoSquare />
              <div className="ml-2 text-xl font-bold text-[#0052cc]">
                {siteName}
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block flex-grow mx-4">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          
          <div className="flex items-center">
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center mr-4">
                {menu.map((item: Menu) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-[#333333] font-medium hover:text-[#0052cc]"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <CartModal />
          </div>
        </div>
      </nav>
      
      {/* Barra de categorias */}
      <div className="bg-[#f5f5f5] border-b border-[#e0e0e0] hidden md:block">
        <div className="container mx-auto">
          <ul className="flex items-center text-sm">
            <li>
              <Link href="/search" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('common.allProducts')}
              </Link>
            </li>
            <li>
              <Link href="/search/ar-condicionado" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('nav.airConditioning')}
              </Link>
            </li>
            <li>
              <Link href="/search/refrigeracao-comercial" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('nav.commercialRefrigeration')}
              </Link>
            </li>
            <li>
              <Link href="/search/pecas-componentes" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('nav.partsComponents')}
              </Link>
            </li>
            <li>
              <Link href="/search/ferramentas-equipamentos" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('nav.tools')}
              </Link>
            </li>
            <li>
              <Link href="/search/promocoes" className="block px-4 py-2 text-[#333333] hover:text-[#0052cc] hover:bg-white">
                {t('common.promotions')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
