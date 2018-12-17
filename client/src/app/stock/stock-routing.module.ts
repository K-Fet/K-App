import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StockViewComponent} from "./stock-view/stock-view.component";
import {StockMenuComponent} from "./stock-menu/stock-menu.component";

const routes: Routes = [
  { path: 'view', component: StockViewComponent},
  { path: '', component: StockMenuComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule { }
