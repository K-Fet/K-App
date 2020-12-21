import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../services/invoices.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'invoice-tool-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit{

  invoices: File[];
  invoiceSubscription: Subscription;

  displayedColumns: string[] = ['name', 'size'];

  constructor( private invoiceService: InvoicesService){}

  ngOnInit(): void {
    this.invoiceSubscription = this.invoiceService.invoicesSubject.subscribe(
      (invoices: File[]) => {
        this.invoices = invoices;
      }
    );
    this.invoiceService.emitInvoiceSubject();
  }

}