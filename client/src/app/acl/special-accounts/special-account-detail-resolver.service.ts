import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SpecialAccount } from '../../shared/models';
import { SpecialAccountService } from './special-account.service';

@Injectable()
export class SpecialAccountDetailResolverService implements Resolve<SpecialAccount> {

  constructor(private specialAccountService: SpecialAccountService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<SpecialAccount> {
    const id = +route.paramMap.get('id');

    const specialAccount = await this.specialAccountService.getById(id);
    if (specialAccount) return specialAccount;

    this.router.navigate(['/acl/special-accounts']);
  }
}
