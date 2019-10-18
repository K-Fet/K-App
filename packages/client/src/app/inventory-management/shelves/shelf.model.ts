import { Product } from '../products/product.model';

export interface Shelf {
  _id?: string;
  name: string;
  products?: Product[];
}
