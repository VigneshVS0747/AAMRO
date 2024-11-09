import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, startWith, switchMap, debounceTime, map } from 'rxjs';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-contract-list',
  templateUrl: './customer-contract-list.component.html',
  styleUrls: ['./customer-contract-list.component.css', '../../../qms.styles.css']
})
export class CustomerContractListComponent {

  selectedCountryId: any;
  countries: any;


  selectedRegionId: any;
  regions: any;

  CustomerContractList: any[] = [];
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
    this.getAllCustomer();
    this.getAllRegion();
    this.getAllContry();
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


  getAllCustomer() {
    this.regionService.GetAllContractCustomer().subscribe((res: any) => {
      console.log(res);
      this.CustomerContractList = res?.result;
      this.CustomerContractList = this.CustomerContractList.map(item => {
        return {
          ...item,
          contractDate: item.contractDate === '1900-01-01T00:00:00' ? null : new Date(item.contractDate),
          validFrom: item.validFrom === '1900-01-01T00:00:00' ? null : new Date(item.validFrom),
          validTo: item.validTo === '1900-01-01T00:00:00' ? null : new Date(item.validTo),
        };
      });
    });
  }

  getAllRegion() {
    this.regionService.getRegions().subscribe(data => {
      this.regions = data;
    });
  }
  getAllContry() {
    this.regionService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }
  add() {
    this.router.navigate(["/qms/transaction/add-contract-customer"]);
  }


  oncancel(obj: any) {

  }

  Edit(obj: any) {
    if(obj?.contractStatus === 'Draft' || obj?.contractStatus === 'Active'){
      let customerContractFFSId = obj.customerContractFFSId;
      this.router.navigate(['/qms/transaction/add-contract-customer', customerContractFFSId]);
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
    let customerContractFFSId = obj.customerContractFFSId;
    this.router.navigate(['/qms/transaction/add-contract-customer/view', customerContractFFSId]);
  }


  Save(obj: any) {

  }

  Update(obj: any) {

  }

  Delete(obj: any,id: any) {
    if(obj?.contractStatus === 'Draft'){
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete the Contract Customer!..",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.regionService.DeleteCustomerContract(id).subscribe((res: any) => {
            console.log(res)
            if (res['message'] == 1) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Deleted successfully",
                showConfirmButton: true,
              }).then((result) => {
                if (result.dismiss !== Swal.DismissReason.timer) {
                  this.getAllCustomer();
                }
              });
              this.getAllCustomer();
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong",
                showConfirmButton: false,
                timer: 2000,
              });
              this.getAllCustomer();
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
              this.getAllCustomer();
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

  copyFrom(id:any){
    this.router.navigate(["/qms/transaction/add-contract-customer"], { queryParams: { contractId: id } });
  }


  //#region Validations
  // RegionOptionValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value?.regionName ? control.value?.regionName : control.value;
  //   var isValid = this.regions?.some((option:any) => option.regionName === value);
  //   return isValid ? null : { invalidOption: true };
  // }
  // CountryOptionValidator(control: AbstractControl): ValidationErrors | null {
  //   if (!control.value) return null;
  //   const value = control.value?.countryName ? control.value?.countryName : control.value;
  //   var isValid = this.countries?.some((option:any) => option.countryName === value);
  //   return isValid ? null : { invalidOption: true };
  // }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

}
