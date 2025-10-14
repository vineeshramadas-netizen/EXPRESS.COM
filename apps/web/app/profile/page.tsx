"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function ProfilePage() {
  const [me, setMe] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setMe(data);
        return fetch(`${API_BASE}/api/users/${data.id}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
      })
      .then((r) => (r ? r.json() : []))
      .then((list) => setBookings(list || []))
      .catch(() => undefined);
  }, []);

  if (!me) return <div>Please login first.</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Hello, {me.name}</h1>
      <h2 className="text-xl font-semibold">Your bookings</h2>
      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id} className="border rounded p-3">
            <div>{b.hotelId}</div>
            <div>
              {new Date(b.startDate).toDateString()} → {new Date(b.endDate).toDateString()} — {b.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
