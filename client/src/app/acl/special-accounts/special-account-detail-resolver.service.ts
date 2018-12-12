import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { SpecialAccount } from '../../shared/models';
import { SpecialAccountService } from '../../core/api-services/special-account.service';

@Injectable({
  providedIn: 'root',
})
export class SpecialAccountDetailResolverService implements Resolve<SpecialAccount> {

  constructor(private specialAccountService: SpecialAccountService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<SpecialAccount> | Observable<never> {
    const id = +route.paramMap.get('id');

    return this.specialAccountService.getById(id).pipe(
      take(1),
      mergeMap((specialAccount) => {
        if (specialAccount) return of(specialAccount);
        // Not found
        this.router.navigate(['/acl/special-accounts']);
        return EMPTY;
      }),
    );
  }
}
