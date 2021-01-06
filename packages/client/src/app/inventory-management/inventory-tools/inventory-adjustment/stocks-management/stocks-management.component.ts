import { Component, OnInit } from '@angular/core';
import { StocksManagementService, ProductStockManagement } from '../../services/stocks-management.service';
import { Product } from 'src/app/inventory-management/products/product.model';
import { ProductsService } from 'src/app/inventory-management/api-services/products.service';

@Component({
  selector: 'app-stocks-management',
  templateUrl: './stocks-management.component.html',
  styleUrls: ['./stocks-management.component.scss']
})
export class StocksManagementComponent implements OnInit {

  
  public products: Product[];

  public stoKFet: {date: Date; stocks: ProductStockManagement[]}[];

  constructor(
    private readonly stocksManagementService: StocksManagementService,
    private readonly productsService: ProductsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.products = await this.productsService.listAll(); 
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
    this.stoKFet[0].stocks = this.bindProductOnId(this.stoKFet[0].stocks);
    this.stoKFet[0].stocks = this.setCost(this.stoKFet[0].stocks);
    for(let i =1; i<n; i++){
      if(adate){
        const date = new Date(adate.getTime() + (60*60*24*1000));
        const {endDate, stocks, beginDate } = await this.stocksManagementService.getLastStockManagement(date);
        if(endDate === undefined) break;
        else{
          this.stoKFet.push({date: endDate, stocks});
          this.stoKFet[i].stocks = this.bindProductOnId(this.stoKFet[i].stocks);
          this.stoKFet[i].stocks = this.setCost(this.stoKFet[i].stocks);
          adate = beginDate;
        }
      }
    }
  }

  private bindProductOnId(stocks: ProductStockManagement[]): ProductStockManagement[]{
    if(stocks){
      for(const sto of stocks) {
        const index = this.products.map(prod => prod._id).indexOf(sto.product as string);
        if(index>-1){
          sto.product = this.products[index];
        }
      }
      stocks.sort(this.sortTable)
      return stocks;
    }
    return null;
  }

  public onDownloadCsv(date: Date, stocks: ProductStockManagement[]): void {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += 'Produit, Quantité Livrée, Stock Mois Dernier, Stock Réel, Stock Théorique, Ventes Théoriques, Ventes Réelles, Difference, Pourcentage Pertes (ventes), Pourcentage Pertes (stocks), Coût des pertes \r\n';
    for (const a of stocks){
      csvContent += `${(a.product as Product).name}, ${a.deliveryQuantity}, ${a.lastMonthStock}, ${a.realInstantStock}, ${a.theoreticalStocks}, ${a.theoreticalSales}, ${a.realSales}, ${a.difference}, ${a.diffSalesPercentage}, ${a.diffStocksPercentage}, ${a.cost} \r\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stokFet${date.toString()}.csv`);
    document.body.appendChild(link); // Required for FF
    
    link.click();
  }

  private sortTable(a: ProductStockManagement, b: ProductStockManagement): number{
    if((a.product as Product).provider !== (b.product as Product).provider){
      if((a.product as Product).provider > (b.product as Product).provider){
        return 1;
      }
      else return -1;
    } else {
      if((a.product as Product).shelf !== (b.product as Product).shelf){
        if((a.product as Product).shelf > (b.product as Product).shelf){
          return 1;
        }
        else return -1;
      } else {
        if((a.product as Product).name > (b.product as Product).name){
          return 1;
        } else return -1;
      }
    }
  }
  
  private setCost(stocks: ProductStockManagement[]): ProductStockManagement[] {
    for (const index in stocks){
      if((stocks[index].product as Product).price){
        stocks[index].cost = ((stocks[index].product as Product).price*stocks[index].difference).toString();
      }
      else {
        stocks[index].cost = 'Non Défini';
      }
    }
    return stocks;
  }
}
