import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ProductStockManagement } from '../../services/stocks-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/inventory-management/products/product.model';

@Component({
  selector: 'app-stocks-management-table',
  templateUrl: './stocks-management-table.component.html',
  styleUrls: ['./stocks-management-table.component.scss']
})
export class StocksManagementTableComponent implements OnInit {

  @Input('stocks')
  public stocks: ProductStockManagement[];

  public displayedColumns: string[] = ['product', 'deliveryQuantity', 'lastMonthStock', 'realInstantStock', 'theoreticalStocks', 'theoreticalSales', 'realSales', 'difference', 'diffSalesPercentage', 'diffStocksPercentage', 'cost'];
  public dataSource: MatTableDataSource<ProductStockManagement>;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public async ngOnInit(): Promise<void> {
    this.dataSource = new MatTableDataSource(this.stocks);
    this.dataSource.paginator = this.paginator; 
  }

  public applyFilter(event: Event): void {
    this.dataSource.filterPredicate = (data: ProductStockManagement, filterValue: string): boolean =>
      (data.product as Product).name.trim().toLowerCase().indexOf(filterValue) !== -1;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getTotalCost(): number {
    let total = 0;
    for(const a of this.stocks){
      if(a.cost !== 'Non Défini'){
        total += +a.cost;
      }
    }
    return total;
  }

}
