import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnquirySalesfunnel } from 'src/app/Models/crm/master/transactions/Enquiry';
import { EnquiryService } from '../enquiry.service';

@Component({
  selector: 'app-salesfunnellist',
  templateUrl: './salesfunnellist.component.html',
  styleUrls: ['./salesfunnellist.component.css']
})
export class SalesfunnellistComponent implements OnInit {
  salesfunnel:EnquirySalesfunnel[]=[];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SalesfunnellistComponent>,
private service:EnquiryService){
    
  }

  ngOnInit(): void {
    this.service.GetAllsalesfunnel(this.data.id).subscribe((res)=>{
      this.salesfunnel = res;
      console.log(this.salesfunnel);
    });
  }
  Closemodal(){
    this.dialogRef.close();
  }
}
