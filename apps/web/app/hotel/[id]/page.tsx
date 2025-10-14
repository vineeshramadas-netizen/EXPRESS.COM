type Props = { params: { id: string } };
import { BookButton } from './book-button';

export default async function HotelPage({ params }: Props) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/api/hotels/${params.id}`, { next: { revalidate: 30 } });
  const json = await res.json();
  const hotel = json.data;
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-64 bg-gray-200 rounded" />
          <h1 className="text-3xl font-semibold mt-4">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.city}</p>
          <p className="mt-4">{hotel.description}</p>
          {hotel.rooms?.[0] && (
            <div className="mt-4"><BookButton roomId={hotel.rooms[0].id} /></div>
          )}
        </div>
        <aside className="border rounded p-4 h-fit">
          <div className="font-medium mb-2">Select dates</div>
          <form className="grid gap-2">
            <input type="date" className="border rounded p-2" />
            <input type="date" className="border rounded p-2" />
            <input type="number" min={1} defaultValue={1} className="border rounded p-2" />
            <button className="bg-black text-white rounded py-2">Check availability</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
