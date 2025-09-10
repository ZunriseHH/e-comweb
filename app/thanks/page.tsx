'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type IntentStatus = {
  order_id: number;
  reference: string;
  status: string;
  amountInCents: number;
  currency: string;
};

export default function ThanksPage() {
  const [status, setStatus] = useState<string>('checking...');
  const [ref, setRef] = useState<string>('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const oid = url.searchParams.get('order_id');   // ajusta a los params que mandes en redirect
    const reference = url.searchParams.get('reference') || '';
    setRef(reference);

    if (!oid) {
      setStatus('Falta order_id en la URL');
      return;
    }

    // Polling corto del intent
    let tries = 0;
    const timer = setInterval(async () => {
      tries++;
      try {
        const it = await apiFetch<IntentStatus>(`/payments/intents/${oid}`);
        if (it.status === 'APPROVED' || it.status === 'paid') {
          setStatus('Pago aprobado ✅');
          clearInterval(timer);
        } else if (['DECLINED', 'ERROR', 'VOIDED', 'failed'].includes(it.status)) {
          setStatus(`Pago ${it.status}`);
          clearInterval(timer);
        } else {
          setStatus(`Estado: ${it.status} (intentando...)`);
        }
      } catch (e: any) {
        setStatus('Error consultando intent');
      }
      if (tries > 10) clearInterval(timer);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Gracias por tu compra</h1>
      <div>Referencia: {ref || '(desconocida)'}</div>
      <div className="mt-2">{status}</div>
      <a className="inline-block mt-4 border rounded px-3 py-1" href="/">Volver a la tienda</a>
    </main>
  );
}
