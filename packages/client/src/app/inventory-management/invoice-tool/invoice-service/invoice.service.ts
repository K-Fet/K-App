import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()

export class InvoiceService {

    invoicesSubject = new Subject<any[]>();
    private invoices = [];

    emitAppareilSubject() {
        this.invoicesSubject.next(this.invoices.slice());
    }

    addInvoice(file : File) {
        const invoiceObject = file;
        this.invoices.push(invoiceObject);
        this.emitAppareilSubject();
      }

    removeInvoice() {
        this.invoices.pop();
        this.emitAppareilSubject();
      }
    
    removeAll() {
      this.invoices = [];
      this.emitAppareilSubject();
    }

}