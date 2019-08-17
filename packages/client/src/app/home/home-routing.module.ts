import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PresentationComponent } from './presentation/presentation.component';

const routes: Routes = [
  {
    path: 'presentation',
    component: PresentationComponent,
  },
  {
    path: '',
    component: HomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
