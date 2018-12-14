import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersListComponent } from './list/members-list.component';
import { MemberNewEditComponent } from './new-edit/member-new-edit.component';

const routes: Routes = [
  {
    path: 'new',
    component: MemberNewEditComponent,
  },
  {
    path: ':id',
    component: MemberNewEditComponent,
  },
  {
    path: '',
    component: MembersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
