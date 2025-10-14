import Link from 'next/link';

export function Header() {
  return (
    <header className="py-4 border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Express.com</Link>
        <nav className="space-x-4 text-sm">
          <Link href="/search">Search</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
