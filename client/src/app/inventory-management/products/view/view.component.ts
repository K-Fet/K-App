import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../product.model';
import { Provider } from '../../providers/provider.model';
import { Shelf } from '../../shelves/shelf.model';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  product: Product;

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe((data: { product: Product }) => {
      this.product = data.product;
    });
  }

  getProvider(product: Product): Provider {
    return product && product.provider as Provider;
  }

  getShelf(product: Product): Shelf {
    return product && product.shelf as Shelf;
  }
}
