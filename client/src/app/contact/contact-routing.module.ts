import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';

const routes: Routes = [
  {
    path: 'concert',
    component: ContactFormComponent,
    data: { type: 'concert' },
  },
  {
    path: 'event',
    component: ContactFormComponent,
    data: { type: 'event' },
  },
  {
    path: 'lost',
    component: ContactFormComponent,
    data: { type: 'lost' },
  },
  {
    path: 'website',
    component: ContactFormComponent,
    data: { type: 'website' },
  },
  {
    path: '',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
