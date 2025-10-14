"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find your stay</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border p-2 rounded" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input className="border p-2 rounded" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input className="border p-2 rounded" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <input className="border p-2 rounded" type="number" min={1} value={guests} onChange={(e) => setGuests(parseInt(e.target.value, 10))} />
      </div>
      <Link
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        href={{ pathname: '/search', query: { city, startDate, endDate, guests } }}
      >
        Search
      </Link>
    </div>
  );
}
