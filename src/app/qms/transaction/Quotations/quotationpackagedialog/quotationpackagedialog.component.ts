import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { Commodity } from 'src/app/crm/master/commodity/commodity.model';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { PackageType } from 'src/app/crm/master/packagetype/packagetype.model';
import { packagetypeService } from 'src/app/crm/master/packagetype/packagetype.service';
import { PackageDialogComponent } from 'src/app/crm/transaction/purchese-quotation/package-dialog/package-dialog.component';
import { PqTransportMode } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation.model';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotationpackagedialog',
  templateUrl: './quotationpackagedialog.component.html',
  styleUrls: ['./quotationpackagedialog.component.css']
})
export class QuotationpackagedialogComponent {
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
  userId$: string;
  modeofTransport: PqTransportMode[];
  air: boolean;
  sea: boolean;
  road: boolean;
  courier: boolean;
  seaportSelected:boolean;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private commodityService: CommodityService,
    private packagetypeServices: packagetypeService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuotationpackagedialogComponent>
  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    debugger
    this.GetUserId();
    this.iniForm()
    this.GetAllPackageType();
    this.getCommodityList();
    this.modeofTransport = this.data.modeofTransport
    this.seaportSelected = this.data.seaportSelected
    this.checkModeofTreansport();
    this.EditMode();

  }
  checkModeofTreansport() {
    this.modeofTransport.forEach(ele => {
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
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  iniForm() {
    this.PackageForm = this.fb.group({
      quotationPackageId: [0],
      quotationId: [0],
      numberPackages: [null],
      packageTypeId: [null, Validators.required],
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
  AddtoList() {
    debugger
    if (this.PackageForm.valid) {
      const packageDetail: PackageDialogComponent = {
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
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
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

  EditMode() {
    debugger
    if (this.data.mode == "Edit") {
      this.PackageForm.patchValue({
        quotationPackageId: this.data.pqData.quotationPackageId,
        quotationId: this.data.pqData.quotationId,
        height: this.data.pqData.height,
        length: this.data.pqData.length,
        breadth: this.data.pqData.breadth,
        cbm: this.data.pqData.cbm,
        cbmPerUnit: this.data.pqData.cbmPerUnit,
        packWeightKg: this.data.pqData.packWeightKg,
        chargePackWtKg: this.data.pqData.chargePackWtKg,
        livestatus: this.data.pqData.livestatus,
        createdBy: this.data.pqData.createdBy,
        createdDate: this.data.pqData.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date
      });
      this.PackageForm.controls['packageTypeId'].setValue(this.data.pqData);
      this.PackageForm.controls['commodityId'].setValue(this.data.pqData);
      this.commodityName = this.data.pqData.commodityName;
      this.packageTypeName = this.data.pqData.packageTypeName;
      this.commodityId = this.data.pqData.commodityId;
      this.packageTypeId = this.data.pqData.packageTypeId;
    } else if (this.data.mode == "View") {
      this.ViewMode();
    }
  }
  ViewMode() {
    this.viewMode = true
    this.PackageForm.disable();
    this.PackageForm.patchValue({
      quotationPackageId: this.data.pqData.quotationPackageId,
      quotationId: this.data.pqData.quotationId,
      height: this.data.pqData.height,
      length: this.data.pqData.length,
      breadth: this.data.pqData.breadth,
      cbm: this.data.pqData.cbm,
      packWeightKg: this.data.pqData.packWeightKg,
      chargePackWtKg: this.data.pqData.chargePackWtKg,
      livestatus: this.data.pqData.livestatus,
      createdBy: this.data.pqData.createdBy,
      createdDate: this.data.pqData.createdDate,
      updatedBy: parseInt(this.userId$),
      updatedDate: this.data
    });
    this.PackageForm.controls['packageTypeId'].setValue(this.data.pqData);
    this.PackageForm.controls['commodityId'].setValue(this.data.pqData);
    this.commodityName = this.data.pqData.commodityName;
    this.packageTypeName = this.data.pqData.packageTypeName;
    this.commodityId = this.data.pqData.commodityId;
    this.packageTypeId = this.data.pqData.packageTypeId;
  }
  Close() {
    this.dialogRef.close();
    this.PackageForm.reset();
  }


  Height(event: any) {
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
  Length(event: any) {
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
    if (!value.includes('.')) {
      value += '.00';
    } else if (value.endsWith('.')) {
      value += '00';
    } else if (value.split('.')[1].length === 1) {
      value += '0';
    }
    input.value = parts.join('.');
    this.PackageForm.controls['length'].setValue(input.value);

    this.PackageForm.controls['length'].value;
    this.Calculate();
  }
  Breadth(event: any) {
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
    if (!value.includes('.')) {
      value += '.00';
    } else if (value.endsWith('.')) {
      value += '00';
    } else if (value.split('.')[1].length === 1) {
      value += '0';
    }
    input.value = parts.join('.');
    this.PackageForm.controls['breadth'].setValue(input.value);

    this.PackageForm.controls['breadth'].value;
    this.Calculate();
  }
  packWeightKg(event: any) {
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
    if (parts[0].length > 8) {
      parts[0] = parts[0].slice(0, 8);
    }
    input.value = parts.join('.');
    this.PackageForm.controls['packWeightKg'].setValue(input.value);
  }


  Calculate() {
    debugger
    const height = this.PackageForm.controls['height'].value || 0.00
    const length = this.PackageForm.controls['length'].value || 0.00
    const breadth = this.PackageForm.controls['breadth'].value || 0.00
    const cbm = height * length * breadth
    this.PackageForm.controls['cbm'].setValue(cbm.toFixed(2));

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
    if (this.sea) {
      const chargePackWtKg = 0.00;
      this.PackageForm.controls['chargePackWtKg'].setValue(chargePackWtKg);
      return;
    }

  }
  //#region Get All Package Type

  GetAllPackageType() {
    this.packagetypeServices.getAllActivePackagetype().subscribe(res => {
      this.packageTypeList = res;
      this.packageTypeFun();
    })
  }
  packageTypeFun() {
    this.filteredPackageTypeListOptions$ = this.PackageForm.controls['packageTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.packageTypeName)),
      map((name: any) => (name ? this.filteredPackageTypeListOptions(name) : this.packageTypeList?.slice()))
    );
  }
  private filteredPackageTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.packageTypeList.filter((option: any) => option.packageTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataPackageType();
  }
  NoDataPackageType(): any {
    this.PackageForm.controls['packageTypeId'].setValue('');
    return this.packageTypeList;
  }
  displayPackageTypeLabelFn(data: any): string {
    return data && data.packageTypeName ? data.packageTypeName : '';
  }
  PackageypeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.packageTypeId = selectedValue.packageTypeId;
    this.packageTypeName = selectedValue.packageTypeName;
  }
  //#endregion

  //#region Commodity
  getCommodityList() {
    this.commodityService.getAllActiveCommodity().subscribe(result => {
      this.CommodityList = result;
      this.CommodityFun();
    });
  }

  CommodityFun() {
    this.filteredCommodityOptions$ = this.PackageForm.controls['commodityId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.commodityName)),
      map((name: any) => (name ? this.filteredCommodityOptions(name) : this.CommodityList?.slice()))
    );
  }
  private filteredCommodityOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CommodityList.filter((option: any) => option.commodityName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCommodity();
  }
  NoDataCommodity(): any {
    this.PackageForm.controls['commodityId'].setValue('');
    return this.CommodityList;
  }
  displayCommodityLabelFn(data: any): string {
    return data && data.commodityName ? data.commodityName : '';
  }
  CommodityListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.commodityId = selectedValue.commodityId;
    this.commodityName = selectedValue.commodityName;
  }
  //#endregion

}
