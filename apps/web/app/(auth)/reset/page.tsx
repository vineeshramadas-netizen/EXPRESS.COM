"use client";
import { useState } from 'react';

export default function ResetPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
    setMsg(res.ok ? 'Password reset' : 'Failed to reset');
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      <form className="grid gap-3" onSubmit={submit}>
        <input className="border rounded p-2" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
        <input className="border rounded p-2" type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white rounded py-2">Reset</button>
      </form>
      {msg && <div className="text-sm mt-3">{msg}</div>}
    </main>
  );
}
