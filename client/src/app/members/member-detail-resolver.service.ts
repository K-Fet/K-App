import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MembersService } from './members.service';
import { Member } from './member.model';

@Injectable()
export class MemberDetailResolverService implements Resolve<Member> {

  constructor(private membersService: MembersService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Member> {
    const id = route.paramMap.get('id');

    const shelf = await this.membersService.get(id);
    if (shelf) return shelf;

    this.router.navigate(['/core/members']);
  }
}
