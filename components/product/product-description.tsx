import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b border-[#e0e0e0] pb-6">
        <div className="flex items-center mb-2">
          <div className="flex text-[#ff9800]">
            <StarIcon className="h-5 w-5" />
            <StarIcon className="h-5 w-5" />
            <StarIcon className="h-5 w-5" />
            <StarIcon className="h-5 w-5" />
            <StarIcon className="h-5 w-5" />
          </div>
          <span className="text-[#666666] text-sm ml-2">(4.9 - 120 avaliações)</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-[#333333]">{product.title}</h1>

        <div className="flex items-center mb-4">
          <span className="text-[#666666] text-sm line-through mr-2">
            R$ {(parseFloat(product.priceRange.maxVariantPrice.amount) * 1.2).toFixed(2)}
          </span>
          <div className="bg-[#0052cc] rounded-md px-3 py-1 text-lg font-bold text-white">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          <span className="ml-2 bg-[#ff6b00] text-white text-xs px-2 py-1 rounded-md">
            20% OFF
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center text-[#666666]">
            <TruckIcon className="h-5 w-5 mr-2 text-[#0052cc]" />
            <span>Entrega em todo Brasil</span>
          </div>
          <div className="flex items-center text-[#666666]">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-[#0052cc]" />
            <span>Garantia de 12 meses</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-[#333333]">Opções Disponíveis</h3>
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      <div className="mb-6 border-t border-b border-[#e0e0e0] py-6">
        <h3 className="text-lg font-semibold mb-3 text-[#333333]">Descrição do Produto</h3>
        {product.descriptionHtml ? (
          <Prose
            className="text-sm leading-relaxed text-[#666666]"
            html={product.descriptionHtml}
          />
        ) : null}
      </div>

      <div className="mb-6">
        <AddToCart product={product} />
      </div>

      <div className="bg-[#f8f8f8] p-4 rounded-md border border-[#e0e0e0]">
        <h3 className="text-sm font-semibold mb-2 text-[#333333]">Formas de Pagamento</h3>
        <p className="text-xs text-[#666666]">
          Pague em até 12x no cartão de crédito ou à vista com 5% de desconto.
        </p>
      </div>
    </>
  );
}
