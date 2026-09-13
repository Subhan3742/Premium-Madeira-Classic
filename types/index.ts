export interface Product {
  id: string;
  serialNumber: string;
  productName: string;
  model: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  price: number | string;
  status: string;
  manufacturingDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  blocked: number;
  recentProducts: Product[];
}
