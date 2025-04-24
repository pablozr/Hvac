'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-md bg-[#0052cc] py-3 px-6 font-medium text-white transition-colors';
  const disabledClasses = 'cursor-not-allowed bg-[#cccccc] hover:bg-[#cccccc]';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Produto Indisponível
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Selecione uma opção"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <ShoppingCartIcon className="h-5 w-5" />
        </div>
        Selecione uma Opção
      </button>
    );
  }

  return (
    <button
      aria-label="Adicionar ao carrinho"
      className={clsx(buttonClasses, {
        'hover:bg-[#003d99]': true
      })}
    >
      <div className="absolute left-0 ml-4">
        <ShoppingCartIcon className="h-5 w-5" />
      </div>
      Adicionar ao Carrinho
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
