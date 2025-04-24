'use client';

import { useState } from 'react';
import { useI18n } from 'lib/i18n/i18n-context';

export default function LanguageSelector() {
  const { locale, changeLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (newLocale: 'fr' | 'en') => {
    changeLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-white hover:text-gray-200"
      >
        <span className="mr-1">{locale.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === 'fr' ? 'bg-[#0052cc] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Français
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === 'en' ? 'bg-[#0052cc] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
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
