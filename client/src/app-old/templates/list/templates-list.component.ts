import { Component, OnInit, ViewChild } from '@angular/core';
import { Template } from '../../_models';
import { TemplateService } from '../../_services';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss'],
})
export class TemplatesListComponent implements OnInit {

  displayedColumns = ['name', 'action'];
  templatesData: MatTableDataSource<Template>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private templateService: TemplateService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.templateService.getAll().subscribe((templates) => {
      this.templatesData = new MatTableDataSource(templates);
      this.templatesData.paginator = this.paginator;
      this.templatesData.sort = this.sort;
    });
  }

  applyFilter(filterValue: string): void {
    this.templatesData.filter = filterValue.trim().toLowerCase();
  }

  view(template: Template): void {
    this.router.navigate(['/templates', template.id]);
  }

  edit(template: Template): void {
    this.router.navigate(['/templates', template.id, 'edit']);
  }

}
