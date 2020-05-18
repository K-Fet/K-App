import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailResolverService } from './product-detail-resolver.service';
import { ProductsService } from './products.service';
import { ProviderDetailResolverService } from './provider-detail-resolver.service';
import { ProvidersService } from './providers.service';
import { ShelfDetailResolverService } from './shelf-detail-resolver.service';
import { ShelvesService } from './shelves.service';
import { StockEventDetailResolverService } from './stock-event-detail-resolver.service';
import { StockEventsService } from './stock-events.service';

@NgModule({
  declarations: [],
  providers: [
    ProductDetailResolverService,
    ProductsService,
    ProviderDetailResolverService,
    ProvidersService,
    ShelfDetailResolverService,
    ShelvesService,
    StockEventsService,
    StockEventDetailResolverService
  ],
  imports: [CommonModule],
})
export class InventoryManagementApiServicesModule {}
