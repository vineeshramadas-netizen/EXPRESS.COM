"use client";
import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('UserPass123!');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return setError('Login failed');
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    router.push('/profile');
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
