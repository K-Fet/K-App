import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Role } from '../../shared/models';
import { RoleService } from '../../core/api-services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleDetailResolverService implements Resolve<Role> {

  constructor(private roleService: RoleService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Role> | Observable<never> {
    const id = +route.paramMap.get('id');

    return this.roleService.getById(id).pipe(
      take(1),
      mergeMap((role) => {
        if (role) return of(role);
        // Not found
        this.router.navigate(['/acl/role']);
        return EMPTY;
      }),
    );
  }
}
