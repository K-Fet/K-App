import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { ProvidersRoutingModule } from './providers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ProvidersService } from './providers.service';
import { ProviderDetailResolverService } from './provider-detail-resolver.service';

@NgModule({
  declarations: [
    NewComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
  ],
  providers: [
    ProvidersService,
    ProviderDetailResolverService,
  ],
  imports: [
    SharedModule,
    NgxPermissionsModule.forChild(),
    ProvidersRoutingModule,
  ],
})
export class ProvidersModule {}
