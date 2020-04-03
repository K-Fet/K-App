import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'invoice-tool-invoice-article',
  templateUrl: './invoice-article.component.html',
})
export class InvoiceArticle implements OnInit {

  @Input() articlename: String;
  @Input() nbarticle: number;
  constructor() { }

  ngOnInit() {
  }

}
