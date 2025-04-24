'use client';

import { useState } from 'react';
import { useI18n } from 'lib/i18n/i18n-context';
import { IconChevronDown } from '@tabler/icons-react';

export default function LanguageSelector() {
  const { locale, changeLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[#0052cc] hover:text-[#003d99] transition-colors cursor-pointer min-w-[48px]"
      >
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
        <IconChevronDown size={16} stroke={2} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[120px] bg-white rounded-md shadow-lg z-50 border border-[#e0e0e0]">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  changeLocale('fr');
                  setIsOpen(false);
                }}
                className={`block w-full text-center px-4 py-2 text-sm ${
                  locale === 'fr' 
                    ? 'bg-[#0052cc] text-white' 
                    : 'text-[#0052cc] hover:bg-[#f5f5f5]'
                } transition-colors`}
              >
                Français
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  changeLocale('en');
                  setIsOpen(false);
                }}
                className={`block w-full text-center px-4 py-2 text-sm ${
                  locale === 'en' 
                    ? 'bg-[#0052cc] text-white' 
                    : 'text-[#0052cc] hover:bg-[#f5f5f5]'
                } transition-colors`}
              >
                English
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
