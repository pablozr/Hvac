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

const navigationItems = [
  {
    title: "Todos os Produtos",
    href: "/search",
    items: [
      {
        title: "Lançamentos",
        href: "/search/lancamentos",
        description: "Conheça nossos produtos mais recentes"
      },
      {
        title: "Mais Vendidos",
        href: "/search/mais-vendidos",
        description: "Os produtos favoritos dos nossos clientes"
      },
      {
        title: "Ofertas",
        href: "/search/ofertas",
        description: "Produtos com descontos especiais"
      }
    ]
  },
  {
    title: "Ar Condicionado",
    href: "/search/ar-condicionado",
    items: [
      {
        title: "Split",
        href: "/search/ar-condicionado/split",
        description: "Sistemas split para residências e comércio"
      },
      {
        title: "Janela",
        href: "/search/ar-condicionado/janela",
        description: "Ar condicionado tradicional de janela"
      },
      {
        title: "Portátil",
        href: "/search/ar-condicionado/portatil",
        description: "Soluções móveis de climatização"
      },
      {
        title: "Multi Split",
        href: "/search/ar-condicionado/multi-split",
        description: "Sistemas com múltiplas unidades internas"
      }
    ]
  },
  {
    title: "Refrigeração Comercial",
    href: "/search/refrigeracao-comercial",
    items: [
      {
        title: "Expositores",
        href: "/search/refrigeracao-comercial/expositores",
        description: "Expositores refrigerados verticais e horizontais"
      },
      {
        title: "Balcões",
        href: "/search/refrigeracao-comercial/balcoes",
        description: "Balcões refrigerados para comércio"
      },
      {
        title: "Câmaras Frigoríficas",
        href: "/search/refrigeracao-comercial/camaras",
        description: "Câmaras modulares e monoblocos"
      }
    ]
  },
  {
    title: "Peças e Componentes",
    href: "/search/pecas-componentes",
    items: [
      {
        title: "Compressores",
        href: "/search/pecas-componentes/compressores",
        description: "Compressores para diversos sistemas"
      },
      {
        title: "Condensadores",
        href: "/search/pecas-componentes/condensadores",
        description: "Unidades condensadoras completas"
      },
      {
        title: "Evaporadores",
        href: "/search/pecas-componentes/evaporadores",
        description: "Evaporadores e forçadores de ar"
      }
    ]
  },
  {
    title: "Ferramentas",
    href: "/search/ferramentas-equipamentos",
    items: [
      {
        title: "Manifolds",
        href: "/search/ferramentas-equipamentos/manifolds",
        description: "Conjuntos manométricos digitais e analógicos"
      },
      {
        title: "Vacuômetros",
        href: "/search/ferramentas-equipamentos/vacuometros",
        description: "Medidores de vácuo eletrônicos"
      },
      {
        title: "Recolhedoras",
        href: "/search/ferramentas-equipamentos/recolhedoras",
        description: "Recolhedoras de fluido refrigerante"
      }
    ]
  },
  {
    title: "Promoções",
    href: "/search/promocoes",
    items: [
      {
        title: "Promoções da Semana",
        href: "/search/promocoes/semana",
        description: "Ofertas especiais desta semana"
      },
      {
        title: "Ofertas do Mês",
        href: "/search/promocoes/mes",
        description: "Descontos válidos por todo o mês"
      },
      {
        title: "Clearance",
        href: "/search/promocoes/clearance",
        description: "Últimas unidades com super descontos"
      }
    ]
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
