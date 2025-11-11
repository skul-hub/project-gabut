'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, PaymentMethod, Announcement, PromoBanner } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    payments: 0,
    announcements: 0,
    promos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: payments } = await supabase.from('payment_methods').select('*', { count: 'exact', head: true });
      const { count: announcements } = await supabase.from('announcements').select('*', { count: 'exact', head: true });
      const { count: promos } = await supabase.from('promo_banners').select('*', { count: 'exact', head: true });

      setStats({
        products: products || 0,
        payments: payments || 0,
        announcements: announcements || 0,
        promos: promos || 0,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/products" className="block">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
            <h2 className="text-xl font-semibold">Produk</h2>
            <p className="text-3xl mt-2 text-red-500">{stats.products}</p>
          </div>
        </Link>
        <Link href="/admin/payments" className="block">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
            <h2 className="text-xl font-semibold">Metode Bayar</h2>
            <p className="text-3xl mt-2 text-red-500">{stats.payments}</p>
          </div>
        </Link>
        <Link href="/admin/announcements" className="block">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
            <h2 className="text-xl font-semibold">Pengumuman</h2>
            <p className="text-3xl mt-2 text-red-500">{stats.announcements}</p>
          </div>
        </Link>
        <Link href="/admin/promos" className="block">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
            <h2 className="text-xl font-semibold">Promo Banner</h2>
            <p className="text-3xl mt-2 text-red-500">{stats.promos}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
