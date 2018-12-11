import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: 'new',
    component: NewComponent,
  },
  {
    path: ':id',
    component: ViewComponent,
  },
  {
    path: ':id/edit',
    component: EditComponent,
  },
  {
    path: '',
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarmenRoutingModule {}
