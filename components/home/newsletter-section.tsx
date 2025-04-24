'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para enviar o email para seu sistema
    // Por enquanto, apenas simulamos o sucesso
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="py-16 bg-[#0052cc] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <EnvelopeIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Inscreva-se em nossa Newsletter</h2>
          <p className="text-lg mb-8 opacity-90">
            Receba dicas de economia de energia, manutenção preventiva e ofertas exclusivas em produtos de refrigeração.
          </p>

          {subscribed ? (
            <div className="bg-white bg-opacity-20 p-4 rounded-md">
              <p className="text-white">Obrigado por se inscrever! Em breve você receberá nossas novidades.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="flex-grow px-4 py-3 rounded-md text-[#333333] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-[#0052cc] px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
