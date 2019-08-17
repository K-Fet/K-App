import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Role } from '../../shared/models';
import { RoleService } from '../../core/api-services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleDetailResolverService implements Resolve<Role> {

  constructor(private roleService: RoleService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Role> {
    const id = +route.paramMap.get('id');

    const role = await this.roleService.getById(id);
    if (role) return role;

    this.router.navigate(['/acl/role']);
  }
}
