"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/');
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' })
      .then((r) => r.json())
      .then((me) => (me?.isAdmin ? setAuthorized(true) : router.replace('/')))
      .catch(() => router.replace('/'));
  }, [router]);

  if (authorized === null) return <div>Checking admin…</div>;
  return <>{children}</>;
}
