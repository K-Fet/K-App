import { Component, OnInit } from '@angular/core';
import { StocksManagementService, ProductStockManagement } from '../../services/stocks-management.service';

@Component({
  selector: 'app-stocks-management',
  templateUrl: './stocks-management.component.html',
  styleUrls: ['./stocks-management.component.scss']
})
export class StocksManagementComponent implements OnInit {

  

  public stoKFet: {date: Date; stocks: ProductStockManagement[]}[];

  public onDownloadCsv: Function;

  constructor(
    private readonly stocksManagementService: StocksManagementService,
  ) { 
    this.onDownloadCsv = this.stocksManagementService.onDownloadCsv;
  }

  async ngOnInit(): Promise<void> {
    await this.initNStoKFet(5);
    for(const a of this.stoKFet){
      if(a.date === null){
        this.stoKFet.splice(this.stoKFet.length-1,1);
      }
    }
  }

  private async initNStoKFet(n: number): Promise<void> {
    this.stoKFet = [];
    const { endDate, stocks, beginDate } = await this.stocksManagementService.getLastStockManagement();
    let adate = beginDate;
    this.stoKFet.push({date: endDate, stocks});
    for(let i =1; i<n; i++){
      if(adate){
        const date = new Date(adate.getTime() + (60*60*24*1000));
        const {endDate, stocks, beginDate } = await this.stocksManagementService.getLastStockManagement(date);
        if(endDate === undefined) break;
        else{
          this.stoKFet.push({date: endDate, stocks});
          adate = beginDate;
        }
      }
    }
  }
}
