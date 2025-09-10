// lib/types.ts
export type Product = {
  id: number;
  tenant_id: number;
  title: string;
  price: number; // o string si en tu API sale string
  stock: number;
  active: boolean;
};

export type OrderItemIn = { product_id: number; qty: number };
export type CustomerIn = { email: string; name: string };

export type OrderCreateIn = {
  customer: CustomerIn;
  items: OrderItemIn[];
};

export type OrderOut = {
  id: number;
  status: 'created' | 'pending' | 'paid' | 'failed' | string;
  total: number;
  customer_id: number;
  tenant_id: number;
  items?: Array<{
    id: number;
    product_id: number;
    title: string;
    qty: number;
    unit_price: number;
    line_total: number;
  }>;
};

export type PaymentIntent = {
  order_id: number;
  reference: string;
  amountInCents: number;
  currency: string;
  checkout_url: string;
  status: string;
};
