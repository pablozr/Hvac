"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from 'lib/i18n/i18n-context';

interface MenuItem {
  title: string;
  href: string;
  description?: string;
  items?: { title: string; href: string; description?: string }[];
}

export const NavbarMenu = ({
  items,
}: {
  items: MenuItem[];
}) => {
  const { t } = useI18n();
  
  return (
    <div className="hidden md:flex items-center justify-center gap-2">
      {items.map((item, idx) => (
        <NavbarMenuItem key={idx} item={{
          ...item,
          title: t(`nav.${item.title}`),
          items: item.items?.map(subItem => ({
            ...subItem,
            title: t(`nav.${subItem.title}`),
            description: subItem.description ? t(`nav.${subItem.description}`) : undefined
          }))
        }} />
      ))}
    </div>
  );
};

const NavbarMenuItem = ({
  item,
}: {
  item: MenuItem;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className="nav-link"
      >
        {item.title}
      </Link>
      {item.items && isOpen && (
        <>
          {/* Área invisível para manter o menu aberto */}
          <div 
            className="absolute top-full left-0 h-4 w-full"
            style={{ marginTop: '-0.5rem' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              width: '20rem',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="relative z-50 flex flex-col p-4 space-y-4">
              {item.items.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.href}
                  className="relative flex items-center gap-2 p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors duration-200"
                >
                  <div>
                    <div className="font-medium text-sm text-[#333333]">
                      {subItem.title}
                    </div>
                    {subItem.description && (
                      <div className="text-xs text-[#666666]">
                        {subItem.description}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};







