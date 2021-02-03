import { Product } from '../products/product.model';


export type StockEventType =
  | 'Transaction'
  | 'InventoryAdjustment'
  | 'InventoryUpdate'
  | 'Delivery';

export interface StockEvent {
  _id?: string;
  product: string | Product;
  diff: number;
  date: Date;
  type: StockEventType;
  order?: string;
  meta?: string;
}
