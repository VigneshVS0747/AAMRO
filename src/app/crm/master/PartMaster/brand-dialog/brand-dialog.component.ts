import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrandDetails } from 'src/app/Models/crm/master/brandDetails';
import { StoragetypeService } from '../../StorageType/storagetype.service';
import { StorageType } from 'src/app/Models/crm/master/storagetype';
import { Observable, firstValueFrom, forkJoin, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PartmasterService } from '../partmaster.service';
import { AuthorizationitemService } from 'src/app/services/ums/authorizationitem.service';
import { Brand } from 'src/app/Models/ums/brand.modal';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';

@Component({
  selector: 'app-brand-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['./brand-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class BrandDialogComponent {
  BrandDetails!: FormGroup;
  Date = new Date();
  BrandDetailsArray: BrandDetails[] = [];
  StorageMaster: StorageType[] = [];
  UOM: any[] = [];
  Brand: Brand[] = [];
  Livestatus = 1;
  filteredStorageType: Observable<StorageType[]> | undefined;
  filteredUom: Observable<any[]> | undefined;
  filteredBrand: Observable<Brand[]> | undefined;
  SelectedStypeId: number;
  selectedStypeName: string;
  SelectedUomId: number;
  SelectedBrandId: number;
  disablefields: boolean;
  hidebutton: boolean;
  hideclose: boolean;
  userId$: string;
  selectedbrandname: string;
  storagetypename: string;

  constructor(private FB: FormBuilder, private service: StoragetypeService,
    private PartService: PartmasterService,
    private Brandservice: AuthorizationitemService,
    private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BrandDialogComponent>) {

    this.fetchDropDownData();
  }

  ngOnInit(): void {
    this.GetUserId();
    this.IntializeForm();
    this.BrandDetailsArray=this.data.Dataarray
    //this.Filters();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }


  EditMode() {

    if(this.data.mode =="Edit"){
      this.SelectedBrandId = this.data.BrandData.brandId;
      this.SelectedStypeId = this.data.BrandData.storageTypeId;
      this.selectedbrandname = this.data.BrandData.brandName,
      this.storagetypename= this.data.BrandData.storageTypeName,
      this.BrandDetails.patchValue({
        partBrandId:this.data.BrandData.partBrandId,
        brandId:this.data.BrandData.brandName,
        length: this.data.BrandData.length,
        breadth: this.data.BrandData.breadth,
        height: this.data.BrandData.height,
        weight: this.data.BrandData.weight,
        storageUOMId:0,
        storageTypeId: this.data.BrandData.storageTypeName,
        livestatus: this.data.BrandData.livestatus,
        createdBy: this.data.BrandData.createdBy,
        createdDate: this.data.BrandData.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date
      });
    }else if(this.data.mode =="view"){
      this.ViewMode();
    }else{
      this.DuplicateIdentifier();
    }
   
  }

  ViewMode() {
    this.disablefields = true;
    this.hidebutton = true;
    this.SelectedBrandId = this.data.BrandData.brandId;
    this.SelectedStypeId = this.data.BrandData.storageTypeId;
    this.selectedbrandname = this.data.BrandData.brandName,
    this.storagetypename= this.data.BrandData.storageTypeName,
    this.BrandDetails.patchValue({
      partBrandId:this.data.BrandData.partBrandId,
      brandId:this.data.BrandData.brandName,
      length: this.data.BrandData.length,
      breadth: this.data.BrandData.breadth,
      height: this.data.BrandData.height,
      weight: this.data.BrandData.weight,
      storageUOMId:0,
      storageTypeId: this.data.BrandData.storageTypeName,
      livestatus: this.data.BrandData.livestatus,
      createdBy: this.data.BrandData.createdBy,
      createdDate: this.data.BrandData.createdDate,
      updatedBy: parseInt(this.userId$),
      updatedDate: this.Date
    });
  }

  DuplicateIdentifier(){
    this.BrandDetails.patchValue({
      partBrandId:this.data.BrandData.partBrandId,
      brandId:"",
      length: this.data.BrandData.length,
      breadth: this.data.BrandData.breadth,
      height: this.data.BrandData.height,
      weight: this.data.BrandData.weight,
      storageUOMId: this.optionSelectedUOMId(this.data.BrandData.storageUOMId),
      storageTypeId: this.optionSelectedSTypeId(this.data.BrandData.storageTypeId),
      livestatus: this.data.BrandData.livestatus,
      createdBy: this.data.BrandData.createdBy,
      createdDate: this.data.BrandData.createdDate,
      updatedBy: parseInt(this.userId$),
      updatedDate: this.Date
    });
  }


  optionSelectedSTypeId(Stype: number): string {
    this.SelectedStypeId = Stype;
    const selectedStype = this.StorageMaster.find(
      (item) => item.storageTypeId === Stype
    );
    return selectedStype ? selectedStype.storageTypeName : "";
  }
  optionSelectedUOMId(UOM: number): string {
    this.SelectedUomId = UOM;
    const selectedUom = this.UOM.find(
      (item) => item.uomId === UOM
    );
    return selectedUom ? selectedUom.uomName : "";
  }
  optionSelectedBrandId(Brand: number): string {
    this.SelectedBrandId = Brand;
    const selectedbrand = this.Brand.find(
      (item) => item.brandId === Brand
    );
    return selectedbrand ? selectedbrand.brandName : "";
  }

  IntializeForm() {
    this.BrandDetails = this.FB.group({
      partBrandId: [0],
      brandId: ["", [Validators.required]],
      length: [null],
      breadth: [null],
      height: [null],
      weight: [null],
     // storageUOMId: ["", [Validators.required]],
      storageTypeId: ["",[Validators.required]],
      createdBy: [parseInt(this.userId$), Validators.required],
      createdDate: [this.Date],
      updatedBy: [parseInt(this.userId$), Validators.required],
      updatedDate: [this.Date],
    });
  }

  AddtoList() {
    if (this.BrandDetails.valid) {

      const BrandDetail: BrandDetails = {
        ...this.BrandDetails.value,
        storageTypeId: this.SelectedStypeId,
        storageUOMId: this.SelectedUomId,
        storageTypeName:this.storagetypename,
        brandName:this.selectedbrandname,
        brandId:this.SelectedBrandId
      }

     

      this.dialogRef.close(BrandDetail);
      this.BrandDetails.reset();

    } else {
      this.BrandDetails.markAllAsTouched();
      this.validateall(this.BrandDetails);
    }
  }
  Close(){
    this.dialogRef.close(this.data.BrandData);
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
  Height()
  {
    debugger
    this.BrandDetails.controls['height'].value;
    const heightControl = this.BrandDetails.get('height');
    if (heightControl && heightControl.value < 0) {
        heightControl.setValue(Math.abs(heightControl.value).toFixed(2)); // Set the absolute value
    }
  }
  Length(){
    debugger
    this.BrandDetails.controls['length'].value;
    const heightControl = this.BrandDetails.get('length');
    if (heightControl && heightControl.value < 0) {
        heightControl.setValue(Math.abs(heightControl.value).toFixed(2)); // Set the absolute value
    }
    
    
  }
  Breadth(){
   this.BrandDetails.controls['breadth'].value;
   const heightControl = this.BrandDetails.get('breadth');
   if (heightControl && heightControl.value < 0) {
       heightControl.setValue(Math.abs(heightControl.value).toFixed(2)); // Set the absolute value
   }
  }

  fetchDropDownData() {
    const storageMaster$ = this.service.GetAllStorageMaster(this.Livestatus);
    const uom$ = this.PartService.GetAllUOM();
    const Brand$ = this.Brandservice.Getbrand();
   
    forkJoin([storageMaster$, uom$, Brand$]).subscribe({
      next: ([storageMasterRes, uomRes, Brandres]) => {
        this.StorageMaster = storageMasterRes;
        this.UOM = uomRes;
        this.Brand = Brandres;
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
    this.filteredStorageType = this.BrandDetails.get(
      "storageTypeId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.storageTypeName)),
      map((name: any) => (name ? this._filter(name) : this.StorageMaster?.slice()))
    );

    this.filteredUom = this.BrandDetails.get(
      "storageUOMId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.uomName)),
      map((name: any) => (name ? this._filterUom(name) : this.UOM?.slice()))
    );

    this.filteredBrand = this.BrandDetails.get(
      "brandId"
    )?.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === 'string' ? value : value?.brandName)),
      map((name: any) => (name ? this._filterBrand(name) : this.Brand?.slice()))
    );
  }

  private _filterUom(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.UOM.filter((invflg) =>
      invflg.uomName.toLowerCase().includes(filterValue)
    );
  }

  private _filter(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.StorageMaster.filter((invflg) =>
      invflg.storageTypeName.toLowerCase().includes(filterValue)
    );

    if (filterresult.length === 0) {
      this.BrandDetails.controls["storageTypeId"].setValue("");
    }

    return filterresult;
  }

  private _filterBrand(value: string): any[] {
    if (value == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    var filterresult = this.Brand.filter((invflg) =>
      invflg.brandName.toLowerCase().includes(filterValue)
    );

    
    if (filterresult.length === 0) {
      this.BrandDetails.controls["brandId"].setValue("");
    }

    return filterresult;
  }

  optionSelectedStype(event: MatAutocompleteSelectedEvent): void {
    const selectedStype = this.StorageMaster.find(
      (Stype) => Stype.storageTypeName === event.option.viewValue
    );
    if (selectedStype) {
      const selectedInvFlgId = selectedStype.storageTypeId;
      this.SelectedStypeId = selectedInvFlgId;
      this.storagetypename = selectedStype.storageTypeName
    }
  }

  optionSelectedUOM(event: MatAutocompleteSelectedEvent): void {
    const selectedUom = this.UOM.find(
      (Stype) => Stype.uomName === event.option.viewValue
    );
    if (selectedUom) {
      const selecteduomId = selectedUom.uomId;
      this.SelectedUomId = selecteduomId;
    }
  }
  optionSelectedBrand(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = this.Brand.find(
      (Stype) => Stype.brandName === event.option.viewValue
    );
    if (selectedBrand) {
      const selectedBrandId = selectedBrand.brandId;
      this.SelectedBrandId = selectedBrandId;
      this.selectedbrandname = selectedBrand.brandName
    }

    const exists = this.BrandDetailsArray.some(item => item.brandId === this.SelectedBrandId);
    if (exists) {
      Swal.fire({
        icon: "error",
        title: "Duplicate",
        text: "Brand already Selected...!",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
      this.BrandDetails.get("brandId")?.setValue("");
    } 
  }
}
