'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { PromoBanner } from '@/types';

export default function AdminPromos() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('promo_banners')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error) setBanners(data || []);
    setLoading(false);
  };

  const handleImageUpload = async (file: File) => {
    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('promo-banners').upload(filename, file);
    if (error) throw error;
    const { data } = supabase.storage.from('promo-banners').getPublicUrl(filename);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(imageFile);
      const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order_index)) : 0;

      const { error } = await supabase.from('promo_banners').insert({
        image_url: imageUrl,
        link_url: linkUrl || null,
        is_active: true,
        order_index: maxOrder + 1,
      });

      if (!error) {
        setImageFile(null);
        setLinkUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus banner ini?')) {
      await supabase.from('promo_banners').delete().eq('id', id);
      fetchBanners();
    }
  };

  const moveOrder = async (id: number, direction: 'up' | 'down') => {
    const target = banners.find(b => b.id === id);
    if (!target) return;

    const other = direction === 'up'
      ? banners.find(b => b.order_index === target.order_index - 1)
      : banners.find(b => b.order_index === target.order_index + 1);

    if (!other) return;

    await supabase.from('promo_banners').update({ order_index: other.order_index }).eq('id', id);
    await supabase.from('promo_banners').update({ order_index: target.order_index }).eq('id', other.id);
    fetchBanners();
  };

  if (loading && banners.length === 0) {
    return <div className="p-8 text-center text-red-500">Loading promo...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">Promo Banner</h1>
      <p className="mb-6 text-gray-400">Banner akan tampil di halaman utama dan bisa di-geser oleh pengguna.</p>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
        <h2 className="text-xl mb-4">Upload Banner Baru</h2>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          accept="image/*"
          className="text-white mb-2"
          required
        />
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Link Tujuan (opsional)"
          className="w-full p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          disabled={loading}
        >
          {loading ? 'Mengupload...' : 'Upload Banner'}
        </button>
      </form>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-gray-800 p-4 rounded border border-gray-700 flex items-center">
            <img src={banner.image_url} alt="Promo" className="w-24 h-24 object-cover rounded mr-4" />
            <div className="flex-1">
              <p className="text-sm">
                Urutan: {banner.order_index} • {banner.is_active ? 'Aktif' : 'Nonaktif'}
              </p>
              {banner.link_url && <p className="text-xs text-blue-400">{banner.link_url}</p>}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => moveOrder(banner.id, 'up')}
                disabled={banner.order_index === 1}
                className="text-xs px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => moveOrder(banner.id, 'down')}
                disabled={banner.order_index === banners.length}
                className="text-xs px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                ↓
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="text-xs px-2 py-1 bg-red-800 text-red-100 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
