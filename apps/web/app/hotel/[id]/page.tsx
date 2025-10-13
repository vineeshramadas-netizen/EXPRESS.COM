type Props = { params: { id: string } };

export default async function HotelPage({ params }: Props) {
  // TODO: fetch from API once wired
  const hotel = { id: params.id, name: `Sample Hotel ${params.id}`, city: 'Sample City', description: 'Nice place to stay.' };
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-64 bg-gray-200 rounded" />
          <h1 className="text-3xl font-semibold mt-4">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.city}</p>
          <p className="mt-4">{hotel.description}</p>
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
