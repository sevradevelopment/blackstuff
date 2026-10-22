export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
}

export interface CmsPage {
  title: string;
  body: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  usage: string;
  extraInfo: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  gallery: string[];
  categoryId: CategoryId;
  stock: number;
  published: boolean;
  featured?: boolean;
  netWeight?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  published: boolean;
  /** Tervisealane sisu – vajab enne avaldamist ülevaatust */
  needsReview?: boolean;
  sourceUrl?: string;
}

export type OrderStatus =
  | "uus"
  | "makstud"
  | "töötlemisel"
  | "saadetud"
  | "tühistatud";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  isDemo: boolean;
  montonioUuid?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "cancelled";
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  brandIntroTitle: string;
  brandIntroBody: string;
  scienceBlurb: string;
  ctaTitle: string;
  aboutBody: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  registryCode: string;
  freeShippingFrom: number;
}

export interface Database {
  products: Product[];
  categories: Category[];
  orders: Order[];
  blogPosts: BlogPost[];
  siteContent: SiteContent;
  pages: Record<string, CmsPage>;
  admin: {
    username: string;
    passwordHash: string;
  };
  contactMessages: Array<{
    id: string;
    createdAt: string;
    name: string;
    email: string;
    message: string;
  }>;
}
