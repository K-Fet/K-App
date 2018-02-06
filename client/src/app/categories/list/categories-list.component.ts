import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from '../../_models/index';
import { CategoryService } from '../../_services/category.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

    displayedColumns = ['name'];
    categoriesData: MatTableDataSource<Category>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private categoryService: CategoryService, private toasterService: ToasterService, private router: Router) {
    }

    ngOnInit() {
        this.update();
    }

    update() {
        this.categoryService.getAll().subscribe(categories => {
            this.categoriesData = new MatTableDataSource(categories);
            this.categoriesData.paginator = this.paginator;
            this.categoriesData.sort = this.sort;
        });
    }

    edit(category: Category) {
        this.router.navigate(['/members', category.id]);
    }

    delete(category: Category) {
        this.categoryService.delete(category.id)
        .subscribe(() => {
            this.toasterService.showToaster('Catégorie de service supprimée', 'Fermer');
            this.update();
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.categoriesData.filter = filterValue;
    }

}

