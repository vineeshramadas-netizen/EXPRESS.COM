"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return setError('No token');
    fetch(`${API_BASE}/api/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setBookings)
      .catch(() => setError('Unable to load admin data'));
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id} className="border rounded p-3">
            <div>Booking {b.id}</div>
            <div>Status: {b.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
