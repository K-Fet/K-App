import { Component, Input } from '@angular/core';

@Component({
  selector: 'invoice-tool-invoice-file',
  templateUrl: './invoice-file.component.html',
})
export class InvoiceFile {

  @Input() invoicename: string;

}
