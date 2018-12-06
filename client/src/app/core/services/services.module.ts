import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';
import { ToasterService } from './toaster.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    LoaderService,
    ToasterService,
  ],
})
export class ServicesModule {}
