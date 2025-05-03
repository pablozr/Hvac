'use client';

import Footer from 'components/layout/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Simulação de um produto
const demoProduct = {
  id: 'demo-product',
  title: 'Suporte de Parede para Ar Condicionado Split',
  description: 'Suporte de parede para ar condicionado split com capacidade de até 36.000 BTUs. Fabricado em aço galvanizado de alta resistência, com pintura eletrostática que garante maior durabilidade e resistência à corrosão.',
  price: 249.90,
  compareAtPrice: 299.90,
  discount: '17%',
  rating: 4.9,
  reviewCount: 127,
  inStock: true,
  images: [
    'https://picsum.photos/seed/product1/800/800',
    'https://picsum.photos/seed/product2/800/800',
    'https://picsum.photos/seed/product3/800/800',
    'https://picsum.photos/seed/product4/800/800',
  ],
  options: [
    {
      name: 'Tamanho',
      values: ['7.000 a 12.000 BTUs', '18.000 a 24.000 BTUs', '30.000 a 36.000 BTUs']
    },
    {
      name: 'Cor',
      values: ['Branco', 'Cinza']
    }
  ],
  specifications: [
    { name: 'Material', value: 'Aço Galvanizado' },
    { name: 'Capacidade', value: 'Até 36.000 BTUs' },
    { name: 'Peso Máximo', value: '120 kg' },
    { name: 'Garantia', value: '12 meses' }
  ]
};

// Produtos relacionados
const relatedProducts = [
  {
    id: 'related-1',
    title: 'Suporte de Piso para Condensadora',
    price: 189.90,
    image: 'https://picsum.photos/seed/related1/800/800',
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: 'related-2',
    title: 'Kit Instalação Ar Condicionado Split',
    price: 149.90,
    image: 'https://picsum.photos/seed/related2/800/800',
    rating: 4.8,
    reviewCount: 112
  },
  {
    id: 'related-3',
    title: 'Mangueira de Dreno 1/2"',
    price: 29.90,
    image: 'https://picsum.photos/seed/related3/800/800',
    rating: 4.5,
    reviewCount: 67
  },
  {
    id: 'related-4',
    title: 'Capa para Condensadora',
    price: 79.90,
    image: 'https://picsum.photos/seed/related4/800/800',
    rating: 4.6,
    reviewCount: 45
  }
];

export default function ProductDemoPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    'Tamanho': '7.000 a 12.000 BTUs',
    'Cor': 'Branco'
  });
  const [quantity, setQuantity] = useState(1);

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para selecionar opção
  const selectOption = (name: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [name]: value
    });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb e navegação */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-[#666666] mb-4">
          <Link href="/" className="hover:text-[#0052cc]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-[#0052cc]">Produtos</Link>
          <span className="mx-2">/</span>
          <span className="text-[#333333] font-medium">{demoProduct.title}</span>
        </div>

        <Link href="/search" className="inline-flex items-center text-[#0052cc] hover:underline mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar para produtos</span>
        </Link>
      </div>

      {/* Seção principal do produto */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Galeria de imagens */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <Image
                  src={demoProduct.images[selectedImage] || 'https://placehold.co/800x800/f8f9fa/666666?text=Imagem+não+disponível'}
                  alt={demoProduct.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {demoProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-[#0052cc]' : 'border-[#e0e0e0]'}`}
                  >
                    <Image
                      src={image || 'https://placehold.co/800x800/f8f9fa/666666?text=Imagem+não+disponível'}
                      alt={`${demoProduct.title} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações do produto */}
            <div className="flex flex-col">
              <div className="mb-6 flex flex-col border-b border-[#e0e0e0] pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-[#ff9800]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(demoProduct.rating) ? 'fill-current' : 'fill-[#e0e0e0]'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[#666666] text-sm ml-2">({demoProduct.rating} - {demoProduct.reviewCount} avaliações)</span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-[#333333]">{demoProduct.title}</h1>

                <div className="flex items-center mb-4">
                  <span className="text-[#666666] text-sm line-through mr-2">
                    {formatPrice(demoProduct.compareAtPrice)}
                  </span>
                  <div className="bg-[#0052cc] rounded-md px-3 py-1 text-lg font-bold text-white">
                    {formatPrice(demoProduct.price)}
                  </div>
                  <span className="ml-2 bg-[#ff6b00] text-white text-xs px-2 py-1 rounded-md">
                    {demoProduct.discount} OFF
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center text-[#666666]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Em estoque - Pronta entrega</span>
                  </div>
                  <div className="flex items-center text-[#666666]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Frete grátis para todo Brasil</span>
                  </div>
                  <div className="flex items-center text-[#666666]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Garantia de 12 meses</span>
                  </div>
                </div>
              </div>

              {/* Opções do produto */}
              <div className="mb-6">
                {demoProduct.options.map((option) => (
                  <div key={option.name} className="mb-4">
                    <h3 className="text-base font-medium text-[#333333] mb-2">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => selectOption(option.name, value)}
                          className={`px-4 py-2 rounded-md text-sm border ${
                            selectedOptions[option.name as keyof typeof selectedOptions] === value
                              ? 'border-[#0052cc] bg-[#0052cc] text-white'
                              : 'border-[#e0e0e0] bg-white text-[#333333] hover:border-[#0052cc]'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantidade e botão de compra */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-[#333333] mb-2">Quantidade</h3>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-[#e0e0e0] rounded-l-md bg-white text-[#333333]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 border-t border-b border-[#e0e0e0] text-center text-[#333333]"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-[#e0e0e0] rounded-r-md bg-white text-[#333333]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button className="w-full bg-[#0052cc] text-white py-3 px-6 rounded-md font-medium hover:bg-[#003d99] transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Adicionar ao Carrinho
                </button>
              </div>

              {/* Formas de pagamento */}
              <div className="bg-[#f8f8f8] p-4 rounded-md border border-[#e0e0e0]">
                <h3 className="text-sm font-semibold mb-2 text-[#333333]">Formas de Pagamento</h3>
                <p className="text-xs text-[#666666]">
                  Pague em até 12x no cartão de crédito ou à vista com 5% de desconto.
                </p>
                <div className="flex gap-2 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição detalhada */}
          <div className="border-t border-[#e0e0e0] p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-[#333333]">Descrição Detalhada</h2>
              <div className="prose prose-blue max-w-none text-[#666666]">
                <p>{demoProduct.description}</p>
                <h3>Características</h3>
                <ul>
                  <li>Suporte de alta resistência para ar condicionado split</li>
                  <li>Fabricado em aço galvanizado com pintura eletrostática</li>
                  <li>Resistente à corrosão e intempéries</li>
                  <li>Fácil instalação com manual e kit de parafusos inclusos</li>
                  <li>Compatível com a maioria das marcas de ar condicionado</li>
                </ul>
                <h3>Especificações Técnicas</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {demoProduct.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-[#f8f9fa]' : ''}>
                        <td className="py-2 px-4 border border-[#e0e0e0] font-medium">{spec.name}</td>
                        <td className="py-2 px-4 border border-[#e0e0e0]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-[#333333]">Produtos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm transition-all hover:shadow-md">
              <Link href="#" className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image || 'https://placehold.co/800x800/f8f9fa/666666?text=Imagem+não+disponível'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#333333] mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-[#ff9800]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-[#e0e0e0]'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-[#666666] ml-1">({product.rating})</span>
                  </div>
                  <p className="text-lg font-bold text-[#0052cc]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
