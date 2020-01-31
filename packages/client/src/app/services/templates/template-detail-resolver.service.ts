import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Template } from '../../shared/models';
import { TemplateService } from '../../core/api-services/template.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailResolverService implements Resolve<Template> {

  constructor(private templateService: TemplateService,
    private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Template> {
    const id = route.paramMap.get('id');

    const template = await this.templateService.get(id);
    if (template) return template;
    // Not found
    this.router.navigate(['/services/templates']);
  }
}
