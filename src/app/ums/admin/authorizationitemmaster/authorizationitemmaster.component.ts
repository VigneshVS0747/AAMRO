import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";

import { AuthorizationitemService } from "src/app/services/ums/authorizationitem.service";
import { Branch } from "../../masters/branch/branch.model";
import { jobtype } from "src/app/Models/ums/Jobtype.modal";
import { Brand } from "src/app/Models/ums/brand.modal";
import { customer } from "src/app/Models/ums/customer.modal";
import { Observable, catchError, map, of, startWith } from "rxjs";

import { MatSelectChange } from "@angular/material/select";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";

@Component({
  selector: "app-authorizationitemmaster",
  templateUrl: "./authorizationitemmaster.component.html",
  styleUrls: [
    "./authorizationitemmaster.component.css",
    "../../ums.styles.css",
  ],
})
export class AuthorizationitemmasterComponent implements OnInit {
  Authorizationitem!: FormGroup;
  newRow: Branch[] = [];
  jobtype: jobtype[] = [];
  Brand: Brand[] = [];
  newcust: customer[] = [];
  selectedBrandId!: number;
  SelectedCustomerId!: number;
  disablefields: boolean = false;
  selectedBranchId!: number;
  selectedJobTypeId!: number;
  Showsave!: boolean;
  ShowUpdate!: boolean;
  ShowReset!: boolean;
  titile!: string;
  userId$: string;
  filteredWarehouse: Observable<Branch[]> | undefined;
  filteredCustomers: Observable<customer[]> | undefined;
  filteredBrand: Observable<Brand[]> | undefined;
  filteredJobType: Observable<jobtype[]> | undefined;

  constructor(
    private router: Router,
    private FB: FormBuilder,
    private service: AuthorizationitemService,
    private route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>
  ) {
    this.service.Getbranch().subscribe((result) => {
      this.newRow = result;
      this.Filters();
    });

    this.service.Getcustomer().subscribe((result) => {
      this.newcust = result;
      this.Filters();
    });

    this.service.Getjobtype().subscribe((resp) => {
      this.jobtype = resp;
      this.Filters();
    });

    this.service.Getbrand().subscribe((resp) => {
      this.Brand = resp;
      this.Filters();
    });
  }

  ngOnInit(): void {
    this.GetUserId();
    this.titile = "New Authorization Item";
    this.ShowUpdate = false;
    this.Showsave = true;
    this.ShowReset = true;
    this.Authorizationitem = this.FB.group({
      authorizationItemId: [0],
      authorizationItemName: ["", [Validators.required]],
      warehouseId: ['', [Validators.required, this.BranchOptionValidator.bind(this)]],
      customerId: ["", [Validators.required, this.CustomerOptionValidator.bind(this)]],
      brandId: ["", [Validators.required, this.BrandOptionValidator.bind(this)]],
      jobTypeId: ["", [Validators.required,this.JobTypeOptionValidator.bind(this)]],
      livestatus: [true, Validators.required],
    });
    var Path1 = this.router.url;
    if (Path1 == "/ums/master/authitem/edit/" + this.route.snapshot.params["id"]) {
      this.titile = "Update Authorization Item";
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.disablefields = false;
      this.service
        .GetAuthorizationitembyId(this.route.snapshot.params["id"])
        .subscribe((result) => {
          this.selectedBranchId = result.warehouseId,
            this.SelectedCustomerId = result.customerId,
            this.selectedJobTypeId = result.jobTypeId,
            this.selectedBrandId = result.brandId,
            console.log("result--------------------------->", result);
          this.Authorizationitem.patchValue({
            authorizationItemId: result.authorizationItemID,
            authorizationItemName: result.authorizationItemName,
            warehouseId: result.warehouseName,
            customerId: result.customerName,
            brandId: result.brandName,
            jobTypeId: result.jobtypeName,
            livestatus: result.livestatus,
            createdBy: result.createdBy,
            updatedBy: result.updatedBy
          });
        });
    }
    var Path2 = this.router.url;
    if (Path2 == "/ums/master/authitem/view/" + this.route.snapshot.params["id"]) {
      this.titile = "View Authorization Item";
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;
      this.disablefields = true;
      this.Authorizationitem.get('livestatus')?.disable();
      this.service
        .GetAuthorizationitembyId(this.route.snapshot.params["id"])
        .subscribe((result) => {
          this.selectedBranchId = result.warehouseId,
            this.SelectedCustomerId = result.customerId,
            this.selectedJobTypeId = result.jobTypeId,
            this.selectedBrandId = result.brandId,
            this.Authorizationitem.patchValue({
              authorizationItemId: result.authorizationItemID,
              authorizationItemName: result.authorizationItemName,
              warehouseId: result.warehouseName,
              customerId: result.customerName,
              brandId: result.brandName,
              jobTypeId: result.jobtypeName,
              livestatus: result.livestatus,
            });
        });
    }
    
  }

