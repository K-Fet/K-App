import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MembersService } from './members.service';
import { Member } from './member.model';
import { ToasterService } from '../core/services/toaster.service';

@Injectable()
export class MemberDetailResolverService implements Resolve<Member> {

  constructor(private membersService: MembersService,
              private toasterService: ToasterService,
              private location: Location) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Member> {
    const id = route.paramMap.get('id');

    const shelf = await this.membersService.get(id);
    if (shelf) return shelf;

    this.toasterService.showToaster('Impossible de charger l\'adhérent');
    this.location.back();
  }
}
