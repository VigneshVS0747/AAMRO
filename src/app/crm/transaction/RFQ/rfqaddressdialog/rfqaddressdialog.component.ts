import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceTypeServiceService } from 'src/app/crm/master/servicetype/service-type-service.service';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { RfqService } from '../rfq.service';
import { RfqvendorcontactdialogComponent } from '../rfqvendorcontactdialog/rfqvendorcontactdialog.component';
import { VendorAddressList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';

@Component({
  selector: 'app-rfqaddressdialog',
  templateUrl: './rfqaddressdialog.component.html',
  styleUrls: ['./rfqaddressdialog.component.css']
})
export class RfqaddressdialogComponent implements OnInit {
  vendorAddresslist:VendorAddressList[]=[];
  ActiveAddress: any[]=[];
  hideselect: boolean;
  oldvendorAddressList: VendorAddressList[]=[];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  private Country: CountriesService,
  private serviceTypeService: ServiceTypeServiceService,
  private RFQS:RfqService,
  public dialogRef: MatDialogRef<RfqvendorcontactdialogComponent>){
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.vendorAddresslist = this.data.list;
    this.oldvendorAddressList  = this.data.list;
    this.viewmode();  
  }

  viewmode(){
    if(this.data.mode=="view"){
      this.hideselect = true;
    }
  }

  Addtolist(){
    this.ActiveAddress = this.vendorAddresslist
    this.dialogRef.close(this.ActiveAddress);
  }

  toggleCheckbox(i:number){
    this.vendorAddresslist[i].active = this.vendorAddresslist[i].active ? false : true;
    this.vendorAddresslist[i].createdBy =1;
    this.vendorAddresslist[i].updatedBy =1;
    
  }

  Close(){
    
    this.dialogRef.close(this.oldvendorAddressList);
  }

}
