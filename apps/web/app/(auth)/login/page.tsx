"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('accessToken', data.data.accessToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border rounded p-2" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="border rounded p-2" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="bg-black text-white rounded py-2">{loading ? '...' : 'Login'}</button>
      </form>
    </main>
  );
}
