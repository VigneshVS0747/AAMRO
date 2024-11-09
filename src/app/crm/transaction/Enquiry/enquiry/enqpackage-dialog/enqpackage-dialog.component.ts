import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { PackageType } from 'src/app/crm/master/packagetype/packagetype.model';
import { packagetypeService } from 'src/app/crm/master/packagetype/packagetype.service';
import Swal from 'sweetalert2';
import { PackageDialogComponent } from '../../../purchese-quotation/package-dialog/package-dialog.component';
import { map, startWith } from 'rxjs';
import { forkJoin } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-enqpackage-dialog',
  templateUrl: './enqpackage-dialog.component.html',
  styleUrls: ['./enqpackage-dialog.component.css']
})


export class EnqpackageDialogComponent {
  PackageForm: FormGroup;
  date = new Date();
  viewMode: boolean = false;
  CommodityList: Commodity[];
  commodityId: any;
  packageTypeList: PackageType[];
  packageTypeId: any;
  filteredPackageTypeListOptions$: Observable<any[]>;
  filteredCommodityOptions$: Observable<any[]>;
  commodityName: any;
  packageTypeName: any;
  Date = new Date();
  disablefields: boolean = false;
  userId$: string;
  showchargablepackage: boolean;
  modeoftransport: any[]=[];
  air: boolean;
  sea: boolean;
  road: boolean;
  courier: boolean;
  packagetypeName: string;
  commodity: string;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private commodityService: CommodityService,
    private packagetypeServices: packagetypeService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EnqpackageDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.fetchDropDownData();
  }

  ngOnInit() {
    this.GetUserId();
    this.iniForm()
    this.showchargablepackage = this.data.show;
    this.modeoftransport = this.data.modeoftransport
    this.modeoftransport.forEach(ele => {
      if (ele.transportModeId == 1) {
        this.air = true;
      }
      if (ele.transportModeId == 2) {
        this.sea = true;
      }
      if (ele.transportModeId == 3) {
        this.road = true;
      }
      if (ele.transportModeId == 4) {
        this.courier = true;
      }
    })
  }
  iniForm() {
    this.PackageForm = this.fb.group({
      enquiryPackageId: [0],
      enquiryId: [0],
      packageTypeId: ["", Validators.required],
      commodityId: [null],
      height: [null],
      length: [null],
      breadth: [null],
      cbm: [null],
      packWeightKg: [null],
      chargePackWtKg: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  EditMode() {
    if (this.data.mode == "Edit") {
      this.packageTypeName  = this.data.EnquiryData.packageTypeName;
      this.packageTypeId = this.data.EnquiryData.packageTypeId;
      this.commodityName = this.data.EnquiryData.commodityName;
      this.commodityId  = this.data.EnquiryData.commodityId; 
      this.PackageForm.patchValue({
        enquiryPackageId: this.data.EnquiryData.enquiryPackageId,
        enquiryId: this.data.EnquiryData.enquiryId,
        packageTypeId: this.data.EnquiryData.packageTypeName,
        commodityId: this.data.EnquiryData.commodityName,
        height: this.data.EnquiryData.height,
        length: this.data.EnquiryData.length,
        breadth: this.data.EnquiryData.breadth,
        cbm: this.data.EnquiryData.cbm,
        packWeightKg: this.data.EnquiryData.packWeightKg,
        chargePackWtKg: this.data.EnquiryData.chargePackWtKg,
        livestatus: this.data.EnquiryData.livestatus,
        createdBy: this.data.EnquiryData.createdBy,
        createdDate: this.data.EnquiryData.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date
      });
    } else if (this.data.mode == "view") {
      this.ViewMode();
    }

  }

  ViewMode() {
    this.packageTypeName  = this.data.EnquiryData.packageTypeName;
      this.packageTypeId = this.data.EnquiryData.packageTypeId;
      this.commodityName = this.data.EnquiryData.commodityName;
      this.commodityId  = this.data.EnquiryData.commodityId; 
    this.disablefields = true;
    this.PackageForm.patchValue({
      enquiryPackageId: this.data.EnquiryData.enquiryPackageId,
      enquiryId: this.data.EnquiryData.enquiryId,
      packageTypeId: this.data.EnquiryData.packageTypeName,
      commodityId: this.data.EnquiryData.commodityName,
      height: this.data.EnquiryData.height,
      length: this.data.EnquiryData.length,
      breadth: this.data.EnquiryData.breadth,
      cbm: this.data.EnquiryData.cbm,
      packWeightKg: this.data.EnquiryData.packWeightKg,
      chargePackWtKg: this.data.EnquiryData.chargePackWtKg,
      livestatus: this.data.EnquiryData.livestatus,
      createdBy: this.data.EnquiryData.createdBy,
      createdDate: this.data.EnquiryData.createdDate,
      updatedBy: parseInt(this.userId$),
      updatedDate: this.Date
    });
  }

  Height(event:any) {
    debugger
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
    input.value = parts.join('.');
    this.PackageForm.controls['height'].setValue(input.value);

    this.PackageForm.controls['height'].value;
    this.Calculate()
  }
  Length(event:any) {
    debugger
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
    input.value = parts.join('.');
    this.PackageForm.controls['length'].setValue(input.value);
    this.PackageForm.controls['length'].value;
    
    this.Calculate();

  }
  Breadth(event:any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
    input.value = parts.join('.');
    this.PackageForm.controls['breadth'].setValue(input.value);
    this.PackageForm.controls['breadth'].value;
    
  
    this.Calculate();
  }
  Pkwgt() {
    this.PackageForm.controls['packWeightKg'].value;
    const heightControl = this.PackageForm.get('packWeightKg');
    if (heightControl && heightControl.value < 0) {
      heightControl.setValue(Math.abs(heightControl.value).toFixed(2)); // Set the absolute value
    }
  }
  Calculate()
  {
   const height= this.PackageForm.controls['height'].value || 0
   const length= this.PackageForm.controls['length'].value || 0
   const breadth= this.PackageForm.controls['breadth'].value || 0
   const cbmPerUnit=(height * length * breadth);
   //const chargePackWtKg=(height* length *breadth)/6000
    this.PackageForm.controls['cbm'].setValue(cbmPerUnit.toFixed(2));
    if (this.sea && this.road) {
      const chargePackWtKg = (height * length * breadth) / 10000
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg.toFixed(2));
      return;
    } 
    if (this.air && this.road) {
      const chargePackWtKg = (height * length * breadth) / 10000
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg.toFixed(2));
      return;
    } else if (this.air) {
      const chargePackWtKg = (height * length * breadth) / 6000
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg.toFixed(2));
      return;
    }
    if (this.road) {
      const chargePackWtKg = (height * length * breadth) / 10000
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg.toFixed(2));
      return;
    }
    if (this.courier) {
      const chargePackWtKg = (height * length * breadth) / 5000
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg.toFixed(2));
      return;
    }
    
  }

  OptonSelectedpackage(Ptype: number): string {
    this.packageTypeId = Ptype;
    const selectedStype = this.packageTypeList.find(
      (item) => item.packageTypeId === Ptype
    );
    return selectedStype ? selectedStype.packageTypeName : "";

  }


  OptonSelectedComodity(Ctype: number): string {
    this.commodityId = Ctype;
    const selectedStype = this.CommodityList.find(
      (item) => item.commodityId === Ctype
    );
    return selectedStype ? selectedStype.commodityName : "";

  }



  AddtoList() {
    if (this.PackageForm.valid) {
      const packageDetail: EnqpackageDialogComponent = {
        ...this.PackageForm.value,
      }
      packageDetail.commodityId = this.commodityId;
      packageDetail.packageTypeId = this.packageTypeId;
      packageDetail.commodityName = this.commodityName;
      packageDetail.packageTypeName = this.packageTypeName;

      this.dialogRef.close(packageDetail);
      this.PackageForm.reset();
    }
    else {
      this.PackageForm.markAllAsTouched();
      this.validateall(this.PackageForm);
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

  Close() {
    this.dialogRef.close(this.data.EnquiryData);
    this.PackageForm.reset();
  }



  fetchDropDownData() {

    const Packagetype$ = this.packagetypeServices.getAllActivePackagetype();
    const Comodity$ = this.commodityService.getAllActiveCommodity()


    forkJoin([Packagetype$, Comodity$,]).subscribe({
      next: ([Packagetype, Comodity]) => {
        this.packageTypeList = Packagetype
        this.CommodityList = Comodity

        this.Filters();
        this.EditMode();
        // Call EditMode once after both requests complete
      },
      error: (error) => {
        console.log("error==>", error);
      }
    });
  }

  Filters() {
    this.filteredPackageTypeListOptions$ = this.PackageForm.controls['packageTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.packageTypeName)),
      map((name: any) => (name ? this.filteredPackageTypeListOptions(name) : this.packageTypeList?.slice()))
    );

    this.filteredCommodityOptions$ = this.PackageForm.controls['commodityId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.commodityName)),
      map((name: any) => (name ? this.filteredCommodityOptions(name) : this.CommodityList?.slice()))
    );
  }


  //#endregion Get All Package Type

  private filteredPackageTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.packageTypeList.filter((option: any) => option.packageTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataPackageType();
  }
  NoDataPackageType(): any {
    this.PackageForm.controls['packageTypeId'].setValue('');
    return this.packageTypeList;
  }



  PackageypeSelectedoption(event: MatAutocompleteSelectedEvent): void {
    const selectedpackage = this.packageTypeList.find(
      (Stype) => Stype.packageTypeName === event.option.viewValue
    );
    if (selectedpackage) {
      const selectedpackageId = selectedpackage.packageTypeId;
      this.packageTypeId = selectedpackageId;
      this.packageTypeName = selectedpackage.packageTypeName;
    }
  }
  //#endregion

  //#region Commodity

  private filteredCommodityOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CommodityList.filter((option: any) => option.commodityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCommodity();
  }
  NoDataCommodity(): any {
    this.PackageForm.controls['commodityId'].setValue('');
    return this.CommodityList;
  }


  CommodityListSelectedoption(event: MatAutocompleteSelectedEvent): void {
    const selectedcomodity = this.CommodityList.find(
      (Stype) => Stype.commodityName === event.option.viewValue
    );
    if (selectedcomodity) {
      const selectedComodityId = selectedcomodity.commodityId;
      this.commodityId = selectedComodityId;
      this.commodityName = selectedcomodity.commodityName
    }
  }
  //#endregion
}
