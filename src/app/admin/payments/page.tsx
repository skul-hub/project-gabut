'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PaymentMethod } from '@/types';

export default function AdminPayments() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id'>>({
    method: 'qris',
    account_name: '',
    account_number: '',
    is_active: true,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('method');
    if (!error) {
      setMethods(data || []);
      if (data && data.length > 0) {
        setFormData({
          method: data[0].method,
          account_name: data[0].account_name,
          account_number: data[0].account_number,
          is_active: data[0].is_active,
        });
        setEditingId(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleSelect = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData({
      method: method.method,
      account_name: method.account_name,
      account_number: method.account_number,
      is_active: method.is_active,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;

    setLoading(true);
    const { error } = await supabase
      .from('payment_methods')
      .update({
        account_name: formData.account_name,
        account_number: formData.account_number,
        is_active: formData.is_active,
      })
      .eq('id', editingId);

    if (!error) {
      fetchPayments();
    }
    setLoading(false);
  };

  if (loading && methods.length === 0) {
    return <div className="p-8 text-center text-red-500">Loading metode pembayaran...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">Metode Pembayaran</h1>
      <p className="mb-6 text-gray-400">Atur nama & nomor untuk QRIS, GoPay, OVO, dan DANA.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Pilih Metode</h2>
          {(['qris', 'gopay', 'ovo', 'dana'] as const).map((method) => {
            const item = methods.find((m) => m.method === method);
            return (
              <div
                key={method}
                onClick={() => item && handleSelect(item)}
                className={`p-3 mb-2 rounded cursor-pointer ${
                  editingId === item?.id ? 'bg-red-900' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {method.toUpperCase()}
                {item && !item.is_active && (
                  <span className="text-xs text-yellow-500 ml-2">(nonaktif)</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {editingId ? (
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold capitalize">{formData.method}</h2>

              <div>
                <label className="block mb-2">Nama Akun</label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">
                  {formData.method === 'qris' ? 'URL Gambar QRIS' : 'Nomor Akun'}
                </label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700"
                  required
                />
                {formData.method === 'qris' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Upload QRIS ke Supabase Storage, lalu paste URL publiknya di sini.
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="active">Aktifkan metode ini</label>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
              Pilih metode pembayaran di kiri untuk mengedit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
