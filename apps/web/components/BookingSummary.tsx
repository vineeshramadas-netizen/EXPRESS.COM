type Props = { nights: number; pricePerNight: number; taxesRate?: number };

export function BookingSummary({ nights, pricePerNight, taxesRate = 0.1 }: Props) {
  const subtotal = nights * pricePerNight;
  const taxes = subtotal * taxesRate;
  const total = subtotal + taxes;
  return (
    <div className="border rounded p-4 space-y-2">
      <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
      <div className="flex justify-between"><span>Taxes & fees</span><span>${taxes.toFixed(2)}</span></div>
      <div className="h-px bg-gray-200" />
      <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
    </div>
  );
}
