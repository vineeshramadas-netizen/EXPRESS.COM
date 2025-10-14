"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HotelCard } from '@/components/HotelCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

type Hotel = {
  id: string;
  name: string;
  city: string;
  rating: number | null;
  description: string | null;
};

export default function SearchPage({ searchParams }: any) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL('/api/hotels', API_BASE);
    if (searchParams?.city) url.searchParams.set('city', searchParams.city);
    if (searchParams?.priceMin) url.searchParams.set('priceMin', searchParams.priceMin);
    if (searchParams?.priceMax) url.searchParams.set('priceMax', searchParams.priceMax);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => setHotels(data.items || data))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotels.map((h) => (
          <HotelCard key={h.id} id={h.id} name={h.name} city={h.city} rating={h.rating} description={h.description || undefined} />
        ))}
      </div>
    </div>
  );
}
