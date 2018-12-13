import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Template } from '../../shared/models';
import { TemplateService } from '../../core/api-services/template.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailResolverService implements Resolve<Template> {

  constructor(private templateService: TemplateService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Template> | Observable<never> {
    const id = +route.paramMap.get('id');

    return this.templateService.getById(id).pipe(
      take(1),
      mergeMap((template) => {
        if (template) return of(template);
        // Not found
        this.router.navigate(['/services/templates']);
        return EMPTY;
      }),
    );
  }
}
