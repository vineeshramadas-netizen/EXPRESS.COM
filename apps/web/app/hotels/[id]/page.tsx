"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function HotelDetail({ params, searchParams }: any) {
  const { id } = params;
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(searchParams?.startDate || '');
  const [endDate, setEndDate] = useState(searchParams?.endDate || '');
  const [guests, setGuests] = useState(parseInt(searchParams?.guests || '1', 10));

  useEffect(() => {
    fetch(`${API_BASE}/api/hotels/${id}`).then((r) => r.json()).then(setHotel);
  }, [id]);

  if (!hotel) return <div>Loading…</div>;

  async function holdAndCheckout() {
    const res = await fetch(`${API_BASE}/api/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, startDate, endDate, guests }),
    });
    const data = await res.json();
    router.push(`/checkout?holdId=${data.holdId}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{hotel.name}</h1>
      <p className="text-gray-700">{hotel.description}</p>

      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="border p-2 rounded" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input className="border p-2 rounded" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <input className="border p-2 rounded" type="number" min={1} value={guests} onChange={(e) => setGuests(parseInt(e.target.value, 10))} />
          <select className="border p-2 rounded" onChange={(e) => setRoomId(e.target.value)} defaultValue="">
            <option value="" disabled>
              Select room
            </option>
            {hotel.rooms?.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.title} – ${r.pricePerNight}/night
              </option>
            ))}
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={holdAndCheckout} disabled={!roomId || !startDate || !endDate}>
          Hold & Checkout
        </button>
      </div>
    </div>
  );
}
