import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Role } from '../../shared/models';
import { RolesService } from '../../core/api-services/roles.service';

@Injectable({
  providedIn: 'root',
})
export class RoleDetailResolverService implements Resolve<Role> {

  constructor(private roleService: RolesService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Role> {
    const id = route.paramMap.get('id');

    const role = await this.roleService.get(id);
    if (role) return role;

    this.router.navigate(['/acl/role']);
  }
}