  Filters(){
    this.filteredCustomers = this.Authorizationitem.get(
      "customerId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    this.filteredBrand = this.Authorizationitem.get(
      "brandId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterbrand(value))
    );
    this.filteredWarehouse = this.Authorizationitem.get(
      "warehouseId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterWarehouse(value))
    );
    this.filteredJobType = this.Authorizationitem.get(
      "jobTypeId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterJobType(value))
    );
  }

  GetUserId() {

    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  authfrombuilder() {
    this.Authorizationitem = this.FB.group({
      authorizationItemId: [0],
      authorizationItemName: ["", [Validators.required]],
      warehouseId: ["", Validators.required],
      customerId: ["", Validators.required],
      brandId: ["", Validators.required],
      jobTypeId: ["", Validators.required],
      livestatus: [true, Validators.required],
    });
  }
  optionSelectedcustomerWithCustomerId(customerName: string): void {
    const selectedCustomer = this.newcust.find(
      (customer) => customer.customerName === customerName
    );
    if (selectedCustomer) {
      const selectedCustomerId = selectedCustomer.customerId;
      this.SelectedCustomerId = selectedCustomerId;
    }
  }
  optionSelectedBrandWithBrandId(Brandname: string): void {
    const selectedBrand = this.Brand.find(
      (Brand) => Brand.brandName === Brandname
    );
    if (selectedBrand) {
      const selectedBrandId = selectedBrand.brandId;
      this.selectedBrandId = selectedBrandId;
    }
  }
  optionSelectedwarehouseWithWarehouseId(Warehousename: string): void {
    const selectedWarehouse = this.newRow.find(
      (warehouse) => warehouse.branchName === Warehousename
    );
    if (selectedWarehouse) {
      const selectedawarehouseId = selectedWarehouse.branchId;
      this.selectedBranchId = selectedawarehouseId;
    }
  }
  optionSelectedJobtypeWithjobtypeId(Jobtypename: string): void {
    const selectedjobtype = this.jobtype.find(
      (jobtype) => jobtype.jobTypeName === Jobtypename
    );
    if (selectedjobtype) {
      const selectedjobtypeId = selectedjobtype.jobTypeId;
      this.selectedJobTypeId = selectedjobtypeId;
    }
  }

  private _filter(value: string): any[] {
    const filterValue = value?.toLowerCase();

    if (filterValue === '%') {
      return this.newcust;
    }
    var filterresult = this.newcust.filter((customer) =>
      customer.customerName.toLowerCase().includes(filterValue)
    );

    
    if (filterresult.length === 0) {
      this.Authorizationitem.controls["customerId"].setValue("");
    }

    return filterresult;
  }

  private _filterbrand(value: string): any[] {
    const filterValue = value?.toLowerCase();

    if (filterValue === '%') {
      return this.Brand;
    }
    var filterresult = this.Brand.filter((brand) =>
      brand.brandName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.Authorizationitem.controls["brandId"].setValue("");
    }

    return filterresult;
  }
  private _filterWarehouse(value: string): any[] {
    const filterValue = value?.toLowerCase();
    if (filterValue === '%') {
      return this.newRow;
    }
    var filterresult = this.newRow.filter(
      branch => branch.branchName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Authorizationitem.controls["warehouseId"].setValue("");
    }

    return filterresult;
  }
  private _filterJobType(value: string): any[] {
    const filterValue = value?.toLowerCase();
    if (filterValue === '%') {
      return this.jobtype;
    }
    var filterresult = this.jobtype.filter((Jobtype) =>
      Jobtype.jobTypeName.toLowerCase().includes(filterValue)
    );
    if (filterresult.length === 0) {
      this.Authorizationitem.controls["jobTypeId"].setValue("");
    }

    return filterresult;
  }
  optionSelectedwarehouse(event: MatAutocompleteSelectedEvent): void {
    // this.Authorizationitem.controls['warehouseId'].disable();
    const selectedWarehouse = this.newRow.find(
      (branch) => branch.branchName === event.option.viewValue
    );
    if (selectedWarehouse) {
      const selectedWarehouseId = selectedWarehouse.branchId;
      this.selectedBranchId = selectedWarehouseId;
    }
  }
  optionSelectedcustomer(event: MatAutocompleteSelectedEvent): void {
    const selectedCustomer = this.newcust.find(
      (customer) => customer.customerName === event.option.viewValue
    );
    if (selectedCustomer) {
      const selectedCustomerId = selectedCustomer.customerId;
      this.SelectedCustomerId = selectedCustomerId;
    }
  }
  optionSelectedBrand(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = this.Brand.find(
      (Brand) => Brand.brandName === event.option.viewValue
    );
    if (selectedBrand) {
      const selectedBrandId = selectedBrand.brandId;
      this.selectedBrandId = selectedBrandId;
    }
  }
  optionSelectedJobType(event: MatAutocompleteSelectedEvent): void {
    const selectedJobtype = this.jobtype.find(
      (jobtype) => jobtype.jobTypeName === event.option.viewValue
    );
    if (selectedJobtype) {
      const selectedJobTypeId = selectedJobtype.jobTypeId;
      this.selectedJobTypeId = selectedJobTypeId;
    }
  }
  Savedata() {
    const dataToSend = {
      ...this.Authorizationitem.value,
      customerId: this.SelectedCustomerId,
      brandId: this.selectedBrandId,
      warehouseId: this.selectedBranchId,
      jobTypeId: this.selectedJobTypeId,
      createdby: parseInt(this.userId$),
      updatedby: parseInt(this.userId$),
    };
    console.log("dataToSend", dataToSend);

    if (this.Authorizationitem.valid) {
      this.service
        .createAuthoriazationitem(dataToSend)
        .pipe(
          catchError((error) => {
            if (error.error.message == "DUPLICATE") {
              this.Authorizationitem.reset();
              Swal.fire({
                icon: "info",
                title: "Info",
                text: "The Compination are Already Exists!",
                showConfirmButton: false,
                timer: 2000,
              });
              this.filters();
            } else {
              this.Authorizationitem.reset();
              Swal.fire({
                icon: "info",
                title: "Info",
                text: "Authorization Item already exists!",
                showConfirmButton: false,
                timer: 2000,
              });

              this.filters();
            }
            this.Authorizationitem.reset();
            this.authfrombuilder();
            throw error;

          })
        )
        .subscribe((response) => {
          if (response.message == "SUCCESS") {
            this.Authorizationitem.reset();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added Sucessfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.returntoList();
          }
        });
    } else {
      this.filteredCustomers = this.Authorizationitem.get(
        "customerId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );

      this.filteredBrand = this.Authorizationitem.get(
        "brandId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterbrand(value))
      );
      this.filteredWarehouse = this.Authorizationitem.get(
        "warehouseId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterWarehouse(value))
      );
      this.filteredJobType = this.Authorizationitem.get(
        "jobTypeId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterJobType(value))
      );
      this.Authorizationitem.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.validateall(this.Authorizationitem);
    }
  }
  Updatedata() {
    const dataToSend = {
      ...this.Authorizationitem.value,
      customerId: this.SelectedCustomerId,
      brandId: this.selectedBrandId,
      warehouseId: this.selectedBranchId,
      jobTypeId: this.selectedJobTypeId,
      updatedby: parseInt(this.userId$),
    };
    console.log("Update", dataToSend);

    if (this.Authorizationitem.valid) {
      this.service
        .UpdateAuthorizationitem(dataToSend)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Authorization Item is already exists!!",
              showConfirmButton: false,
              timer: 2000,
            });
            this.filters();
            this.Authorizationitem.reset();
            throw error;
          })
        )
        .subscribe((response) => {
          this.Authorizationitem.reset();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated Sucessfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.returntoList();
        });
    } else {
      this.filteredCustomers = this.Authorizationitem.get(
        "customerId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );

      this.filteredBrand = this.Authorizationitem.get(
        "brandId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterbrand(value))
      );
      this.filteredWarehouse = this.Authorizationitem.get(
        "warehouseId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterWarehouse(value))
      );
      this.filteredJobType = this.Authorizationitem.get(
        "jobTypeId"
      )?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterJobType(value))
      );
      this.Authorizationitem.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.validateall(this.Authorizationitem);
    }
  }

  private validateall(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateall(control);
      }
    });
  }
  reset() {
    var Path1 = this.router.url;
    if (Path1 == "/ums/master/authitem/edit/" + this.route.snapshot.params["id"]) {
      this.titile = "Update Authorization Item";
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
      this.disablefields = false;
      this.service
        .GetAuthorizationitembyId(this.route.snapshot.params["id"])
        .subscribe((result) => {
          console.log("result--------------------------->", result);
          this.Authorizationitem.patchValue({
            authorizationItemId: result.authorizationItemID,
            authorizationItemName: result.authorizationItemName,
            warehouseId: result.warehouseName,
            customerId: result.customerName,
            brandId: result.brandName,
            jobTypeId: result.jobtypeName,
            livestatus: result.livestatus,
            createdBy: result.createdBy,
            updatedBy: result.updatedBy
          });
          this.optionSelectedcustomerWithCustomerId(result.customerName);
          this.optionSelectedwarehouseWithWarehouseId(result.warehouseName);
          this.optionSelectedBrandWithBrandId(result.brandName);
          this.optionSelectedJobtypeWithjobtypeId(result.jobtypeName);
        });
    } else {
      //this.Authorizationitem.reset();

      this.Authorizationitem?.get('authorizationItemName')?.reset();
      this.Authorizationitem?.get('warehouseId')?.reset();
      this.Authorizationitem?.get('customerId')?.reset();
      this.Authorizationitem?.get('brandId')?.reset();
      this.Authorizationitem?.get('jobTypeId')?.reset();

      // this.Authorizationitem.controls['authorizationItemName'].setErrors(null);
      // this.Authorizationitem.controls['warehouseId'].setErrors(null);
      // this.Authorizationitem.controls['customerId'].setErrors(null);
      // this.Authorizationitem.controls['brandId'].setErrors(null);
      // this.Authorizationitem.controls['jobTypeId'].setErrors(null);

      this.filteredWarehouse = of([]);
      this.filteredCustomers = of([]);
      this.filteredJobType = of([]);
      this.filteredWarehouse = of([]);

      this.getdropdown();
      this.authfrombuilder();


      //For Custome validation
      this.Authorizationitem.controls['warehouseId'].setValidators([Validators.required, this.BranchOptionValidator.bind(this)]);
      this.Authorizationitem.controls['warehouseId'].updateValueAndValidity();
      this.Authorizationitem.controls['customerId'].setValidators([Validators.required, this.CustomerOptionValidator.bind(this)]);
      this.Authorizationitem.controls['customerId'].updateValueAndValidity();
      this.Authorizationitem.controls['brandId'].setValidators([Validators.required, this.BrandOptionValidator.bind(this)]);
      this.Authorizationitem.controls['brandId'].updateValueAndValidity();
      this.Authorizationitem.controls['jobTypeId'].setValidators([Validators.required, this.JobTypeOptionValidator.bind(this)]);
      this.Authorizationitem.controls['jobTypeId'].updateValueAndValidity();
    }

  }
  filters() {
    this.filteredCustomers = this.Authorizationitem.get(
      "customerId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    this.filteredBrand = this.Authorizationitem.get(
      "brandId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterbrand(value))
    );
    this.filteredWarehouse = this.Authorizationitem.get(
      "warehouseId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterWarehouse(value))
    );
    this.filteredJobType = this.Authorizationitem.get(
      "jobTypeId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterJobType(value))
    );
    //this.Authorizationitem.markAllAsTouched();
    //this.validateall(this.Authorizationitem);
  }

  returntoList() {
    this.router.navigate(["ums/master/authitem"])
  }

  getdropdown() {
    this.service.Getbranch().subscribe((result) => {
      this.newRow = result;
      this.filters();
    });

    this.service.Getcustomer().subscribe((result) => {
      this.newcust = result;
      this.filters();
    });

    this.service.Getjobtype().subscribe((resp) => {
      this.jobtype = resp;
      this.filters();
    });

    this.service.Getbrand().subscribe((resp) => {
      this.Brand = resp;
      this.filters();
    });

  }


  BranchOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = this.newRow.some(option => option.branchName === value);
    return isValid ? null : { invalidOption: true };
  }
  CustomerOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = this.newcust.some(option => option.customerName === value);
    return isValid ? null : { invalidOption: true };
  }
  BrandOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.Brand?.some(option => option.brandName === value);
    return isValid ? null : { invalidOption: true };
  }
  JobTypeOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.jobtype?.some(option => option.jobTypeName === value);
    return isValid ? null : { invalidOption: true };
  }

}
