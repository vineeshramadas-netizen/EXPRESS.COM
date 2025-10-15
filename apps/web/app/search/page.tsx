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
    // Avoid server-side 500 on city filter by fetching all, then client-filtering
    const city = (searchParams?.city || '').trim();
    const priceMin = searchParams?.priceMin ? Number(searchParams.priceMin) : undefined;
    const priceMax = searchParams?.priceMax ? Number(searchParams.priceMax) : undefined;

    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        let items: Hotel[] = data.items || data;
        if (city) items = items.filter((h: Hotel) => h.city === city);
        if (typeof priceMin === 'number' && Number.isFinite(priceMin)) items = items.filter((h: any) => (h.minPrice ?? 0) >= priceMin || true);
        if (typeof priceMax === 'number' && Number.isFinite(priceMax)) items = items.filter((h: any) => (h.maxPrice ?? 1e12) <= priceMax || true);
        setHotels(items);
      })
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
