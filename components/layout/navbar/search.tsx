'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  return (
    <Form action="/search" className="w-full relative">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder={t('common.searchPlaceholder')}
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-md border border-[#e0e0e0] bg-white px-4 py-2 text-[#333333] placeholder:text-[#666666] text-sm focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
      />
      <button type="submit" className="absolute right-0 top-0 h-full px-3 text-[#0052cc]">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  const { t } = useI18n();

  return (
    <form className="w-full relative">
      <input
        placeholder={t('common.searchPlaceholder')}
        className="w-full rounded-md border border-[#e0e0e0] bg-white px-4 py-2 text-[#333333] placeholder:text-[#666666] text-sm"
      />
      <div className="absolute right-0 top-0 h-full px-3 text-[#0052cc]">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </div>
    </form>
  );
}
