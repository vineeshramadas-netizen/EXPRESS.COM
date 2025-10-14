import Link from 'next/link';

type Hotel = { id: string; name: string; city: string; images: string[]; rating: number };

export default async function SearchPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/api/hotels`, { next: { revalidate: 30 } });
  const json = await res.json();
  const hotels: Hotel[] = json.data || [];
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Find your stay</h1>
      <form action="/" className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input name="city" placeholder="City" className="border rounded p-2" />
        <input name="checkIn" type="date" className="border rounded p-2" />
        <input name="checkOut" type="date" className="border rounded p-2" />
        <input name="guests" type="number" min={1} placeholder="Guests" className="border rounded p-2" />
        <button className="bg-black text-white rounded px-4">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotels.map((h) => (
          <Link key={h.id} className="border rounded p-3 hover:shadow" href={`/hotel/${h.id}`}>
            <div className="h-40 bg-gray-200 mb-2" />
            <div className="font-medium">{h.name}</div>
            <div className="text-sm text-gray-600">{h.city} · ⭐ {h.rating?.toFixed?.(1) ?? '0.0'}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
