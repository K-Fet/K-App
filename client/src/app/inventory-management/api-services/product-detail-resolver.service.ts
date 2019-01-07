import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Product } from '../products/product.model';
import { ProductsService } from './products.service';

@Injectable()
export class ProductDetailResolverService implements Resolve<Product> {

  constructor(private productsService: ProductsService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Product> {
    const id = route.paramMap.get('id');

    const product = await this.productsService.get(id);
    if (product) return product;

    this.router.navigate(['/inventory-management/products']);
  }
}
