import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ServicesTemplate } from '../../shared/models';
import { ServicesTemplatesService } from '../../core/api-services/services-templates.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailResolverService implements Resolve<ServicesTemplate> {

  constructor(private templateService: ServicesTemplatesService,
    private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<ServicesTemplate> {
    const id = route.paramMap.get('id');

    const template = await this.templateService.get(id);
    if (template) return template;
    // Not found
    this.router.navigate(['/services/templates']);
  }
}
