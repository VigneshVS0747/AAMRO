import { Component, OnInit, ViewChild } from '@angular/core';
import { EnquiryService } from '../../enquiry.service';
import { Enquiry, EnquirySalesfunnel, Enquiryvaliditycloser } from 'src/app/Models/crm/master/transactions/Enquiry';
import { MatDialog } from '@angular/material/dialog';
import { FollowuphistoryComponent } from '../../enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { PotentialCustomer } from 'src/app/crm/master/potential-customer/potential-customer.model';
import { Customer } from 'src/app/crm/master/customer/customer.model';
import { PotentialCustomerService } from 'src/app/crm/master/potential-customer/potential-customer.service';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiryvalidityComponent } from '../../enquiryvalidity/enquiryvalidity.component';
import { SalesfunnellistComponent } from '../../salesfunnellist/salesfunnellist.component';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { CommonService } from 'src/app/services/common.service';
import { EmailComponent } from 'src/app/ums/Email/email/email.component';

import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from "@progress/kendo-data-query";
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.css']
})
export class EnquiryListComponent implements OnInit {
  enquiry: Enquiry[] = [];

  PotentialCustomer: PotentialCustomer[] = [];
  Customer: Customer[] = [];
  NewEnquiry: any[] = [];
  pagePrivilege: Array<string>;
  salesfunnel: EnquirySalesfunnel[] = [];
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  enquiryOptions: any[]= [];
  public fileExcelIcon: SVGIcon = fileExcelIcon;
  public group: { field: string }[] = [
    {
      field: "enquiryNumber",
    },
  ];
  @ViewChild(GridComponent) grid: GridComponent;
  
  constructor(private service: EnquiryService,
    private PCs: PotentialCustomerService,
    private Cus: CustomerService,
    public dialog: MatDialog,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private router: Router,
    private route: ActivatedRoute,private Ns:NofificationconfigurationService,
    private common: CommonService) {
      this.allData = this.allData.bind(this);
    this.fetchDropDownData();

  }

  ngOnInit(): void {
    this.GetUserId();
    this.Redirect();
    this.GetScreenIdByName();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
        //Get list by login user...
        this.GetAllEnquiry();
      }
    });
  }
  Redirect() {
    const pathmain = this.router.url;
    if (pathmain == "/crm/transaction/enquirylist/" + this.route.snapshot.params["id"]) {
      var Path = "/crm/transaction/enquiry/view/" + this.route.snapshot.params["id"];
      this.router.navigate([Path]);
    }
  }
  GetAllEnquiry() {

    this.service.GetAllEnquiry(parseInt(this.userId$)).subscribe((res) => {
      this.enquiry = res;
      console.log("this.enquiry",this.enquiry);
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  optionSelectedCustomername(id: number, cusid:number): string {
    if (cusid == 1) {
      const selectedid = this.PotentialCustomer.find(
        (item) => item.potentialCustomerId === id
      );

      return selectedid ? selectedid.customerName : "";
    } else {
      const selectedid = this.Customer.find(
        (item) => item.customerId === id
      );

      return selectedid ? selectedid.customerName : "";
    }
  }



  OpenHistory(basedocnameId: number, enquiryId: number, statusId: number) {
    const payload: FollowUpHistoryParms = {
      baseDocNameId: basedocnameId,
      baseDocId: enquiryId
    }
    const dialogRef = this.dialog.open(FollowuphistoryComponent, {
      data: {
        parms: payload,
        screen: 1,
        status: statusId,
      }, disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result != null) {
      //   this.EnqPackage.push(result);
      //   this.EnqPackage = [...this.EnqPackage];
      // }
    });
  }


  fetchDropDownData() {

    const PotentialC$ = this.PCs.getAllActivePotentialCustomer();
    const Cust$ = this.Cus.getAllActiveCustomer();




    forkJoin([Cust$, PotentialC$]).subscribe({
      next: ([Cust, PotentialC]) => {
        this.PotentialCustomer = PotentialC;
        this.Customer = Cust;

      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  Delete(Data:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Enquiry ?..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEnquiry(Data.enquiryId).subscribe((res) => {
          const parms ={
            MenuId:50,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:Data.enquiryId,
            code:Data.enquiryNumber
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{

          }));
          this.GetAllEnquiry();

          Swal.fire(
            'Deleted!',
            'Enquiry has been deleted',
            'success'
          )
        });

      }
    })
  }

  /*open validity*/
  OpenValidity() {
    const dialogRef = this.dialog.open(EnquiryvalidityComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

      const PayLoad: Enquiryvaliditycloser = {
        enquiry: result
      }
      this.service.PostEnquiryStatusList(PayLoad).subscribe((res) => {
        Swal.fire(
          'Closed!',
          'Enquiry has been Closed',
          'success'
        )
        this.GetAllEnquiry();
      });
    });
  }

  Opensalesfunnel(id: number) {
    const dialogRef = this.dialog.open(SalesfunnellistComponent, {
      data: {
        id: id,
      }, disableClose: true,
    });
  }

  ToRfq(id: number) {
    this.service.Fromenq = true;
    this.router.navigate(["/crm/transaction/rfq/create"]);
    this.service.setItemId(id);
  }

  //Excel
  // public allData(): ExcelExportData {
  //   const result: ExcelExportData = {
  //     data: process(this.enquiry, {
  //       //group: this.group,
  //       sort: [{ field: "enquiryNumber", dir: "desc" }],
  //     }).data,
  //     //group: this.group,
  //   };

  //   return result;
  // }
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.enquiry, { 
        filter: this.grid?.filter || undefined,
        sort: this.grid?.sort || undefined,
        group: this.grid?.group || [] 
      }).data as any[] 
    };

    return result;
  }
  

  //Filter
  GetScreenIdByName(){
    let screenName = 'Enquiry';
    this.common.GetScreenIdByName(screenName).subscribe((res:any)=>{
      console.log(res)
      if(res){
        this.getSearchBy(res);
      }
    })
  }

  getSearchBy(data:any){
    this.common.GetSearchByDropdownByScreenId(data?.menuId).subscribe((res:any)=>{
      console.log(res)
      this.enquiryOptions = res;
    })
  }
  onFilterChange(filterData: any) {
    console.log('Filter Data:', filterData);
  }

  SendMail(id:number){
    this.service.GetEnquirybasedCustomerEmailandFile(id).subscribe(
      (response) => {
        console.log("response",response)
        const customerEmail = response.customerEmail;
        const pdfBase64 = response.pdf;

        const dialogRef = this.dialog.open(EmailComponent, {
          data: {
            id:id,
            email: customerEmail,
            pdf: pdfBase64,
            screenId:50
          },
        width: '100%',
        height:'85%'
     });
     
      },
      (error: any) => {
        console.error('Error fetching email and PDF:', error);
        // Handle the error as needed
      }
    );
      
  }

}
