import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';

@Injectable()

export class InvoicesService {

    invoicesSubject = new Subject<File[]>();
    invoices: File[];

    constructor( private parseService: ParseService) {
      this.invoices = [];
    }

    emitInvoiceSubject(): void {
        this.invoicesSubject.next(this.invoices.slice());
    }

    addInvoice(file: File): void {
        const invoiceObject = file;
        this.invoices.push(invoiceObject);
        this.emitInvoiceSubject();
      }

    removeInvoice(): void {
        this.invoices.pop();
        this.emitInvoiceSubject();
      }
    
    removeAll(): void {
      this.invoices = [];
      this.emitInvoiceSubject();
    }

    async submitInvoices(): Promise<void>{
      await this.parseService.fromFilestoText(this.invoices);
    }

}
