import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { StockEvent } from '../stock-events/stock-events.model';
import { StockEventsService } from './stock-events.service';

@Injectable()
export class StockEventDetailResolverService implements Resolve<StockEvent> {

  constructor(private stockEventsService: StockEventsService,
              private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<StockEvent> {
    const id = route.paramMap.get('id');

    const stockEvent = await this.stockEventsService.get(id);
    if (stockEvent) return stockEvent;

    this.router.navigate(['/inventory-management/shelves']);
  }
}
