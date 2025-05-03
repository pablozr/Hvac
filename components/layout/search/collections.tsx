'use client';

import clsx from 'clsx';
import { useI18n } from 'lib/i18n/i18n-context';
import { Suspense } from 'react';
import FilterList from './filter';

// Definição das categorias principais e suas subcategorias para o menu de filtragem
const mainCategories = [
  {
    title: "Collections",
    path: "/search"
  },
  {
    title: "Appareil de mesure",
    path: "/search/outillage/appareil-de-mesure"
  },
  {
    title: "Climatisation, ventilation et déshumidification",
    path: "/search/climatisation-ventilation"
  },
  {
    title: "Hidden: Homepage Featured Items",
    path: "/search/hidden-homepage-featured-items"
  },
  {
    title: "Liaisons frigorifiques",
    path: "/search/liaisons-frigorifiques"
  },
  {
    title: "Nouveautés MAXIMA",
    path: "/search/nouveautes-maxima"
  },
  {
    title: "Nouveautés REFCO",
    path: "/search/nouveautes-refco"
  },
  {
    title: "Outillage",
    path: "/search/outillage"
  },
  {
    title: "Outillage à main",
    path: "/search/outillage-a-main"
  },
  {
    title: "Outillage frigoriste",
    path: "/search/outillage-frigoriste"
  },
  {
    title: "Outillage general",
    path: "/search/outillage-general"
  },
  {
    title: "Promoções",
    path: "/search/promocoes"
  },
  {
    title: "Univers de la PAC et ECS",
    path: "/search/univers-pac-ecs"
  },
  {
    title: "Vérification annuelle",
    path: "/search/verification-annuelle"
  }
];

function CollectionList() {
  const { t } = useI18n();
  return <FilterList list={mainCategories} title={t('search.categories')} />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
