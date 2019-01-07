import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Product } from '../product.model';

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
}
