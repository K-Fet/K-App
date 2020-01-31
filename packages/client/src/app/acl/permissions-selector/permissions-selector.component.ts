import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Permission } from '../../shared/models';

@Component({
  selector: 'app-permissions-selector',
  templateUrl: './permissions-selector.component.html',
})
export class PermissionsSelectorComponent implements OnInit, OnChanges {

  @Input() permissions: Permission[];
  @Input() initiallySelected: Permission[];

  selected: Set<Permission> = new Set();
  userPermissions: Permission[];

  constructor(private ngxPermissionsService: NgxPermissionsService) { }

  ngOnInit(): void {
    this.userPermissions = Object.keys(this.ngxPermissionsService.getPermissions());
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.initiallySelected) {
      this.selected = new Set([].concat(
        this.selected,
      ));
    }
  }

  isDisabled(permission: Permission): boolean {
    return !this.ngxPermissionsService.getPermission(permission);
  }

  onCheck(perm: Permission, event: MatCheckboxChange): void {
    if (event.checked) this.selected.add(perm);
    if (!event.checked) this.selected.delete(perm);
  }

  selectAll(event: MouseEvent): void {
    event.preventDefault();
    this.selected = new Set(this.permissions.filter(p => !this.isDisabled(p)));
  }

  deselectAll(event: MouseEvent): void {
    event.preventDefault();
    this.selected = new Set();
  }

  get selectedPermissions(): Permission[] {
    return this.permissions.filter(p => this.selected.has(p));
  }
}
