'use client';

import { FunnelIcon as FilterIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Filtros disponíveis
const filters = {
  categories: [
    { id: 'ar-condicionado', name: 'Ar Condicionado' },
    { id: 'refrigeracao-comercial', name: 'Refrigeração Comercial' },
    { id: 'pecas-componentes', name: 'Peças e Componentes' },
    { id: 'ferramentas-equipamentos', name: 'Ferramentas e Equipamentos' }
  ],
  brands: [
    { id: 'daikin', name: 'Daikin' },
    { id: 'metalfrio', name: 'Metalfrio' },
    { id: 'suryha', name: 'Suryha' },
    { id: 'elgin', name: 'Elgin' },
    { id: 'schulz', name: 'Schulz' },
    { id: 'consul', name: 'Consul' }
  ],
  price: [
    { id: '0-1000', name: 'Até R$ 1.000' },
    { id: '1000-3000', name: 'R$ 1.000 - R$ 3.000' },
    { id: '3000-5000', name: 'R$ 3.000 - R$ 5.000' },
    { id: '5000-10000', name: 'R$ 5.000 - R$ 10.000' },
    { id: '10000-', name: 'Acima de R$ 10.000' }
  ],
  availability: [
    { id: 'in-stock', name: 'Em estoque' },
    { id: 'out-of-stock', name: 'Fora de estoque' }
  ]
};

// Ordenação
const sortOptions = [
  { id: 'relevance', name: 'Relevância' },
  { id: 'price-asc', name: 'Preço: Menor para Maior' },
  { id: 'price-desc', name: 'Preço: Maior para Menor' },
  { id: 'rating', name: 'Avaliações' },
  { id: 'newest', name: 'Mais Recentes' }
];

interface Product {
  id: string;
  title: string;
  handle: string;
  featuredImage: {
    url: string;
    altText: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
  // Campos adicionais para demonstração
  rating?: number;
  reviews?: number;
}

interface SearchClientProps {
  products: Product[];
  searchValue?: string;
}

export default function SearchClient({ products, searchValue }: SearchClientProps) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: searchParams.getAll('category'),
    brands: searchParams.getAll('brand'),
    price: searchParams.getAll('price'),
    availability: searchParams.getAll('availability')
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');

  // Função para criar uma nova URL com os parâmetros de busca atualizados
  const createQueryString = useCallback(
    (name: string, value: string, action: 'add' | 'remove') => {
      const params = new URLSearchParams(searchParams.toString());

      if (action === 'add') {
        params.append(name, value);
      } else {
        const values = params.getAll(name).filter(v => v !== value);
        params.delete(name);
        values.forEach(v => params.append(name, v));
      }

      return params.toString();
    },
    [searchParams]
  );

  // Função para atualizar os filtros
  const updateFilter = (type: 'categories' | 'brands' | 'price' | 'availability', value: string, checked: boolean) => {
    const paramName = type === 'categories' ? 'category' :
                     type === 'brands' ? 'brand' :
                     type === 'price' ? 'price' : 'availability';

    const action = checked ? 'add' : 'remove';
    const newQueryString = createQueryString(paramName, value, action);

    router.push(`${pathname}?${newQueryString}`);
  };

  // Função para atualizar a ordenação
  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchValue) {
      params.set('q', searchValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Efeito para atualizar os filtros selecionados quando os parâmetros de URL mudam
  useEffect(() => {
    setSelectedFilters({
      categories: searchParams.getAll('category'),
      brands: searchParams.getAll('brand'),
      price: searchParams.getAll('price'),
      availability: searchParams.getAll('availability')
    });

    setSortBy(searchParams.get('sort') || 'relevance');

    // Aplicar filtros aos produtos (simulação - em produção, isso seria feito no servidor)
    let filtered = [...products];

    // Aplicar ordenação
    const sort = searchParams.get('sort');
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.priceRange.maxVariantPrice.amount);
            const priceB = parseFloat(b.priceRange.maxVariantPrice.amount);
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.priceRange.maxVariantPrice.amount);
            const priceB = parseFloat(b.priceRange.maxVariantPrice.amount);
            return priceB - priceA;
          });
          break;
        case 'rating':
          // Simulação - em produção, isso seria baseado em dados reais
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          // Simulação - em produção, isso seria baseado em dados reais
          break;
        default:
          // Relevância (padrão)
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [searchParams, products]);

  // Função para formatar preço
  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode
    }).format(price);
  };

  const resultsText = filteredProducts.length > 1 ? 'results' : 'result';

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('search.allProducts')}</h1>

        {searchValue ? (
          <p className="mb-4">
            {filteredProducts.length === 0
              ? t('search.noResultsFor')
              : `${t('search.showing')} ${filteredProducts.length} ${t(`search.${resultsText}`)} ${t('search.for')} `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}

        {/* Filtros ativos e ordenação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {Object.entries(selectedFilters).flatMap(([type, values]) =>
              values.map(value => {
                const filterType = type as keyof typeof selectedFilters;
                const filterGroup = filterType === 'categories' ? filters.categories :
                                   filterType === 'brands' ? filters.brands :
                                   filterType === 'price' ? filters.price : filters.availability;

                const filterName = filterGroup.find(f => f.id === value)?.name || value;

                return (
                  <button
                    key={`${type}-${value}`}
                    className="flex items-center bg-[#f0f0f0] text-[#333333] px-3 py-1 rounded-full text-sm"
                    onClick={() => updateFilter(filterType, value, false)}
                  >
                    {filterName}
                    <XMarkIcon className="w-4 h-4 ml-1" />
                  </button>
                );
              })
            )}

            {Object.values(selectedFilters).some(values => values.length > 0) && (
              <button
                className="text-[#0052cc] text-sm hover:underline"
                onClick={clearAllFilters}
              >
                {t('search.clearAll')}
              </button>
            )}
          </div>

          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm font-medium">{t('search.sortBy')}:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => updateSort(e.target.value)}
              className="border border-[#e0e0e0] rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {t(`search.sortOptions.${option.id}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros para desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">{t('search.filters')}</h2>

              {/* Categorias */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">{t('search.categories')}</h3>
                <div className="space-y-2">
                  {filters.categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                        checked={selectedFilters.categories.includes(category.id)}
                        onChange={(e) => updateFilter('categories', category.id, e.target.checked)}
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-[#333333]">
                        {t(`categories.${category.id === 'ar-condicionado' ? 'airConditioning' :
                                         category.id === 'refrigeracao-comercial' ? 'commercialRefrigeration' :
                                         category.id === 'pecas-componentes' ? 'partsComponents' : 'tools'}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marcas */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">{t('search.brands')}</h3>
                <div className="space-y-2">
                  {filters.brands.map(brand => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`brand-${brand.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                        checked={selectedFilters.brands.includes(brand.id)}
                        onChange={(e) => updateFilter('brands', brand.id, e.target.checked)}
                      />
                      <label htmlFor={`brand-${brand.id}`} className="ml-2 text-sm text-[#333333]">
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preço */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">{t('search.price')}</h3>
                <div className="space-y-2">
                  {filters.price.map(price => (
                    <div key={price.id} className="flex items-center">
                      <input
                        id={`price-${price.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                        checked={selectedFilters.price.includes(price.id)}
                        onChange={(e) => updateFilter('price', price.id, e.target.checked)}
                      />
                      <label htmlFor={`price-${price.id}`} className="ml-2 text-sm text-[#333333]">
                        {price.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disponibilidade */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">{t('search.availability')}</h3>
                <div className="space-y-2">
                  {filters.availability.map(availability => (
                    <div key={availability.id} className="flex items-center">
                      <input
                        id={`availability-${availability.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                        checked={selectedFilters.availability.includes(availability.id)}
                        onChange={(e) => updateFilter('availability', availability.id, e.target.checked)}
                      />
                      <label htmlFor={`availability-${availability.id}`} className="ml-2 text-sm text-[#333333]">
                        {availability.id === 'in-stock' ? t('product.inStock') : t('product.outOfStock')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botão de filtros para mobile */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              className="flex items-center justify-center w-full bg-white border border-[#e0e0e0] rounded-md px-4 py-2 text-sm font-medium text-[#333333]"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FilterIcon className="h-5 w-5 mr-2" />
              {t('search.filters')}
            </button>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">{t('search.noResults')}</h3>
                <p className="text-[#666666]">{t('search.tryDifferentFilters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group">
                    <Link href={`/product/${product.handle}`} className="block">
                      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={product.featuredImage?.url || '/images/products/product1.svg'}
                            alt={product.featuredImage?.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {!product.availableForSale && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-medium px-3 py-1 bg-red-600 rounded-md">
                                {t('product.outOfStock')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-[#333333] mb-1 line-clamp-2">{product.title}</h3>
                          <div className="flex items-center mb-2">
                            {product.rating && (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    } ${i === Math.floor(product.rating) && product.rating % 1 > 0 ? 'text-yellow-400' : ''}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                {product.reviews && (
                                  <span className="text-xs text-[#666666] ml-1">
                                    ({product.reviews} {t('product.reviews')})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-[#0052cc]">
                              {formatPrice(product.priceRange.maxVariantPrice.amount, product.priceRange.maxVariantPrice.currencyCode)}
                            </p>
                            {product.availableForSale && (
                              <span className="text-xs text-green-600 font-medium">
                                {t('product.inStock')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de filtros para mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)}></div>
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-[#333333]">{t('search.filters')}</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-[#666666]"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 border-t border-[#e0e0e0] px-4 py-6">
                {/* Categorias */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('search.categories')}</h3>
                  <div className="space-y-2">
                    {filters.categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <input
                          id={`mobile-category-${category.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                          checked={selectedFilters.categories.includes(category.id)}
                          onChange={(e) => updateFilter('categories', category.id, e.target.checked)}
                        />
                        <label htmlFor={`mobile-category-${category.id}`} className="ml-2 text-sm text-[#333333]">
                          {t(`categories.${category.id === 'ar-condicionado' ? 'airConditioning' :
                                         category.id === 'refrigeracao-comercial' ? 'commercialRefrigeration' :
                                         category.id === 'pecas-componentes' ? 'partsComponents' : 'tools'}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marcas */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('search.brands')}</h3>
                  <div className="space-y-2">
                    {filters.brands.map(brand => (
                      <div key={brand.id} className="flex items-center">
                        <input
                          id={`mobile-brand-${brand.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                          checked={selectedFilters.brands.includes(brand.id)}
                          onChange={(e) => updateFilter('brands', brand.id, e.target.checked)}
                        />
                        <label htmlFor={`mobile-brand-${brand.id}`} className="ml-2 text-sm text-[#333333]">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('search.price')}</h3>
                  <div className="space-y-2">
                    {filters.price.map(price => (
                      <div key={price.id} className="flex items-center">
                        <input
                          id={`mobile-price-${price.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                          checked={selectedFilters.price.includes(price.id)}
                          onChange={(e) => updateFilter('price', price.id, e.target.checked)}
                        />
                        <label htmlFor={`mobile-price-${price.id}`} className="ml-2 text-sm text-[#333333]">
                          {price.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disponibilidade */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('search.availability')}</h3>
                  <div className="space-y-2">
                    {filters.availability.map(availability => (
                      <div key={availability.id} className="flex items-center">
                        <input
                          id={`mobile-availability-${availability.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#0052cc] focus:ring-[#0052cc] border-[#e0e0e0] rounded"
                          checked={selectedFilters.availability.includes(availability.id)}
                          onChange={(e) => updateFilter('availability', availability.id, e.target.checked)}
                        />
                        <label htmlFor={`mobile-availability-${availability.id}`} className="ml-2 text-sm text-[#333333]">
                          {availability.id === 'in-stock' ? t('product.inStock') : t('product.outOfStock')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full bg-[#0052cc] text-white py-2 rounded-md hover:bg-[#003d99] transition-colors"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    {t('search.applyFilters')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
