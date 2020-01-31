import { Injectable } from '@angular/core';
import { Kommission } from '../shared/models';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { KommissionService } from '../core/api-services/kommission.service';

@Injectable({
  providedIn: 'root',
})
export class KommissionDetailResolverService implements Resolve<Kommission> {

  constructor(private kommissionService: KommissionService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Kommission> {
    const id = route.paramMap.get('id');

    const kommission = await this.kommissionService.get(id, { populate: 'barmen' });
    if (kommission) return kommission;

    this.router.navigate(['/kommissions']);
  }
}
