import { Injectable } from '@angular/core';
import { Kommission } from '../shared/models';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { KommissionService } from '../core/api-services/kommission.service';

@Injectable({
  providedIn: 'root',
})
export class KommissionDetailResolverService implements Resolve<Kommission> {

  constructor(private kommissionService: KommissionService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Kommission> | Observable<never> {
    const id = +route.paramMap.get('id');

    return this.kommissionService.getById(id).pipe(
      take(1),
      mergeMap((kommission) => {
        if (kommission) return of(kommission);
        // Not found
        this.router.navigate(['/kommissions']);
        return EMPTY;
      }),
    );
  }
}
