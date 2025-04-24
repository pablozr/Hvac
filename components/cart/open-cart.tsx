import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-[#0052cc] bg-[#0052cc] text-white transition-colors hover:bg-[#003d99] hover:border-[#003d99]">
      <ShoppingCartIcon
        className={clsx('h-6 w-6 transition-all ease-in-out hover:scale-110', className)}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-5 w-5 rounded-full bg-red-600 text-[11px] font-medium text-white flex items-center justify-center">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
