'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500">Verifying admin...</div>;
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}
