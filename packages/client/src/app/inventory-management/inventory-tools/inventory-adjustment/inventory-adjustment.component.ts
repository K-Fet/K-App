import { Component } from '@angular/core';
import { StocksManagementService, ProductStockManagement } from '../services/stocks-management.service';

@Component({
  selector: 'app-inventory-adjustment',
  templateUrl: './inventory-adjustment.component.html',
  styleUrls: ['./inventory-adjustment.component.scss']
})
export class InventoryAdjustmentComponent{

  public date: Date;
  public stocks: ProductStockManagement[];
  public stoDate: Date;

  public onDownloadCsv: Function;


  constructor(
    private readonly stocksManagementService: StocksManagementService,
  ) { 
    this.onDownloadCsv = this.stocksManagementService.onDownloadCsv;
  }

  public async changeDate(event): Promise<void>{
    this.date = event.target.value;
  }

  public async submitSearch(): Promise<void>{
    const {endDate, stocks } = await this.stocksManagementService.getLastStockManagement(this.date);
    this.stocks = stocks;
    this.stoDate = endDate;
  }
  

  public hideStoK(): void {
    this.stocks = null;
  }
}
