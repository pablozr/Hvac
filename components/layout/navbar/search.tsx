'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  return (
    <Form action="/search" className="w-[550px] relative mx-auto">
      <input
        key={searchParams?.get('q')}
        name="q"
        type="text"
        placeholder={t('common.searchPlaceholder')}
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-full bg-[#f5f5f5] border border-[#FFFFFF] px-5 py-2.5 text-[#333333] placeholder:text-[#666666] text-sm transition-all duration-200
        focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0052cc]"
      />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#666666] hover:text-[#0052cc] transition-colors"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  const { t } = useI18n();

  return (
    <form className="w-[550px] relative mx-auto">
      <input
        placeholder={t('common.searchPlaceholder')}
        className="w-full rounded-full bg-[#f5f5f5] border border-[#e0e0e0] px-5 py-2.5 text-[#333333] placeholder:text-[#666666] text-sm"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#666666]">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
    </form>
  );
}
