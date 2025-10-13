import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">Express.com</h1>
        <p className="text-gray-600 mb-6">Find and book hotels worldwide.</p>
        <Link href="/" className="bg-black text-white px-4 py-2 rounded">Start searching</Link>
      </div>
    </main>
  );
}
