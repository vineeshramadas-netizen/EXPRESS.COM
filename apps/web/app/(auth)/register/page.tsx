"use client";
import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('UserPass123!');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) return setError('Registration failed');
    router.push('/login');
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="border p-2 w-full rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
