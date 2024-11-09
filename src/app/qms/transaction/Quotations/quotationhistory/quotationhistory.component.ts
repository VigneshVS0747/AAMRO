import { Component, Inject, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { QuotationGeneral } from '../quotation-model/quote';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorvalueComponent } from '../vendorvalue/vendorvalue.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotationhistory',
  templateUrl: './quotationhistory.component.html',
  styleUrls: ['./quotationhistory.component.css']
})
export class QuotationhistoryComponent implements OnInit {
  Qhistorylist: QuotationGeneral[]=[];
  

  constructor(private QS:QuotationService, @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<QuotationhistoryComponent>, private router: Router,){

  }
  ngOnInit(): void {
    this.getQuoteHistory();
  }

  getQuoteHistory() {
    this.QS.GetQuotationHistory(this.data.Qnumber).subscribe((res => {
      this.Qhistorylist = res.map(option => {
        const newDate = new Date(option.createdDate);
        newDate.setHours(0, 0, 0, 0); 
        return {
          ...option,
          createdDate: newDate
        };
      });
      console.log("this.Qhistorylist", this.Qhistorylist);
    }));
  }

 close(){
  this.dialogRef.close();
 }
 ViewQuote(Data:any){
  this.dialogRef.close();
  this.router.navigate(["/qms/transaction/Quote/view", Data.quotationId]);
 }
}
