import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { InvoiceToolRoutingModule } from './invoice-tool-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { InvoiceParse } from './invoice-parse/invoice-parse.component';
import { InvoiceFile } from './invoice-file/invoice-file.component';

import { InvoiceService } from './invoice-service/invoice.service';

@NgModule({
  declarations: [
    InvoiceParse,
    InvoiceFile,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InvoiceToolRoutingModule,
  ],
  providers: [
    InvoiceService
  ]
})
export class InvoiceToolModule {}
