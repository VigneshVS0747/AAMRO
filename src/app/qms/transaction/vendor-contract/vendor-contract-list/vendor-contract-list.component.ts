import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-contract-list',
  templateUrl: './vendor-contract-list.component.html',
  styleUrls: ['./vendor-contract-list.component.css', '../../../qms.styles.css']
})
export class VendorContractListComponent {
  selectedCountryId: any;
  countries: any;


  selectedRegionId: any;
  regions: any;

  VendorContractList: any[] = [];
  pagePrivilege: Array<string>;

  showAddRow: boolean | undefined;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: any;
  editRow: boolean = false;
  pageSize = 10;
  skip = 0;
  sizes = [10, 20, 50];
  buttonCount = 2

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>
  ) {
  }


  ngOnInit(): void {
    this.GetUserId();
    this.getAllVendor();
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


  getAllVendor() {
    this.regionService.GetAllVendorCustomer().subscribe((res: any) => {
      this.VendorContractList = res?.result;
      this.VendorContractList = this.VendorContractList.map(item => {
        return {
          ...item,
          contractDate: item.contractDate === '1900-01-01T00:00:00' ? null : new Date(item.contractDate),
          validFrom: item.validFrom === '1900-01-01T00:00:00' ? null : new Date(item.validFrom),
          validTo: item.validTo === '1900-01-01T00:00:00' ? null : new Date(item.validTo),
        };
      });
    })
  }

  add() {
    this.router.navigate(["/qms/transaction/add-vendor-contract"]);
  }

  copyFrom(id:any){
    this.router.navigate(["/qms/transaction/add-vendor-contract"], { queryParams: { contractId: id } });
  }

  oncancel(obj: any) {

  }

  Edit(obj: any) {

    if(obj?.contractStatus === 'Draft' || obj?.contractStatus === 'Active'){
      let vendorContractFFSId = obj.vendorContractFFSId;
      this.router.navigate(['/qms/transaction/add-vendor-contract', vendorContractFFSId]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't edit the customer contract when the status is "${obj?.contractStatus}".`,
        showConfirmButton: true,
      });
    }
  }

  view(obj: any) {
    let vendorContractFFSId = obj.vendorContractFFSId;
    this.router.navigate(['/qms/transaction/add-vendor-contract/view', vendorContractFFSId]);
  }


  Save(obj: any) {

  }

  Update(obj: any) {

  }


  Delete(obj: any,id: any) {
    if(obj?.contractStatus === 'Draft'){
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete the Vendor Contract!..",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.regionService.DeleteVendorContract(id).subscribe((res: any) => {
            console.log(res)
            if (res['message'] == 1) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Deleted successfully",
                showConfirmButton: true,
              }).then((result) => {
                if (result.dismiss !== Swal.DismissReason.timer) {
                  this.getAllVendor();
                }
              });
              this.getAllVendor();
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong",
                showConfirmButton: false,
                timer: 2000,
              });
              this.getAllVendor();
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
              this.getAllVendor();
            }
          )
        }
      })
    }else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't delete the customer contract when the status is "${obj?.contractStatus}".`,
        showConfirmButton: true,
      });
    }


  }


  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

}

