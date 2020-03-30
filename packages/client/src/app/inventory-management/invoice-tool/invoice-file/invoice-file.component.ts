import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'invoice-tool-invoice-file',
  templateUrl: './invoice-file.component.html',
})
export class InvoiceFile implements OnInit {

  @Input() invoicename: string;
  constructor() { }

  ngOnInit() {
  }

}
