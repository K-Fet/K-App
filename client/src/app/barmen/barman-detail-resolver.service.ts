import { Injectable } from '@angular/core';
import { Barman } from '../shared/models';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BarmanService } from '../core/api-services/barman.service';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BarmanDetailResolverService implements Resolve<Barman> {

  constructor(private barmanService: BarmanService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Barman> | Observable<never> {
    const id = +route.paramMap.get('id');

    return this.barmanService.getById(id).pipe(
      take(1),
      mergeMap((barman) => {
        if (barman) return of(barman);
        // Not found
        this.router.navigate(['/barmen']);
        return EMPTY;
      }),
    );
  }
}
