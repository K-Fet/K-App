import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailResolverService } from './product-detail-resolver.service';
import { ProductsService } from './products.service';
import { ProviderDetailResolverService } from './provider-detail-resolver.service';
import { ProvidersService } from './providers.service';

@NgModule({
  declarations: [],
  providers: [
    ProductDetailResolverService,
    ProductsService,
    ProviderDetailResolverService,
    ProvidersService,
  ],
  imports: [CommonModule],
})
export class InventoryManagementApiServicesModule {}
