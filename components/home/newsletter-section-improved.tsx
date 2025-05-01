'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useI18n } from 'lib/i18n/i18n-context';
import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    try {
      // Aqui você implementaria a lógica para enviar o email para seu sistema
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      setEmail('');
      
      // Reset após 5 segundos
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (error) {
      console.error('Erro ao inscrever:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[#0052cc] to-[#003d99] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110 duration-300">
            <EnvelopeIcon className="w-10 h-10 mx-auto" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">{t('newsletter.title')}</h2>
          <p className="text-lg mb-8 opacity-90">
            {t('newsletter.description')}
          </p>

          {subscribed ? (
            <div className="bg-white bg-opacity-20 p-6 rounded-md shadow-lg animate-fade-in">
              <p className="text-white text-lg">{t('newsletter.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                required
                className="flex-grow px-4 py-3 rounded-md text-[#333333] focus:outline-none focus:ring-2 focus:ring-white shadow-md"
                disabled={loading}
              />
              <button
                type="submit"
                className={`bg-white text-[#0052cc] px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-md ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? t('common.loading') : t('newsletter.button')}
              </button>
            </form>
          )}
          
          <p className="mt-4 text-sm opacity-70">
            {t('newsletter.privacy')}
          </p>
        </div>
      </div>
    </section>
  );
}
