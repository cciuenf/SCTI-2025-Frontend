'use client';

import { handleGetAllUserTokens } from '@/actions/product-actions';
import { UserTokensResponseI } from '@/types/product-interfaces';
import { useEffect, useState } from 'react';

export default function UserTokens() {
  const [tokens, setTokens] = useState<UserTokensResponseI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await handleGetAllUserTokens();
        if (res.success) setTokens(res.data);
      } catch (error) {
        console.error('Erro ao carregar tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) return <div>Carregando tokens...</div>;

  return (
    <div className="w-full max-w-4xl mt-6">
      <h2 className="font-black text-xl mb-4">Produtos: Meus Tokens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <div 
            key={token.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Token #{token.id.slice(0, 8)}</h3>
                <p className="text-gray-600">Evento: {token.event_id}</p>
                <p className="text-gray-600">Produto: {token.product_id}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  token.is_used 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {token.is_used ? 'Usado' : 'Disponível'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  {token.is_used && (
                    <>
                      <p className="text-gray-600">
                        <span className="font-semibold">Usado em:</span>{' '}
                        {new Date(token.used_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Usado para:</span>{' '}
                        {token.used_for_id}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">ID do Produto:</span>{' '}
                    {token.user_product_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 