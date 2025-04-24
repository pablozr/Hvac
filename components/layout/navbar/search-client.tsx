'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function SearchClient() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(`/search?${newParams.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full relative">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder={t('common.searchPlaceholder')}
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-full border border-[#e0e0e0] bg-white px-5 py-2 text-[#333333] placeholder:text-[#666666] text-sm transition-all duration-200
        focus:outline-none focus:border-[#0052cc] focus:shadow-[0_0_0_1px_#0052cc20] hover:border-[#0052cc]"
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#666666] hover:text-[#0052cc] transition-colors"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

export function SearchSkeleton() {
  const { t } = useI18n();
  
  return (
    <form className="w-full relative">
      <input
        placeholder={t('common.searchPlaceholder')}
        className="w-full rounded-full border border-[#e0e0e0] bg-white px-5 py-2 text-[#333333] placeholder:text-[#666666] text-sm"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#666666]">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
    </form>
  );
}
