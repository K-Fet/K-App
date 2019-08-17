import { Injectable } from '@angular/core';
import { Barman } from '../shared/models';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BarmanService } from '../core/api-services/barman.service';

@Injectable({
  providedIn: 'root',
})
export class BarmanDetailResolverService implements Resolve<Barman> {

  constructor(private barmanService: BarmanService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Barman> {
    const id = +route.paramMap.get('id');

    const barman = await this.barmanService.getById(id);
    if (barman) return barman;
    // Not found
    this.router.navigate(['/barmen']);
  }
}
