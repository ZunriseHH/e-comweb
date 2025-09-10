// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const TENANT = process.env.NEXT_PUBLIC_TENANT!;

type Options = Omit<RequestInit, 'headers'> & { headers?: HeadersInit };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant': TENANT,
      ...(options.headers || {}),
    },
    // Puedes agregar: cache: 'no-store' en server actions/páginas si quieres evitar cache
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  // algunos endpoints pueden no devolver JSON (204)
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? (await res.json()) as T : ({} as T);
}
