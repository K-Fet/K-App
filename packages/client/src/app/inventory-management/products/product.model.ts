import { Provider } from '../invoice-tool/providers/provider.model';
import { Shelf } from '../shelves/shelf.model';

export interface ProductConversion {
  displayName?: string;
  preferred?: boolean;
  unit: string;
  coef: number;
}

export interface Product {
  _id?: string;
  name: string;
  image?: string;
  used: boolean;
  conversions: ProductConversion[];
  provider: string | Provider;
  shelf?: string | Shelf;
}
