import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-maingrid',
  templateUrl: './maingrid.component.html',
  styleUrls: ['./maingrid.component.css']
})
export class MaingridComponent implements OnInit {

  isLoading: boolean = true;
  gridData1: Observable<GridDataResult>;
  gridData2: Observable<GridDataResult>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<MaingridComponent>,){

  }
  ngOnInit(): void {
    this.isLoading = true;
    this.loadGridData();
    console.log("gridData1", this.gridData1);
    console.log("gridData2", this.gridData2);
  }

  private loadGridData(): void {
    const purchaseQuotationPqcompare = this.data.list.purchaseQuotationPqcompare;
    const firstRowData = [purchaseQuotationPqcompare[0]];
    const secondRowData = [purchaseQuotationPqcompare[1]];

    this.gridData1 = this.getGridData(firstRowData);
    this.gridData2 = this.getGridData(secondRowData);

    this.gridData1.subscribe(() => this.isLoading = false);
    this.gridData2.subscribe(() => this.isLoading = false);
  }

  private getGridData(dataArray: any[]): Observable<GridDataResult> {
    const result: GridDataResult = {
      data: dataArray,
      total: dataArray.length
    };
    return of(result);
  }

  close(){
    this.dialogRef.close();
  }
}
