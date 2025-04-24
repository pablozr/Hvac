import Link from 'next/link';
import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Suspense } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="bg-[#f8f8f8] text-[#333333] border-t border-[#e0e0e0]">
      {/* Seção principal do footer */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <Link className="flex items-center gap-2 mb-4" href="/">
              <LogoSquare size="sm" />
              <span className="text-xl font-bold text-[#0052cc]">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-[#666666] mb-4">
              Especialistas em soluções de refrigeração para residências e empresas, oferecendo produtos de alta eficiência energética e serviços de qualidade.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#0052cc] hover:text-[#003d99]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="text-[#0052cc] hover:text-[#003d99]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="#" className="text-[#0052cc] hover:text-[#003d99]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0052cc]">Links Rápidos</h3>
            <Suspense
              fallback={
                <div className="flex flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <FooterMenu menu={menu} />
            </Suspense>
          </div>

          {/* Coluna 3 - Categorias */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0052cc]">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search/ar-condicionado" className="text-[#666666] hover:text-[#0052cc]">
                  Ar Condicionado
                </Link>
              </li>
              <li>
                <Link href="/search/refrigeracao-comercial" className="text-[#666666] hover:text-[#0052cc]">
                  Refrigeração Comercial
                </Link>
              </li>
              <li>
                <Link href="/search/pecas-componentes" className="text-[#666666] hover:text-[#0052cc]">
                  Peças e Componentes
                </Link>
              </li>
              <li>
                <Link href="/search/ferramentas-equipamentos" className="text-[#666666] hover:text-[#0052cc]">
                  Ferramentas e Equipamentos
                </Link>
              </li>
              <li>
                <Link href="/search/promocoes" className="text-[#666666] hover:text-[#0052cc]">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-[#666666] hover:text-[#0052cc]">
                  Ver Todos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0052cc]">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-[#0052cc] mr-2 mt-0.5" />
                <span className="text-[#666666]">Av. Paulista, 1000, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-[#0052cc] mr-2" />
                <span className="text-[#666666]">(11) 9999-9999</span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-[#0052cc] mr-2" />
                <span className="text-[#666666]">contato@hvaccommerce.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seção de pagamentos */}
      <div className="border-t border-[#e0e0e0] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-semibold mb-2">Formas de Pagamento</h4>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Segurança</h4>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
                <div className="w-10 h-6 bg-[#e0e0e0] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#e0e0e0] py-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#666666]">
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Todos os direitos reservados.
            </p>
            <p className="text-sm text-[#666666] mt-2 md:mt-0">
              Desenvolvido com ❤️ por HVAC Commerce
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
