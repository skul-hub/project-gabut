export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  created_at: string;
};

export type PaymentMethod = {
  id: number;
  method: 'qris' | 'gopay' | 'ovo' | 'dana';
  account_name: string;
  account_number: string;
  is_active: boolean;
};

export type Announcement = {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
};

export type PromoBanner = {
  id: number;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  order_index: number;
};
