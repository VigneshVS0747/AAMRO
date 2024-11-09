import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { PIService } from '../pi.service';

@Component({
  selector: 'app-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.css']
})
export class PurchaseInvoiceListComponent {
  selectedCountryId: any;
  countries: any;


  selectedRegionId: any;
  regions: any;

  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  userId$: any;
  editRow: boolean = false;
  pageSize = 10;
  skip = 0;
  sizes = [10, 20, 50];
  buttonCount = 2
 PUrchaseInvoiceList: any[]=[];

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>,public dialog: MatDialog,private PIService:PIService
  ) {  }


  ngOnInit(): void {
    this.GetUserId();
    this.getAllPIList();
    this.store.select("privileges").subscribe({
      next: (res) => {
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


  getAllPIList() {
    this.PIService.GetAllPurchaseInvoice(this.userId$).subscribe((res: any) => {
      this.PUrchaseInvoiceList = res;
      this.PUrchaseInvoiceList = this.PUrchaseInvoiceList.map(item => {
        return {
          ...item,
          dueDate: item.dueDate === '1900-01-01T00:00:00' ? null : new Date(item.dueDate),
          billDate: item.billDate === '1900-01-01T00:00:00' ? null : new Date(item.billDate),
        };
      });

      console.log("ressss",res);
    })
  }

  add() {
    this.router.navigate(["/qms/transaction/add-purchase-invoice"]);
  }


  oncancel(obj: any) {

  }

  Edit(obj: any) {
    if(obj.statusId==1){
      let PurchaseInvoiceId = obj.purchaseInvoiceId;
      this.router.navigate(['/qms/transaction/add-purchase-invoice/edit', PurchaseInvoiceId]);
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't edit this because its move to Approval process or SAP Integration",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  view(obj: any) {
    let PurchaseInvoiceId = obj.purchaseInvoiceId;
    this.router.navigate(['/qms/transaction/add-purchase-invoice/view', PurchaseInvoiceId]);
  }


  Save(obj: any) {

  }

  Update(obj: any) {

  }

  // Delete(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Delete the Proforma Invoice!..",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.PIService.DeletePIById(id).subscribe((res: any) => {
  //         console.log(res)
  //         if (res['message'] == 1) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Success",
  //             text: "Deleted successfully",
  //             showConfirmButton: true,
  //           }).then((result) => {
  //             if (result.dismiss !== Swal.DismissReason.timer) {
  //               this.getAllPIList();
  //             }
  //           });
  //           this.getAllPIList();
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops!",
  //             text: "Something went wrong",
  //             showConfirmButton: false,
  //             timer: 2000,
  //           });
  //           this.getAllPIList();
  //         }
  //       },
  //         (err) => {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops!",
  //             text: "Something went wrong",
  //             showConfirmButton: false,
  //             timer: 2000,
  //           });
  //           this.getAllPIList();
  //         }
  //       )
  //     }
  //   })

  // }
  Delete(Data:any) {
    if(Data.statusId==1){
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete the Purchase Invoice ?..",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.PIService.DeletePI(Data.purchaseInvoiceId).subscribe((res) => {   
            this.getAllPIList();
            Swal.fire(
              'Deleted!',
              'Purchase Invoice has been deleted',
              'success'
            )
          });
  
        }
      })
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't delete this because its move to Approval process or SAP Integration",
        showConfirmButton: false,
        timer: 2000,
      });
    }
   
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
}


