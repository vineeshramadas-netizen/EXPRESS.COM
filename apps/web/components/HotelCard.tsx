import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  city: string;
  rating?: number | null;
  description?: string | null;
};

export function HotelCard({ id, name, city, rating, description }: Props) {
  return (
    <Link href={`/hotels/${id}`} className="border rounded-lg p-4 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        {rating != null && <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">★ {rating}</span>}
      </div>
      <div className="text-sm text-gray-600">{city}</div>
      {description && <p className="text-sm mt-2 line-clamp-2 text-gray-700">{description}</p>}
    </Link>
  );
}
