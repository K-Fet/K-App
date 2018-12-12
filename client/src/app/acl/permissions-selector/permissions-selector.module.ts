import { NgModule } from '@angular/core';
import { PermissionsSelectorComponent } from './permissions-selector.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PermissionsSelectorComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    PermissionsSelectorComponent,
  ],
})
export class PermissionsSelectorModule {}
