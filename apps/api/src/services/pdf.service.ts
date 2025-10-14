import PDFDocument from 'pdfkit';

export function generateBookingPDF(booking: any) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: any[] = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  doc.fontSize(18).text('Booking Confirmation', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Booking ID: ${booking.id}`);
  doc.text(`Status: ${booking.status}`);
  doc.text(`Check-in: ${booking.checkIn}`);
  doc.text(`Check-out: ${booking.checkOut}`);
  doc.text(`Nights: ${booking.nights}`);
  doc.text(`Guests: ${booking.quantity}`);
  doc.text(`Total: $${(booking.totalCents / 100).toFixed(2)}`);
  doc.end();

  return done;
}
