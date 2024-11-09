import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { CalculationParameters, CalculationTypes } from 'src/app/Models/crm/master/Dropdowns';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import { CommonService } from 'src/app/services/common.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-price-dialog',
  templateUrl: './price-dialog.component.html',
  styleUrls: ['./price-dialog.component.css','../../../../ums/ums.styles.css']
})
export class PriceDialogComponent {
  priceForm: FormGroup;
  date = new Date();
  viewMode: boolean = false;
  LiveStatus = 1;
  lineItemDatalist: LineItemMaster[];
  filteredlineitemOptions$: Observable<any[]>;
  lineItemId: any;
  lineItemName: any;
  filteredTaxCodeOptions$: Observable<any[]>;
  taxcodelist: TaxCode[];
  taxCodeName: any;
  taxId: any;
  taxPer: any;
  filteredLineItemCtgOptions$: Observable<any[]>;
  lineItemCtgDatalist: lineitem[];
  lineItemCategoryName: any;
  categoryId: any;
  CalculationParlist: CalculationParameters[];
  filteredCalculationParOptions$: Observable<any[]>;
  calculationParameterId: any;
  calculationParameter: any;
  CalculationTyplist: CalculationTypes[];
  filteredCalculationTypeOptions$: Observable<any[]>;
  calculationTypeId: any;
  calculationType: any;
  userId$: string;
  pqMapping: any;
  calculationTypeReadonly: boolean;
  minValue: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private lineIetmService: LineitemmasterService,
    private LineitemCtgService: LineitemService,
    private commonService: CommonService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PriceDialogComponent>
  ) { dialogRef.disableClose = true; }

  ngOnInit() {
    this.GetUserId();
    this.iniForm();
    //this.getLineItem();
    this.getTaxCode();
    this.getLineItemCtg();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.EditMode()
  }
  GetUserId(){
    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
  }
  iniForm() {
    this.priceForm = this.fb.group({
      pqPriceId: [0],
      purchaseQuoteId: [0],
      categoryId: [null,Validators.required],
      vendorLineItemDesc: [null,Validators.required],
      calculationParameterId: [null,Validators.required],
      calculationTypeId: [null,Validators.required],
      value: [null,Validators.required],
      taxId: [null],
      taxPer: [null],
      minValue: [null],
      remarks: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
  }
  AddtoList() {
    if (this.priceForm.valid) {
      const packageDetail: PriceDialogComponent = {
        ...this.priceForm.value,
      }
      this.minValue=this.priceForm.controls['minValue'].value;

      packageDetail.lineItemCategoryName=this.lineItemCategoryName;
      packageDetail.calculationParameter=this.calculationParameter;
      packageDetail.calculationType=this.calculationType;
      packageDetail.taxCodeName=this.taxCodeName;
      packageDetail.pqMapping=this.pqMapping;
      packageDetail.taxId=this.taxId;
      packageDetail.categoryId=this.categoryId;
      packageDetail.calculationParameterId=this.calculationParameterId;
      packageDetail.calculationTypeId=this.calculationTypeId;
      packageDetail.minValue=this.minValue?this.minValue:0

      this.dialogRef.close(packageDetail);
      this.priceForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.priceForm.markAllAsTouched();
      this.validateall(this.priceForm);
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
  EditMode(){
    if (this.data.mode == 'Edit') {
      this.priceForm.patchValue(this.data.priceDate);
      this.categoryId = this.data.priceDate.categoryId;
      //this.lineItemId = this.data.priceDate.lineItemId;
      this.calculationParameterId = this.data.priceDate.calculationParameterId;
      this.calculationTypeId = this.data.priceDate.calculationTypeId;
      this.taxId = this.data.priceDate.taxId;
      this.data.updatedBy=parseInt(this.userId$)
      this.lineItemCategoryName = this.data.priceDate.lineItemCategoryName;
      this.pqMapping=this.data.priceDate.pqMapping;
      //this.lineItemName = this.data.priceDate.lineItemName;
      this.calculationParameter = this.data.priceDate.calculationParameter;
      this.calculationType = this.data.priceDate.calculationType;
      this.taxCodeName = this.data.priceDate.taxCodeName;
      this.minValue=this.data.priceDate.minValue;
      this.priceForm.controls['categoryId'].setValue(this.data.priceDate);
      //this.priceForm.controls['lineItemId'].setValue(this.data.priceDate);
      this.priceForm.controls['calculationParameterId'].setValue(this.data.priceDate);
      this.priceForm.controls['calculationTypeId'].setValue(this.data.priceDate);
      this.priceForm.controls['taxId'].setValue(this.data.priceDate);
      this.calculationTypeReadonly=true;
    }
    else if (this.data.mode == 'View') {
      this.viewMode=true;
      this.priceForm.disable();
      this.priceForm.patchValue(this.data.priceDate);
      this.categoryId = this.data.priceDate.categoryId;
      //this.lineItemId = this.data.priceDate.lineItemId;
      this.calculationParameterId = this.data.priceDate.calculationParameterId;
      this.calculationTypeId = this.data.priceDate.calculationTypeId;
      this.taxId = this.data.priceDate.taxId;
      this.pqMapping=this.data.priceDate.pqMapping;

      this.lineItemCategoryName = this.data.priceDate.lineItemCategoryName;
      //this.lineItemName = this.data.priceDate.lineItemName;
      this.calculationParameter = this.data.priceDate.calculationParameter;
      this.calculationType = this.data.priceDate.calculationType;
      this.taxCodeName = this.data.priceDate.taxCodeName;
      this.minValue=this.data.priceDate.minValue;

      this.priceForm.controls['categoryId'].setValue(this.data.priceDate);
      //this.priceForm.controls['lineItemId'].setValue(this.data.priceDate);
      this.priceForm.controls['calculationParameterId'].setValue(this.data.priceDate);
      this.priceForm.controls['calculationTypeId'].setValue(this.data.priceDate);
      this.priceForm.controls['taxId'].setValue(this.data.priceDate);
    }
    
  }

  Close() {
    this.dialogRef.close();
  }
  value(event:any){
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,8}(\.\d{0,2})?$/;
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
    this.priceForm.controls['value'].setValue(input.value);
  }
  minValues(event:any){
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,8}(\.\d{0,2})?$/;
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
    this.priceForm.controls['minValue'].setValue(input.value);
  }

  //#region select Line Item ctg 
  getLineItemCtg() {
    this.LineitemCtgService.GetAlllineItem(this.LiveStatus).subscribe(result => {
      this.lineItemCtgDatalist = result;
      this.LineItemCtgFun()
    });
  }
  LineItemCtgFun() {
    this.filteredLineItemCtgOptions$ = this.priceForm.controls['categoryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemCategoryName)),
      map((name: any) => (name ? this.filteredLineItemCtgOptions(name) : this.lineItemCtgDatalist?.slice()))
    );
  }
  private filteredLineItemCtgOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.lineItemCtgDatalist.filter((option: any) => option.lineItemCategoryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataLineItemCtg();
  }
  NoDataLineItemCtg(): any {
    this.priceForm.controls['categoryId'].setValue('');
    return this.lineItemCtgDatalist;
  }
  displayLineItemCtgLabelFn(data: any): string {
    return data && data.lineItemCategoryName ? data.lineItemCategoryName : '';
  }

  LineItemCtgSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.categoryId = selectedValue.lineItemCategoryId;
    this.lineItemCategoryName = selectedValue.lineItemCategoryName;
  }
  //#endregion

  //#region select Line Item region
  getLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe(result => {
      this.lineItemDatalist = result;
      console.log(this.lineItemDatalist)
      this.lineitemFun()
    });
  }
  lineitemFun() {
    this.filteredlineitemOptions$ = this.priceForm.controls['lineItemId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemName)),
      map((name: any) => (name ? this.filteredlineitemOptions(name) : this.lineItemDatalist?.slice()))
    );
  }
  private filteredlineitemOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.lineItemDatalist.filter((option: any) => option.lineItemName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatalineitem();
  }
  NoDatalineitem(): any {
    this.priceForm.controls['lineItemId'].setValue('');
    return this.lineItemDatalist;
  }
  displaylineitemLabelFn(data: any): string {
    return data && data.lineItemName ? data.lineItemName : '';
  }

  lineItemDatalistSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.lineItemId = selectedValue.lineItemId;
    this.lineItemName = selectedValue.lineItemName;
  }
  //#endregion

  //#region select taxcode
  getTaxCode() {
    this.commonService.GetAllActiveTaxCodes().subscribe(result => {
      this.taxcodelist = result;
      this.TaxCodeFun()
    });
  }
  TaxCodeFun() {
    this.filteredTaxCodeOptions$ = this.priceForm.controls['taxId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
      map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
    );
  }
  private filteredTaxCodeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
    this.priceForm.controls['taxPer'].setValue(null);
    this.taxPer=null;
    return results.length ? results : this.NoDataTaxCode();
  }
  NoDataTaxCode(): any {
    this.priceForm.controls['taxId'].setValue(null);
    return this.taxcodelist;
  }
  displayTaxCodeLabelFn(data: any): string {
    return data && data.taxCodeName ? data.taxCodeName : '';
  }

  TaxCodeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.taxId = selectedValue.taxCodeId;
    this.taxCodeName = selectedValue.taxCodeName;
    this.taxPer = selectedValue.taxPer;
    this.priceForm.controls['taxPer'].setValue(this.taxPer);
  }

  emptytaxper(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.priceForm.controls['taxPer'].setValue(null);
      this.taxPer=null;
      this.taxCodeName='';
      this.taxId=null;
    }
  }

  //#endregion

  //#region select CalculationParameter
  GetAllCalculationParameter() {
    this.commonService.GetAllCalculationParameter().subscribe(result => {
      this.CalculationParlist = result;
      this.CalculationParFun()
    });
  }
  CalculationParFun() {
    this.filteredCalculationParOptions$ = this.priceForm.controls['calculationParameterId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.calculationParameter)),
      map((name: any) => (name ? this.filteredCalculationParOptions(name) : this.CalculationParlist?.slice()))
    );
  }
  private filteredCalculationParOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CalculationParlist.filter((option: any) => option.calculationParameter.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCalculationPar();
  }
  NoDataCalculationPar(): any {
    this.priceForm.controls['calculationParameterId'].setValue('');
    return this.CalculationParlist;
  }
  displayculationParLabelFn(data: any): string {
    return data && data.calculationParameter ? data.calculationParameter : '';
  }
  CalculationParSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.calculationParameterId = selectedValue.calculationParameterId;
    this.calculationParameter = selectedValue.calculationParameter;

    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;

    if (this.calculationType) {
      this.calculationTypeReadonly=true;
      this.priceForm.controls['calculationTypeId'].setValue(selectedValue);
    } else {
      this.calculationTypeReadonly=false;
      this.priceForm.controls['calculationTypeId'].reset()
      this.calculationTypeId=null;
      this.calculationType='';
    }
  }
  //#endregion

  //#region select culationType
  GetAllCalculationType() {
    this.commonService.GetAllCalculationType().subscribe(result => {
      this.CalculationTyplist = result;
      this.CalculationTypeFun()
      console.log(this.CalculationTyplist)
    });
  }
  CalculationTypeFun() {
    this.filteredCalculationTypeOptions$ = this.priceForm.controls['calculationTypeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.calculationType)),
      map((name: any) => (name ? this.filteredCalculationTypeOptions(name) : this.CalculationTyplist?.slice()))
    );
  }
  private filteredCalculationTypeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CalculationTyplist.filter((option: any) => option.calculationType.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCalculationType();
  }
  NoDataCalculationType(): any {
    this.priceForm.controls['calculationTypeId'].setValue('');
    return this.CalculationTyplist;
  }
  displayculationTypeLabelFn(data: any): string {
    return data && data.calculationType ? data.calculationType : '';
  }
  CalculationTypeSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
  }
  //#endregion
}
