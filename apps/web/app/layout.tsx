import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Express.com – Hotels',
  description: 'Book hotels with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
