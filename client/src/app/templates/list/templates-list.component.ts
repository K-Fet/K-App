import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member, Template } from '../../_models/index';
import { TemplateService } from '../../_services/index';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ToasterService } from '../../_services/toaster.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})
export class TemplatesListComponent implements OnInit {

    displayedColumns = ['name', 'action'];
    templatesData: MatTableDataSource<Template>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private templateService: TemplateService,
        private toasterService: ToasterService,
        private router: Router) {
    }

    ngOnInit() {
        this.templateService.getAll().subscribe(templates => {
            this.templatesData = new MatTableDataSource(templates);
            this.templatesData.paginator = this.paginator;
            this.templatesData.sort = this.sort;
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.templatesData.filter = filterValue;
    }

    view(template: Template) {
        this.router.navigate(['/templates', template.id]);
    }

}
