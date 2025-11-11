'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from 'tsparticles-slim';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      router.push('/');
    } else {
      alert('Login gagal: ' + error.message);
    }
    setLoading(false);
  };

  const particlesOptions = {
    background: { color: { value: '#000000' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: ['#ff3b3b', '#ff6b6b', '#ff9e9e'] },
      links: { color: '#ff3b3b', distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: true, speed: 1.5, straight: false },
      number: { density: { enable: true }, value: 60 },
      opacity: { value: 0.6 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 4 } },
    },
    detectRetina: true,
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 pointer-events-none"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-black/50 z-0"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-black text-white">B</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            BANG<span className="text-red-500">SKULL</span>
          </h1>
          <p className="text-gray-400 text-sm">Masuk ke dunia streetwear-mu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in-up delay-150">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="w-full px-4 pt-6 pb-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all pointer-events-none">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="w-full px-4 pt-6 pb-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all pointer-events-none">
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg shadow-lg hover:shadow-red-900/40 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? 'Masuk...' : 'MASUK SEKARANG'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        <div className="text-center mt-8 text-gray-500 text-xs animate-fade-in-up delay-300">
          © {new Date().getFullYear()} BANGSKULL. All rights reserved.
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
