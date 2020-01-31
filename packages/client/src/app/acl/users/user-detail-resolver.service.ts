import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../../shared/models';
import { UsersService } from '../../core/api-services/users.service';

@Injectable()
export class UserDetailResolverService implements Resolve<User> {

  constructor(private usersService: UsersService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<User> {
    const id = route.paramMap.get('id');

    const user = await this.usersService.get(id);
    if (user) return user;

    this.router.navigate(['/acl/users']);
  }
}
