'use client';

import { IconHeadset, IconUser } from '@tabler/icons-react';
import CartModal from 'components/cart/modal';
import LanguageSelector from 'components/layout/language-selector';
import LogoSquare from 'components/logo-square';
import { NavbarMenu } from 'components/ui/navbar-menu';
import { useI18n } from 'lib/i18n/i18n-context';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './navbar/mobile-menu';
import Search, { SearchSkeleton } from './navbar/search';

// Definição das categorias principais e suas subcategorias
const navigationItems = [
  {
    title: "Outillage",
    href: "/search/outillage",
    items: [
      {
        title: "Appareil de mesure",
        href: "/search/outillage/appareil-de-mesure",
        description: "Appareils de mesure pour les professionnels"
      },
      {
        title: "Outillage frigoriste",
        href: "/search/outillage/outillage-frigoriste",
        description: "Outils spécialisés pour les techniciens frigoristes"
      },
      {
        title: "Outillage à main",
        href: "/search/outillage/outillage-a-main",
        description: "Outils à main pour l'installation et maintenance"
      },
      {
        title: "Vérification annuelle",
        href: "/search/outillage/verification-annuelle",
        description: "Équipements pour la vérification annuelle"
      },
      {
        title: "Outillage general",
        href: "/search/outillage/outillage-general",
        description: "Outils généraux pour les professionnels"
      },
      {
        title: "Nouveautés REFCO",
        href: "/search/outillage/nouveautes-refco",
        description: "Nouveaux outils REFCO pour les professionnels"
      },
      {
        title: "Nouveautés MAXIMA",
        href: "/search/outillage/nouveautes-maxima",
        description: "Les dernières innovations MAXIMA"
      }
    ]
  },
  {
    title: "Liaisons frigorifiques",
    href: "/search/liaisons-frigorifiques",
    items: []
  },
  {
    title: "Univers de la PAC et ECS",
    href: "/search/univers-pac-ecs",
    items: []
  },
  {
    title: "Climatisation, ventilation et déshumidification",
    href: "/search/climatisation-ventilation",
    items: []
  },
  {
    title: "Promoções",
    href: "/search/promocoes",
    items: []
  }
];

export function NavbarClient({ menu, siteName }: { menu: Menu[]; siteName: string }) {
  const { t } = useI18n();

  return (
    <>
      {/* Navbar principal */}
      <nav className="relative bg-white border-b border-[#e0e0e0]">
        <div className="container mx-auto flex items-center justify-between py-6 px-8">
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>

          <div className="flex items-center">
            <Link
              href="/"
              prefetch={true}
              className="mr-8 flex items-center"
            >
              <LogoSquare size="lg" />
              <div className="ml-3 text-2xl font-bold text-[#0052cc]">
                {siteName}
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-grow items-center gap-8">
            <div className="flex-grow">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-8">
                <Link
                  href="/login"
                  className="flex flex-col items-center text-[#666666] hover:text-[#0052cc] text-center no-underline"
                >
                  <IconUser stroke={1.5} size={24} />
                  <span className="text-xs mt-1 no-underline">{t('common.login')}</span>
                </Link>

                <Link
                  href="/contato"
                  className="flex flex-col items-center text-[#666666] hover:text-[#0052cc] text-center no-underline"
                >
                  <IconHeadset stroke={1.5} size={24} />
                  <span className="text-xs mt-1 no-underline">{t('common.contact')}</span>
                </Link>

                <div className="flex flex-col items-center text-[#666666] hover:text-[#0052cc] text-center cursor-pointer">
                  <CartModal />
                  <span className="text-xs mt-1">{t('common.cart')}</span>
                </div>
              </div>

              <div className="border-l border-[#e0e0e0] h-8 mx-8" />

              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Barra de categorias com o novo menu */}
      <div className="bg-white border-b border-[#e0e0e0] hidden md:block shadow-[inset_0_10px_8px_-10px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-8">
          <NavbarMenu items={navigationItems} />
        </div>
      </div>
    </>
  );
}
