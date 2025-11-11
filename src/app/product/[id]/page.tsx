'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, PaymentMethod } from '@/types';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{  prodData }, {  payData }] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('payment_methods').select('*').eq('is_active', true),
      ]);

      if (!prodData) {
        router.push('/');
        return;
      }

      setProduct(prodData);
      setPaymentMethods(payData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Loading...</div>;
  }

  if (!product) return null;

  const handleBuy = () => {
    if (product.stock <= 0) {
      alert('Stok habis!');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-red-500 hover:underline"
        >
          ← Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-red-500 text-2xl font-bold mt-4">Rp {product.price.toLocaleString()}</p>
            <p className="mt-4 text-gray-300">{product.description}</p>
            <p className="mt-4">
              <span className="font-semibold">Stok:</span>{' '}
              <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                {product.stock > 0 ? product.stock : 'Habis'}
              </span>
            </p>

            <button
              onClick={handleBuy}
              disabled={product.stock <= 0}
              className={`mt-6 px-6 py-3 rounded font-bold w-full ${
                product.stock > 0
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
            </button>
          </div>
        </div>

        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-500">Metode Pembayaran</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="mb-6">
                Silakan transfer ke salah satu metode di bawah. Kirim bukti ke WhatsApp kami setelah bayar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.method}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-900"
                  >
                    <h3 className="font-bold text-lg capitalize mb-3 text-center">
                      {method.method}
                    </h3>
                    <div className="text-center space-y-2">
                      <p>{method.account_name}</p>
                      <p className="font-mono">{method.account_number}</p>
                      {method.method === 'qris' && (
                        <img
                          src={method.account_number}
                          alt="QRIS"
                          className="w-32 h-32 mx-auto mt-3 object-contain"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-gray-400">
                ⚠️ Pastikan jumlah transfer **tepat** dan sesuai nama akun.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
