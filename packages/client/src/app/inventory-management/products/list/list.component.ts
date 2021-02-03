import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { ProductsDataSource } from '../products.data-source';
import { ProductsService } from '../../api-services/products.service';
import { Product } from '../product.model';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit {
  // Modified because it didn't work on my laptop
  displayedColumns = ['name', 'action'];
  dataSource: ProductsDataSource;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(private productsService: ProductsService,
              private router: Router) {
  }

  async ngOnInit() {
    this.dataSource = new ProductsDataSource(this.productsService);
    await this.dataSource.loadProducts();
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadProductsPage();
      }),
    ).subscribe();

    // Paginator and Sort
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(tap(() => this.loadProductsPage())).subscribe();
  }

  async loadProductsPage()  {
    await this.dataSource.loadProducts({
      pageSize: this.paginator.pageSize,
      page: this.paginator.pageIndex + 1,
      search: this.input.nativeElement.value,
      sort: this.sort.active && `${this.sort.direction === 'desc' ? '-' : ''}${this.sort.active}`,
    });
  }

  edit(product: Product): void {
    this.router.navigate(['/inventory-management/products', product._id, 'edit']);
  }

  view(product: Product): void {
    this.router.navigate(['/inventory-management/products', product._id]);
  }
}
