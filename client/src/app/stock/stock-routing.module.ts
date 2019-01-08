import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StockViewComponent} from "./stock-view/stock-view.component";
import {StockMenuComponent} from "./stock-menu/stock-menu.component";
import {AddOrderViewComponent} from "./add-order-view/add-order-view.component";

const routes: Routes = [
  { path: 'stock/view', component: StockViewComponent},
  { path: 'stock', component: StockMenuComponent},
  { path:'stock/orders/add', component: AddOrderViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule { }
