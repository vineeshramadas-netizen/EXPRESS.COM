import Link from 'next/link';

export default async function SearchPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Find your stay</h1>
      <form action="/search" className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input name="city" placeholder="City" className="border rounded p-2" />
        <input name="checkIn" type="date" className="border rounded p-2" />
        <input name="checkOut" type="date" className="border rounded p-2" />
        <input name="guests" type="number" min={1} placeholder="Guests" className="border rounded p-2" />
        <button className="bg-black text-white rounded px-4">Search</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <Link key={i} className="border rounded p-3 hover:shadow" href={`/hotel/${i}`}>
            <div className="h-40 bg-gray-200 mb-2" />
            <div className="font-medium">Sample Hotel {i}</div>
            <div className="text-sm text-gray-600">City · $$ · 4.{i}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
