import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice-service/invoice.service';
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

  invoices: any[];
  invoiceSubscription: Subscription;
  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.invoiceSubscription = this.invoiceService.invoicesSubject.subscribe(
      (invoices: any[]) => {
        this.invoices = invoices;
      }
    );
    this.invoiceService.emitAppareilSubject();
  }

  onDrop(e) {
    e.preventDefault(); //<span spellcheck="true">;// évite d'ouvrir le fichier recherché</span>
    var files:File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      let file: File = files[key];
      this.invoiceService.addInvoice(file);
      console.log(file);
    });
  }

  onRemove() {
    this.invoiceService.removeInvoice();
  }

  onSubmit() {
    console.log("Submition...");
  }
}
