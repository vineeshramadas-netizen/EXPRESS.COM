"use client";
import { useState } from 'react';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (res.ok) setMsg('If that email exists, a reset link was sent.');
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
      <form className="grid gap-3" onSubmit={submit}>
        <input className="border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="bg-black text-white rounded py-2">Send reset link</button>
      </form>
      {msg && <div className="text-sm mt-3">{msg}</div>}
    </main>
  );
}
