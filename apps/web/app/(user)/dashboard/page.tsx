"use client";
import { useEffect, useState } from 'react';

type Booking = { id: string; status: string; totalCents: number; createdAt: string };

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/(auth)/login';
      return;
    }
    const userId = 'me'; // TODO: replace with decoded user id or fetch profile
    fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/users/${userId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        setBookings(data.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your bookings</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <ul className="divide-y border rounded">
        {bookings.map((b) => (
          <li key={b.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Booking {b.id.slice(0, 6)}</div>
              <div className="text-sm text-gray-600">{b.status} • ${(b.totalCents / 100).toFixed(2)}</div>
            </div>
            <button className="text-sm">View</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
