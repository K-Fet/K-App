import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicesTemplatesService } from '../../../core/api-services/services-templates.service';
import { ServicesTemplate } from '../../../shared/models';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  templatesData: MatTableDataSource<ServicesTemplate>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private templateService: ServicesTemplatesService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const { rows: templates } = await this.templateService.list({ pageSize: 100 });
    this.templatesData = new MatTableDataSource(templates);
    this.templatesData.paginator = this.paginator;
    this.templatesData.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.templatesData.filter = filterValue.trim().toLowerCase();
  }

  view(template: ServicesTemplate): void {
    this.router.navigate(['/services/templates', template._id]);
  }

  edit(template: ServicesTemplate): void {
    this.router.navigate(['/services/templates', template._id, 'edit']);
  }

}
