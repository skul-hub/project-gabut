'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const handleImageUpload = async (files: FileList) => {
    const urls: string[] = [];
    const bucket = supabase.storage.from('product-images');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = `${Date.now()}_${file.name}`;
      const { error } = await bucket.upload(filename, file);
      if (!error) {
        const { data } = bucket.getPublicUrl(filename);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls: string[] = [];
    if (images) {
      imageUrls = await handleImageUpload(images);
    }

    const { error } = await supabase.from('products').insert({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: imageUrls,
    });

    if (!error) {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchProducts();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (loading && products.length === 0) {
    return <div className="p-8 text-center text-red-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">Kelola Produk</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
        <h2 className="text-xl mb-4">Tambah Produk Baru</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Produk"
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Harga"
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stok"
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImages(e.target.files)}
          multiple
          accept="image/*"
          className="text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 p-4 rounded border border-gray-700">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-400 mt-1">Rp {product.price.toLocaleString()}</p>
            <p className="text-sm mt-1">Stok: {product.stock}</p>
            <button
              onClick={() => handleDelete(product.id)}
              className="mt-3 text-sm text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
