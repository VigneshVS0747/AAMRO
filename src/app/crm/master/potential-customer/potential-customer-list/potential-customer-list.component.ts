import { Component } from '@angular/core';
import { PotentialCustomerService } from '../potential-customer.service';
import { Router } from '@angular/router';
import { PotentialCustomer } from '../potential-customer.model';
import Swal from 'sweetalert2';
import { FollowuphistoryComponent } from 'src/app/crm/transaction/Enquiry/enquiry/FollowUphistory/followuphistory/followuphistory.component';
import { MatDialog } from '@angular/material/dialog';
import { FollowUpHistoryParms } from 'src/app/Models/crm/master/transactions/Followup';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';

@Component({
  selector: 'app-potential-customer-list',
  templateUrl: './potential-customer-list.component.html',
  styleUrls: ['./potential-customer-list.component.css']
})
export class PotentialCustomerListComponent {
  potentialCustomer: PotentialCustomer[] = [];
  movetoCustomer: boolean;
  selectedCustomerId: number;
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
  userId$: string;
  
  constructor(private potentialCustomerSvc: PotentialCustomerService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    public dialog: MatDialog, private UserIdstore: Store<{ app: AppState }>,private Ns:NofificationconfigurationService) { }
   

  ngOnInit(): void {
    this.getAllPotentialCustomer();
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  getAllPotentialCustomer() {
    this.potentialCustomerSvc.getAllPotentialCustomer().subscribe(result => {
      this.potentialCustomer = result;

      console.log("result", result);
    });
  }

  add() {
    this.potentialCustomerSvc.isView = false;
    this.potentialCustomerSvc.isEdit = false;
    this.router.navigate(["/crm/master/potentialcustomer/create"]);
    this.potentialCustomerSvc.setItemId(0)
  }

  onEdit(item: any) {
    if (item.pcStatusId==3) {
      Swal.fire({
        title: 'Exist',
        text: "The " + item.customerName + ' potential customer is already moved to customer...!',
        icon: 'warning',
        confirmButtonText: 'ok'
      })
      return
    }
    this.potentialCustomerSvc.isView = false;
    this.potentialCustomerSvc.isEdit = true;
    this.potentialCustomerSvc.setItemId(item.potentialCustomerId);
    this.router.navigate(["/crm/master/potentialcustomer/create"]);

  }

  onview(item: any) {
    if (item) {
      this.potentialCustomerSvc.isView = true;
      this.potentialCustomerSvc.isEdit = false;
      this.potentialCustomerSvc.setItemId(item.potentialCustomerId);
      this.router.navigate(["/crm/master/potentialcustomer/create"]);

    }
  }
  onMail(data: any) {
    alert('Mail');
  }

  onDelete(data: any) {
    Swal.fire({
      title: 'Are you sure to?',
      text: "Delete " + data.customerName + '...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.potentialCustomerSvc.deletePotentialCustomer(data.potentialCustomerId).subscribe((res) => {
          const parms ={
            MenuId:25,
            currentUser:this.userId$,
            activityName:"Deletion",
            id:data.potentialCustomerId,
            code:data.potentialCustomerCode
          }
          this.Ns.TriggerNotification(parms).subscribe((res=>{

          }));
          this.getAllPotentialCustomer();
          Swal.fire(
            'Deleted!',
            'Potential customer ' + data.customerName + ' has been deleted',
            'success'
          )
        },);
      }
    })

  }
  salesOpp(item: any) {
    // if (item.pcStatusId == 2) {
    //   Swal.fire({
    //     title: 'Info',
    //     text: "The " + item.customerName + ' potential customer is already In-Active...!',
    //     icon: 'info',
    //     confirmButtonText: 'ok'
    //   })
    //   return
    // }
    if (item) {
      if (this.pagePrivilege.includes('edit')) {
        this.potentialCustomerSvc.isEdit = true;
      } 
       if (this.pagePrivilege.includes('view')) {
        this.potentialCustomerSvc.isView =true ;
      }
      if (this.pagePrivilege.includes('create')) {
        this.potentialCustomerSvc.isAdd = true;
      }
      this.potentialCustomerSvc.salesOppourtunity = true;
      this.potentialCustomerSvc.setItemId(item.potentialCustomerId);

      // Set the selected customer ID to a variable
      this.selectedCustomerId = item.potentialCustomerId;

      // Pass the id as a parameter when navigating
      this.router.navigate(['/crm/transaction/salesopportunity/create']);
    }
  }


  // In the salesOpp method
  // salesOpp(item: any) {
  //   if (item) {
  //     this.router.navigate(['/crm/transaction/salesopportunity/create'], {
  //       queryParams: {
  //         customerId: item.customerId,
  //         serviceName: item.serviceName // Assuming serviceName is available in the item
  //       }
  //     });
  //   }
  // }

  pcToCustomer(item: any) {
    debugger
    if (item.pcStatusId == 4) {
      Swal.fire({
        title: 'Info',
        text: "The " + item.customerName + ' potential customer is Unable to move customer...!',
        icon: 'info',
        confirmButtonText: 'ok'
      })
      return;
    }
    if (item.pcStatusId==3) {
      Swal.fire({
        title: 'Exist',
        text: "The " + item.customerName + ' potential customer is already moved to customer...!',
        icon: 'warning',
        confirmButtonText: 'ok'
      })
      return
    }
    if (item.pcStatusId == 2) {
      Swal.fire({
        title: 'Info',
        text: "The " + item.customerName + ' potential customer is already In-Active...!',
        icon: 'info',
        confirmButtonText: 'ok'
      })
      return
    }
    this.potentialCustomerSvc.movetoCustomer = true;
    this.potentialCustomerSvc.setItemId(item.potentialCustomerId);
    this.router.navigate(["/crm/master/customer/create"]);
  }

 OpenHistory(basedocnameId:number,potentialCustomerId:number,statusId:number){
  const payload:FollowUpHistoryParms={
    baseDocNameId: basedocnameId,
    baseDocId: potentialCustomerId
  }
  const dialogRef = this.dialog.open(FollowuphistoryComponent, {
    data: {
      parms:payload,
      screen:3,
      status:statusId,
    }, disableClose: true,
  });
  dialogRef.afterClosed().subscribe(result => {
    // if (result != null) {
    //   this.EnqPackage.push(result);
    //   this.EnqPackage = [...this.EnqPackage];
    // }
  });
}

}
