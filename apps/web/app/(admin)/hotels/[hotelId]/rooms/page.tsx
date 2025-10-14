"use client";
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useParams } from 'next/navigation';

type Room = { id: string; title: string; pricePerNight: string; maxGuests: number; totalInventory: number };

export default function AdminRoomsPage() {
  const params = useParams();
  const hotelId = params?.hotelId as string;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [title, setTitle] = useState('Standard');
  const [price, setPrice] = useState('99.99');
  const [maxGuests, setMaxGuests] = useState(2);
  const [inventory, setInventory] = useState(5);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  async function load() {
    const res = await fetch(`${API_BASE}/api/hotels/${hotelId}`);
    const hotel = await res.json();
    setRooms(hotel.rooms || []);
  }

  useEffect(() => {
    if (hotelId) load();
  }, [hotelId]);

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/admin/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ hotelId, title, roomType: 'DOUBLE', pricePerNight: parseFloat(price), maxGuests, totalInventory: inventory, images: [] }),
    });
    await load();
  }

  async function remove(id: string) {
    await fetch(`${API_BASE}/api/admin/rooms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rooms</h1>
      <form onSubmit={createRoom} className="grid gap-2 max-w-md">
        <input className="border p-2 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Price per night" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Max guests" type="number" value={maxGuests} onChange={(e) => setMaxGuests(parseInt(e.target.value, 10))} />
        <input className="border p-2 rounded" placeholder="Inventory" type="number" value={inventory} onChange={(e) => setInventory(parseInt(e.target.value, 10))} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create room</button>
      </form>

      <ul className="space-y-2">
        {rooms.map((r) => (
          <li key={r.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-600">${r.pricePerNight} / night, {r.maxGuests} guests, {r.totalInventory} inventory</div>
            </div>
            <button onClick={() => remove(r.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
