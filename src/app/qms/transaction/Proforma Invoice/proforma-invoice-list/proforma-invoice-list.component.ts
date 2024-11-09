import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proforma-invoice-list',
  templateUrl: './proforma-invoice-list.component.html',
  styleUrls: ['./proforma-invoice-list.component.css', '../../../qms.styles.css']
})
export class ProformaInvoiceListComponent {
  selectedCountryId: any;
  countries: any;


  selectedRegionId: any;
  regions: any;

  PerformoInvoiceList: any[] = [];
  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  userId$: any;
  editRow: boolean = false;
  pageSize = 10;
  skip = 0;
  sizes = [10, 20, 50];
  buttonCount = 2

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>,public dialog: MatDialog,private PIService: ProformaInvoiceService
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
    this.PIService.GetProformaInvoiceList().subscribe((res: any) => {
      this.PerformoInvoiceList = res;
      this.PerformoInvoiceList = this.PerformoInvoiceList.map(item => {
        return {
          ...item,
          proInvoiceDate: item.proInvoiceDate === '1900-01-01T00:00:00' ? null : new Date(item.proInvoiceDate),
        };
      });
    })
  }

  add() {
    this.router.navigate(["/qms/transaction/add-proforma-invoice"]);
  }


  oncancel(obj: any) {

  }

  Edit(obj: any) {
    if(obj?.piStatus !== 'Pending for Approval' && 
      obj?.piStatus !== 'Pending for SAP Integration' && 
      obj?.piStatus !== 'Integrated with SAP' &&
      obj?.piStatus !== 'Rejected' &&
      obj?.piStatus !== 'Cancel'){
      let proformaInvoiceId = obj.proformaInvoiceId;
      this.router.navigate(['/qms/transaction/add-proforma-invoice', proformaInvoiceId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't edit the proforma invoice when the status is "${obj?.piStatus}".`,
        showConfirmButton: true,
      });
    }


  }

  view(obj: any) {
    let proformaInvoiceId = obj.proformaInvoiceId;
    this.router.navigate(['/qms/transaction/add-proforma-invoice/view', proformaInvoiceId]);
  }


  Save(obj: any) {

  }

  Update(obj: any) {

  }

  Delete(obj:any,id: any) {
    if(obj?.piStatus !== 'Pending for Approval' && 
      obj?.piStatus !== 'Pending for SAP Integration' && 
      obj?.piStatus !== 'Integrated with SAP' &&
      obj?.piStatus !== 'Rejected' &&
      obj?.piStatus !== 'Cancel'){
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete the Proforma Invoice!..",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.PIService.DeletePIById(id).subscribe((res: any) => {
            console.log(res)
            if (res['message'] == 1) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Deleted successfully",
                showConfirmButton: true,
              }).then((result) => {
                if (result.dismiss !== Swal.DismissReason.timer) {
                  this.getAllPIList();
                }
              });
              this.getAllPIList();
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong",
                showConfirmButton: false,
                timer: 2000,
              });
              this.getAllPIList();
            }
          },
            (err) => {
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong",
                showConfirmButton: false,
                timer: 2000,
              });
              this.getAllPIList();
            }
          )
        }
      })
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't delete the proforma invoice when the status is "${obj?.piStatus}".`,
        showConfirmButton: true,
      });
    }
    

  }


  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
}
