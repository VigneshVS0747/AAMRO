import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountriesService } from 'src/app/ums/masters/countries/countries.service';
import { RfqService } from '../rfq.service';
import { ServiceTypeServiceService } from 'src/app/crm/master/servicetype/service-type-service.service';
import { VendorContactList } from 'src/app/Models/crm/master/transactions/RFQ/Rfqgeneral';

@Component({
  selector: 'app-rfqvendorcontactdialog',
  templateUrl: './rfqvendorcontactdialog.component.html',
  styleUrls: ['./rfqvendorcontactdialog.component.css']
})
export class RfqvendorcontactdialogComponent implements OnInit {
  vendorcontactlist:VendorContactList[]=[];
  ActiveContacts: any[]=[];
  hideselect: boolean;
  oldContactList: any[]=[];
  disableselect: boolean;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  private Country: CountriesService,
  private serviceTypeService: ServiceTypeServiceService,
  private RFQS:RfqService,
  public dialogRef: MatDialogRef<RfqvendorcontactdialogComponent>){
    dialogRef.disableClose = true;
  }


  ngOnInit(): void {
    this.vendorcontactlist = this.data.list;
    this.oldContactList = this.data.list;
    this.viewmode();
  }

  viewmode(){
    if(this.data.mode=="view"){
      this.hideselect = true;
      this.disableselect = true;
    }
  }

  Addtolist(){

    //this.ActiveContacts = this.vendorcontactlist.filter(item => item.active === 1);
    this.ActiveContacts = this.vendorcontactlist
    this.dialogRef.close(this.ActiveContacts);
  }
  Close(){
    this.dialogRef.close(this.oldContactList);
  }

  toggleCheckbox(i:number){
    this.vendorcontactlist[i].active = this.vendorcontactlist[i].active ? false : true;
    this.vendorcontactlist[i].createdBy =1;
    this.vendorcontactlist[i].updatedBy =1;
    
  }

}
