// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/store/cart';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { add, items, total } = useCart();

  useEffect(() => {
    apiFetch<Product[]>('/products/')
      .then(setProducts)
      .catch(err => console.error('products error', err));
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tienda</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4">
            <div className="font-semibold">{p.title}</div>
            <div>Precio: ${p.price}</div>
            <div>Stock: {p.stock}</div>
            <button
              className="mt-2 border rounded px-3 py-1"
              onClick={() => add({ product_id: p.id, title: p.title, price: Number(p.price), qty: 1 })}
              disabled={!p.active || p.stock <= 0}
            >
              Agregar
            </button>
          </div>
        ))}
      </div>

      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Carrito</h2>
      {items.length === 0 ? (
        <div>Vacío</div>
      ) : (
        <>
          <ul className="mb-2">
            {items.map(it => (
              <li key={it.product_id}>
                {it.title} x {it.qty} — ${it.price * it.qty}
              </li>
            ))}
          </ul>
          <div className="font-semibold">Total: ${total()}</div>
          <a href="/checkout" className="inline-block mt-3 border rounded px-3 py-1">Ir a pagar</a>
        </>
      )}
    </main>
  );
}
