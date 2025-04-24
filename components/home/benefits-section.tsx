'use client';

import { CurrencyDollarIcon, HeartIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: 'Instalação Profissional',
    description: 'Equipe técnica especializada para instalação e manutenção',
    icon: <TruckIcon className="w-10 h-10 text-[#0052cc]" />
  },
  {
    id: 2,
    title: 'Garantia Estendida',
    description: 'Até 3 anos de garantia em produtos selecionados',
    icon: <ShieldCheckIcon className="w-10 h-10 text-[#0052cc]" />
  },
  {
    id: 3,
    title: 'Melhor Custo-Benefício',
    description: 'Produtos de alta eficiência energética que economizam na conta de luz',
    icon: <CurrencyDollarIcon className="w-10 h-10 text-[#0052cc]" />
  },
  {
    id: 4,
    title: 'Suporte Técnico Especializado',
    description: 'Consultoria técnica para escolher o melhor sistema para sua necessidade',
    icon: <HeartIcon className="w-10 h-10 text-[#0052cc]" />
  }
];

export function BenefitsSection() {
  const { t } = useI18n();

  return (
    <section className="py-12 bg-[#f8f8f8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-[#e0e0e0] text-center"
            >
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t(`benefits.${benefit.id === 1 ? 'professionalInstallation' :
                               benefit.id === 2 ? 'extendedWarranty' :
                               benefit.id === 3 ? 'bestValue' : 'technicalSupport'}.title`)}
              </h3>
              <p className="text-[#666666] text-sm">
                {t(`benefits.${benefit.id === 1 ? 'professionalInstallation' :
                               benefit.id === 2 ? 'extendedWarranty' :
                               benefit.id === 3 ? 'bestValue' : 'technicalSupport'}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
