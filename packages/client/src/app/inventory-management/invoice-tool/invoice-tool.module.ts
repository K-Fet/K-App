import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { InvoiceToolRoutingModule } from './invoice-tool-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home-page/home-page.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ArticlesComponent } from './articles/articles.component';
import { Article } from './article';

import { InvoicesService } from './services/invoices.service';
import { ParseService } from './services/parse.service';
import { ArticlesService } from './services/articles.service';

@NgModule({
  declarations: [
    HomePageComponent,
    ArticlesComponent,
    InvoicesComponent
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    InvoiceToolRoutingModule,
  ],
  providers: [
    InvoicesService,
    ParseService,
    ArticlesService,
    Article
  ]
})
export class InvoiceToolModule {}
