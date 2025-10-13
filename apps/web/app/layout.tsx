export const metadata = {
  title: 'Express.com',
  description: 'Hotel booking made simple',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
