import { Component, Input } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subgrid02',
  templateUrl: './subgrid02.component.html',
  styleUrls: ['./subgrid02.component.css']
})
export class Subgrid02Component {
  @Input() public pqMapping!: any;

  public detailGridData!: any[];

  public view!: Observable<GridDataResult>;
  public isLoading: boolean = false;
  public pageSize = 5;
  public skip = 0;

 

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.detailGridData = this.pqMapping;
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
