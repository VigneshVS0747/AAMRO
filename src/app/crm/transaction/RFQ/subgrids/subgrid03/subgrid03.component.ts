import { Component, Input } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subgrid03',
  templateUrl: './subgrid03.component.html',
  styleUrls: ['./subgrid03.component.css']
})
export class Subgrid03Component {
  @Input() public category3!: any;

  public detailGridData!: any[];

  public view!: Observable<GridDataResult>;
  public isLoading: boolean = false;
  public pageSize = 5;
  public skip = 0;

  columns:any[]=[
    {field: 'category', title: 'Category', width: '150px',filter: 'numeric',},
    {field: 'vendor1', title: 'Vendor 1', width: '150px',filter: 'numeric',},
    {field: 'vendor2', title: 'Vendor 2', width: '150px',filter: 'numeric',},
    {field: 'vendor3', title: 'Vendor 3', width: '150px',filter: 'numeric',},
    {field: 'vendor4', title: 'Vendor 4', width: '150px',filter: 'numeric',},
  ]

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.detailGridData = this.category3;
      this.view = this.prepareProducts(this.detailGridData);
      this.isLoading = false;
    }, 1000); 
  }



  private prepareProducts(data: any[]): Observable<GridDataResult> {
    const result: GridDataResult = {
      data: data?.slice(this.skip, this.skip + this.pageSize),
      total: data?.length
    };
    return new Observable(observer => {
      observer.next(result);
      observer.complete();
    });
  }

  public pageChange(event: any): void {
    this.skip = event.skip;
    this.loadProducts();
  }
}
