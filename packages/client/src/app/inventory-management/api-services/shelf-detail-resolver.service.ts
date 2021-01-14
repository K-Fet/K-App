import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Shelf } from '../shelves/shelf.model';
import { ShelvesService } from './shelves.service';

@Injectable()
export class ShelfDetailResolverService implements Resolve<Shelf> {

  constructor(private shelvesService: ShelvesService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Shelf> {
    const id = route.paramMap.get('id');

    const shelf = await this.shelvesService.get(id);
    if (shelf) return shelf;

    this.router.navigate(['/inventory-management/shelves']);
  }
}
