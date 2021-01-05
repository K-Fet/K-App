import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, } from '@angular/router';
import { Provider } from '../providers/provider.model';
import { ProvidersService } from './providers.service';

@Injectable()
export class ProviderDetailResolverService implements Resolve<Provider> {

  constructor(private providersService: ProvidersService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Provider> {
    const id = route.paramMap.get('id');

    const provider = await this.providersService.get(id);
    if (provider) return provider;

    this.router.navigate(['/inventory-management/providers']);
  }
}
