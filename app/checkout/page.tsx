'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';
import { apiFetch } from '@/lib/api';
import { OrderCreateIn, OrderOut, PaymentIntent } from '@/lib/types';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);

  const makeOrderAndPay = async () => {
    setLoading(true);
    setError(null);
    try {
      if (items.length === 0) {
        setError('Carrito vacío');
        setLoading(false);
        return;
      }

      // 1) Crear orden
      const orderPayload: OrderCreateIn = {
        customer: { email: 'cliente@demo.com', name: 'Cliente Demo' }, // luego lo pides en un form
        items: items.map(it => ({ product_id: it.product_id, qty: it.qty })),
      };
      const order = await apiFetch<OrderOut>('/orders/', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      // 2) Crear intent de pago
      const intent = await apiFetch<PaymentIntent>(`/payments/intents/${order.id}`, {
        method: 'POST',
      });

      // 3) Redirigir a Wompi (checkout_url)
      if (intent.checkout_url) {
        clear(); // opcional
        window.location.href = intent.checkout_url;
      } else {
        setError('No se obtuvo checkout_url');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { /* podrías precargar algo */ }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Total: ${total()}</p>
      <button
        onClick={makeOrderAndPay}
        disabled={loading || items.length === 0}
        className="mt-3 border rounded px-3 py-1"
      >
        {loading ? 'Procesando…' : 'Pagar con Wompi'}
      </button>
      {error && <div className="text-red-600 mt-3">{error}</div>}
    </main>
  );
}
