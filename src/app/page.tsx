'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Announcement, PromoBanner } from '@/types';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function Home() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [sliderRef] = useKeenSlider({
    loop: true,
    duration: 1000,
    slides: { perView: 1, spacing: 10 },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 1.2, spacing: 15 },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [bannersRes, annRes, productsRes] = await Promise.all([
        supabase.from('promo_banners').select('*').eq('is_active', true).order('order_index'),
        supabase.from('announcements').select('*').eq('is_active', true),
        supabase.from('products').select('*').limit(8),
      ]);

      setBanners(bannersRes.data || []);
      setAnnouncements(annRes.data || []);
      setProducts(productsRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {announcements.length > 0 && (
        <div className="bg-red-900/30 border-b border-red-800 py-2 text-center">
          <marquee className="text-sm">{announcements[0].content}</marquee>
        </div>
      )}

      {banners.length > 0 && (
        <div className="px-4 py-6">
          <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
            {banners.map((banner) => (
              <div key={banner.id} className="keen-slider__slide">
                <img
                  src={banner.image_url}
                  alt="Promo"
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold text-red-500 mb-6">Produk Terbaru</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="block">
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-red-500 font-bold mt-1">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Stok: {product.stock}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
