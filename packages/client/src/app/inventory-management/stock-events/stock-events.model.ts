import { Product } from '../products/product.model';


export interface StockEvent {
  _id?: string;
  product: string | Product;
  diff: number;
  date: Date;
  type: string;
  order?: string;
  meta?: string;
}
