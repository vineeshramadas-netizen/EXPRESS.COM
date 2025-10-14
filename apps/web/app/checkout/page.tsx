"use client";
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

function CheckoutForm({ holdId }: { holdId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${API_BASE}/api/bookings/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      credentials: 'include',
      body: JSON.stringify({ holdId }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to create PI: ${r.status}`);
        return r.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((e) => setError(e.message));
  }, [holdId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    await stripe.confirmPayment({ elements, confirmParams: { return_url: window.location.origin + '/confirmation' } });
  }

  if (error) return <div className="text-red-600">{error}</div>;
  if (!clientSecret) return <div>Loading payment form…</div>;
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <PaymentElement />
      <button disabled={!clientSecret} className="bg-green-600 text-white px-4 py-2 rounded">
        Pay
      </button>
    </form>
  );
}

export default function CheckoutPage({ searchParams }: any) {
  const holdId = searchParams?.holdId;
  if (!holdId) return <div>Missing holdId</div>;
  // Elements must be initialized with the client secret; we mount after child fetches it
  const [secret, setSecret] = useState<string | null>(null);
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: secret || undefined }}>
      <CheckoutForm holdId={holdId} />
    </Elements>
  );
}
