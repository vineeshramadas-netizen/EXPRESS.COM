"use client";
import { useState } from 'react';

export function BookButton({ roomId }: { roomId: string }) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const res = await fetch(`${base}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roomId, checkIn: new Date().toISOString(), checkOut: new Date(Date.now()+86400000).toISOString(), quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking');
      const sessionRes = await fetch(`${base}/api/payments/checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bookingId: data.data.booking.id })
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error || 'Failed to create checkout session');
      window.location.href = sessionData.data.url;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };
  return <button onClick={onClick} className="bg-black text-white rounded px-4 py-2" disabled={loading}>{loading ? 'Processing...' : 'Book now'}</button>;
}
