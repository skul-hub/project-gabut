'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Announcement } from '@/types';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setAnnouncements(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('announcements').insert({
      title,
      content,
      is_active: true,
    });
    if (!error) {
      setTitle('');
      setContent('');
      fetchAnnouncements();
    }
    setLoading(false);
  };

  const toggleActive = async (id: number, current: boolean) => {
    const { error } = await supabase
      .from('announcements')
      .update({ is_active: !current })
      .eq('id', id);
    if (!error) fetchAnnouncements();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus pengumuman ini?')) {
      await supabase.from('announcements').delete().eq('id', id);
      fetchAnnouncements();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">Pengumuman</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
        <h2 className="text-xl mb-4">Buat Pengumuman Baru</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Pengumuman"
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Isi Pengumuman"
          rows={4}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Buat Pengumuman'}
        </button>
      </form>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-gray-800 p-4 rounded border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{ann.title}</h3>
                <p className="text-sm mt-1 text-gray-300">{ann.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Dibuat: {new Date(ann.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleActive(ann.id, ann.is_active)}
                  className={`text-xs px-2 py-1 rounded ${
                    ann.is_active
                      ? 'bg-green-700 text-green-100'
                      : 'bg-gray-600 text-gray-200'
                  }`}
                >
                  {ann.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="text-xs px-2 py-1 bg-red-800 text-red-100 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
