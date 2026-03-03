export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id?: string;
  clientId: string;
  employeeId: string;
  fecha: string;
  items: SaleItem[];
  total: number;
}

export interface SaleView {
  id?: string;
  clientName: string;
  employeeName: string;
  fecha: string;
  productNames: string[];
  total: number;
}
