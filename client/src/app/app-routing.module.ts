import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { PresentationComponent } from './presentation/presentation.component';

const routes: Routes = [
  {
    path: 'legacy',
    loadChildren: './legacy-app/legacy-app.module#LegacyAppModule',
  },
  {
    path: 'inventory-management',
    loadChildren: './inventory-management/inventory-management.module#InventoryManagementModule',
  },
  {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactModule',
  },
  {
    path: 'presentation',
    component: PresentationComponent,
  },
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
