'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useI18n } from 'lib/i18n/i18n-context';

interface MenuItem {
  icon?: string;
  title: string;
  href: string;
  items?: {
    title: string;
    href: string;
  }[];
}

export default function MegaMenu({ items }: { items: MenuItem[] }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={menuRef} className="relative">
      <div className="flex items-center space-x-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="relative group"
            onMouseEnter={() => setActiveMenu(item.title)}
          >
            <Link
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-[#0052cc]"
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
              <span>{t(`nav.${item.title}`)}</span>
            </Link>

            {activeMenu === item.title && item.items && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ 
                  position: 'absolute',
                  left: 0,
                  top: '100%',
                  zIndex: 50,
                  width: '100vw',
                  maxWidth: '1280px',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  marginTop: '1px'
                }}
              >
                <div className="grid grid-cols-4 gap-6">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="group flex flex-col space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#0052cc]/10 flex items-center justify-center">
                          {/* Você pode adicionar ícones específicos aqui */}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#0052cc]">
                          {t(`nav.${subItem.title}`)}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
