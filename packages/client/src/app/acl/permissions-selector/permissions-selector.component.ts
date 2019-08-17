import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Permission } from '../../shared/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-permissions-selector',
  templateUrl: './permissions-selector.component.html',
})
export class PermissionsSelectorComponent implements OnInit, OnChanges {

  @Input() permissions: Permission[];
  @Input() initiallySelected: number[] | Permission[];

  selected: Set<number> = new Set();
  permissionMap: { [key: number]: Permission };
  userPermissions: string[];

  constructor(private ngxPermissionsService: NgxPermissionsService) { }

  ngOnInit() {
    this.updatePermissionMap();

    this.userPermissions = Object.keys(this.ngxPermissionsService.getPermissions());
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updatePermissionMap();
    if (this.initiallySelected) {
      this.selected = new Set([].concat(
        this.selected,
        // @ts-ignore
        this.initiallySelected.map(p => typeof p === 'number' ? p : (p as Permission).id),
      ));
    }
  }

  isDisabled(permission: Permission): boolean {
    return !this.ngxPermissionsService.getPermission(permission.name);
  }

  onCheck(perm: Permission, event: MatCheckboxChange) {
    if (event.checked) this.selected.add(perm.id);
    if (!event.checked) this.selected.delete(perm.id);
  }

  selectAll(event: MouseEvent) {
    event.preventDefault();
    this.selected = new Set(this.permissions.filter(p => !this.isDisabled(p)).map(p => p.id));
  }

  deselectAll(event: MouseEvent) {
    event.preventDefault();
    this.selected = new Set();
  }

  updatePermissionMap() {
    if (!this.permissions) return;
    this.permissionMap = this.permissions.reduce((map, p) => ({ ...map, [p.id]: p }), {});
  }

  get selectedPermissions(): Permission[] {
    return this.permissions.filter(p => this.selected.has(p.id));
  }
}
