"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function AdminHotelsPage() {
  const [name, setName] = useState('New Hotel');
  const [city, setCity] = useState('New York');
  const [address, setAddress] = useState('1 Main St');
  const [country, setCountry] = useState('USA');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) setMessage('Please login as admin.');
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/api/admin/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ name, description: '', address, city, country, images: '[]' }),
    });
    setMessage(res.ok ? 'Hotel created' : 'Failed to create hotel');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin: Create Hotel</h1>
      <form onSubmit={submit} className="grid gap-2 max-w-md">
        <input className="border p-2 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}
