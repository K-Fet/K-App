import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()

export class InvoiceService {

    invoicesSubject = new Subject<File[]>();
    private invoices: File[];

    constructor() {
      this.invoices = [];
    }

    emitAppareilSubject(): void {
        this.invoicesSubject.next(this.invoices.slice());
    }

    addInvoice(file: File): void {
        const invoiceObject = file;
        this.invoices.push(invoiceObject);
        this.emitAppareilSubject();
      }

    removeInvoice(): void {
        this.invoices.pop();
        this.emitAppareilSubject();
      }
    
    removeAll(): void {
      this.invoices = [];
      this.emitAppareilSubject();
    }

}