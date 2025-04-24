'use client';

import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { ProductOption, ProductVariant } from 'lib/shopify/types';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-base font-medium text-[#333333]">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...state, [optionNameLowerCase]: value };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) => option.name.toLowerCase() === key && option.values.includes(value)
              )
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the selected options.
            const isActive = state[optionNameLowerCase] === value;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  updateURL(newState);
                }}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? ' (Indisponível)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-md border px-4 py-2 text-sm',
                  {
                    'border-[#0052cc] bg-[#0052cc] text-white font-medium': isActive,
                    'border-[#e0e0e0] bg-white text-[#333333] hover:border-[#0052cc] hover:text-[#0052cc] transition-colors':
                      !isActive && isAvailableForSale,
                    'border-[#e0e0e0] bg-[#f5f5f5] text-[#999999] cursor-not-allowed relative overflow-hidden before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-[#cccccc]':
                      !isAvailableForSale
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
