import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice-service/invoice.service';
import { InvoiceParseService } from '../invoice-service/invoice-parse.service';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './invoice-parse.component.html',
  styles: [`
    #dropzone {
      background-color: white;
      height: 300px;
      border: 5px dotted #ccc;
    }

    #dropzone:hover {
      border-color: black;
    }
  `]
})
export class InvoiceParse implements OnInit {

  invoices: File[];
  articles: any[];
  isEmpty: boolean;

  invoiceSubscription: Subscription;
  constructor(private invoiceService: InvoiceService,
              private invoiceParseService: InvoiceParseService) { }

  ngOnInit() {
    this.invoiceSubscription = this.invoiceService.invoicesSubject.subscribe(
      (invoices: any[]) => {
        this.invoices = invoices;
      }
    );
    this.invoiceService.emitAppareilSubject();
    this.isEmpty = true;
  }

  onDrop(e) {
    e.preventDefault(); //<span spellcheck="true">;// évite d'ouvrir le fichier recherché</span>
    const files: File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      const file: File = files[key];
      this.invoiceParseService.fromFiletoText(file);
      this.invoiceService.addInvoice(file);
    });
  }

  onRemove() {
    this.invoiceService.removeInvoice();
    this.invoiceParseService.removeOne();
  }

  async onSubmit() {
    if(this.invoices.length <= 0){
      alert("Vous devez rentrer au moins une facture");
    }
    else{
      this.invoiceParseService.parsePDF();
      this.articles = this.invoiceParseService.listarticle;
      this.isEmpty = false;
      this.invoiceService.removeAll();
    }
  }
}
