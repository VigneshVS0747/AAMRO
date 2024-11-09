import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { startWith, map, Observable } from 'rxjs';
import { LineitemService } from '../../../../crm/master/lineitemcategory/lineitem.service';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { decimalValidator, trimLeadingZeros } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-add-customer-info',
  templateUrl: './add-customer-info.component.html',
  styleUrls: ['./add-customer-info.component.css']
})
export class AddCustomerInfoComponent implements OnInit {

  filteredLineItemCategory: Observable<any[]>;
  filteredLineItem: Observable<any[]>;
  filteredCalculationParameter: Observable<any[]>;
  filteredCalculationType: Observable<any[]>;
  filteredTaxName: Observable<any[]>;
  lineItemCategory: any[] = [];
  Livestatus = 1;
  LineItemMaster: any[] = [];
  LineItem: any[] = [];
  CalculationParameter: any[] = [];
  CalculationType: any[] = [];
  TaxType: any[] = [];
  taxPer: any;
  calculationType: any;
  calculationTypeReadonly: boolean;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCustomerInfoComponent>,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getlist();
    this.GetLineItemMaster();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.GetAllTaxType();
    this.matFilter();
    console.log(this.data)

    if (this.data?.list) {
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.row;
      }
      if (this.data?.view) {
        this.AddListForm.disable();
      }
      this.calculationTypeReadonly=true;
      this.AddListForm.patchValue({
        LineItemCategory: this.data?.list?.lineItemCategoryName,
        LineItem: this.data?.list?.lineItemName,
        aliasName: this.data?.list?.aliasName,
        calculationParameter: this.data?.list?.calculationParameter,
        calculationType: this.data?.list?.calculationType,
        value: this.data?.list?.unitValue,
        taxName: this.data?.list?.taxCodeName,
        taxPercentage: this.data?.list?.taxPercentage,
        minimumValue: this.data?.list?.minValue,
        remarks: this.data?.list?.remarks,
        active: this.data?.list?.livestatus,
      })
      this.taxPer=this.data?.list?.taxPercentage;
      // this.AddListForm.controls.LineItemCategory.disable();
      // this.AddListForm.controls.LineItem.disable();
      this.getLineItem(this.data?.list?.lineItemCategoryName);

    }
  }

  AddListForm = new FormGroup({
    LineItemCategory: new FormControl('', [Validators.required, this.CategoryOptionValidator.bind(this)]),
    LineItem: new FormControl('', [Validators.required]),
    aliasName: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    calculationParameter: new FormControl('', [Validators.required, this.CalParamOptionValidator.bind(this)]),
    calculationType: new FormControl('', [Validators.required, this.CalTypeOptionValidator.bind(this)]),
    value: new FormControl('', [Validators.required,decimalValidator(14, 2)]),
    taxName: new FormControl('', [Validators.required, this.TaxOptionValidator.bind(this)]),
    taxPercentage: new FormControl({ value: '', disabled: true }),
    minimumValue: new FormControl('0.00'),
    remarks: new FormControl('', [Validators.maxLength(500)]),
    active: new FormControl(true),
  })

  get f() {
    return this.AddListForm.controls;
  }

  trimDecimalField(event: any, controlName: string): void {
    const inputValue = event.target.value;
    const trimmedValue = trimLeadingZeros(inputValue);
    this.AddListForm.get(controlName)?.setValue(trimmedValue, { emitEvent: false });
  }

  // onBlur(controlName: string) {
  //   const control = this.AddListForm.get(controlName);
  
  //   if (!control) return;
  
  //   const value = control.value;
  
  //   if (!value) {
  //     control.setErrors(null);
  //     return;
  //   }
  
  //   control.updateValueAndValidity();
  // }
  
  CategoryOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.lineItemCategory?.some((option: any) => option?.lineItemCategoryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  LineItemOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.LineItem?.some((option: any) => option?.lineItemName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  CalParamOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.CalculationParameter?.some((option: any) => option?.calculationParameter === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CalTypeOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.CalculationType?.some((option: any) => option?.calculationType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  TaxOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.TaxType?.some((option: any) => option?.taxCodeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  matFilter() {
    this.filteredLineItemCategory = this.AddListForm.controls.LineItemCategory.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfilteredLineItemCategory(value || '')),
    );

    this.filteredLineItem = this.AddListForm.controls.LineItem.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfilteredLineItem(value || '')),
    );

    this.filteredCalculationParameter = this.AddListForm.controls.calculationParameter.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCalculationParameter(value || '')),
    );

    this.filteredCalculationType = this.AddListForm.controls.calculationType.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCalculationType(value || '')),
    );
    this.filteredTaxName = this.AddListForm.controls.taxName.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTaxName(value || '')),
    );
  }
  private _filterfilteredLineItemCategory(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.lineItemCategory?.filter((option: any) => option?.lineItemCategoryName.toLowerCase().includes(filterValue));
  }

  private _filterfilteredLineItem(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.LineItem.filter((option: any) => option?.lineItemName.toLowerCase().includes(filterValue));
  }

  private _filterCalculationParameter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CalculationParameter.filter((option: any) => option?.calculationParameter.toLowerCase().includes(filterValue));
  }

  private _filterCalculationType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CalculationType.filter((option: any) => option?.calculationType.toLowerCase().includes(filterValue));
  }

  private _filterTaxName(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.TaxType.filter(option => option?.taxCodeName.toLowerCase().includes(filterValue));
  }

  triggerValidation() {
    Object.keys(this.AddListForm.controls).forEach(field => {
      const control = this.AddListForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  getlist() {
    this.LineitemService.GetAlllineItem(this.Livestatus).subscribe((result: any) => {
      this.lineItemCategory = result;
      this.matFilter();
    });
  }

  getLineItem(event: any) {
    this.LineItem = [];
    let selectedName = event?.option?.value ? event?.option?.value : event;
    let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    this.LineItem = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    if (this.LineItem?.length != 0) {
      this.matFilter();
    } else {
      this.LineItem = [];
    }
  }
  getLine(event: any) {
    this.AddListForm.controls.LineItem.reset();
    this.AddListForm.controls.aliasName.reset();
    this.LineItem = [];
    let selectedName = event?.option?.value ? event?.option?.value : event;
    let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    this.LineItem = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    if (this.LineItem?.length != 0) {
      this.matFilter();
    } else {
      this.LineItem = [];
    }
  }
  
  calculationParameterEvent(event: any){
    debugger
    let selectedValue = event?.option?.value;
   let calculationTValue= this.CalculationParameter.find(x=>x.calculationParameter==selectedValue)
    this.calculationType = calculationTValue.calculationType;

    if (this.calculationType) {
      this.calculationTypeReadonly=true;
      this.AddListForm.controls['calculationType'].setValue(this.calculationType);
    } else {
      this.calculationTypeReadonly=false;
      this.AddListForm.controls['calculationType'].reset()
    
    }
    this.matFilter();

  }
  getLineItemId(event: any) {
    //let selectedValue = event?.option?.value;
    this.matFilter();
  }

  validateLineItem(){
    const control = this.AddListForm.get('LineItem');
    if (control) {
      // Define valid options
      const validOptions = this.LineItem.map(item => item.lineItemName);
      
      if (!validOptions.includes(control.value)) {
        control.setValue(''); 
        control.markAsTouched(); 
      }
    }
  }

  getLineItemChangeEvent(event: any) {
    let selectedValue = event?.option?.value;
    this.AddListForm.controls.aliasName.patchValue(selectedValue)
    this.matFilter();
  }

  getTaxPercentage(event: any) {
    const selectedTaxName = event.option.value;
    const selectedTaxOption = this.TaxType.find(option => option.taxCodeName === selectedTaxName);
    if (selectedTaxOption) {
      const taxPercentage = selectedTaxOption.taxPer;
      this.taxPer=selectedTaxOption.taxPer;
      this.AddListForm.get('taxPercentage')?.patchValue(taxPercentage)
    } else {
      console.error('Selected tax option not found');
    }
    this.matFilter();
  }

  GetLineItemMaster() {
    this.service.GetAllLineItemMaster(this.Livestatus).subscribe({
      next: (res) => {
        this.LineItemMaster = res;
        if (res) {
          this.getLineItem(this.data?.list?.lineItemCategoryName);
        }
      }
    });
  }

  GetAllCalculationParameter() {
    this.commonService.GetAllCalculationParameter().subscribe((res: any) => {
      this.CalculationParameter = res;
      this.matFilter();
    });
  }
  GetAllCalculationType() {
    this.commonService.GetAllCalculationType().subscribe((res: any) => {
      this.CalculationType = res;
      this.matFilter();
    });
  }
  GetAllTaxType() {
    this.regionService.GetAllTaxType().subscribe((res: any) => {
      this.TaxType = res?.result;
      this.matFilter();
    });
  }

  save() {
    debugger
    this.triggerValidation();
    console.log(this.data)
    if (this.AddListForm.invalid) {
      this.AddListForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });

      if (this.AddListForm.controls.LineItem.hasError('invalidOption')) {
        let categoryName = this.AddListForm.controls.LineItemCategory.value;
        this.getLineItem(categoryName);
      }

      return;
    } else {

      //GetLineItem
      if (this.AddListForm.controls.LineItemCategory.value === '') {
        let categoryName = this.AddListForm.controls.LineItemCategory.value;
        if (this.data?.list?.lineItemCategoryName != null && this.data?.list?.lineItemCategoryName != null) {
          this.getLineItem(categoryName);
        }
      }

      if(this.LineItem?.length === 0 || this.LineItem === null || this.LineItem === undefined){
        let categoryName = this.AddListForm.controls.LineItemCategory.value;
        this.getLineItem(categoryName);
      }

      if (this.AddListForm.controls.LineItem.hasError('invalidOption')) {
        let categoryName = this.AddListForm.controls.LineItemCategory.value;
        this.getLineItem(categoryName);
      }

      let payload = {
        "ccffsDetailId": this.data?.selectedCategoryId ? this.data?.selectedCategoryId : 0,
        "customerContractFFSId": +this.data?.customerId ? +this.data?.customerId : 0,
        "aamroLineItemCatId": this.getLineItemCategory(this.AddListForm.controls.LineItemCategory.value),
        "aamroLineItemId": this.getLineItemID(this.AddListForm.controls.LineItem.value),
        "aliasName": this.AddListForm.controls.aliasName.value || null,
        "calculationParameterId": this.getCalculationParameterID(this.AddListForm.controls.calculationParameter.value),
        "calculationTypeId": this.getCalculationTypeID(this.AddListForm.controls.calculationType.value),
        "unitValue": this.AddListForm.controls.value.value || null,
        "taxId": this.getTaxNameId(this.AddListForm.controls.taxName.value),
        "taxPercentage": this.taxPer,
        "minValue": this.AddListForm.controls.minimumValue.value?this.AddListForm.controls.minimumValue.value:0.00,
        "remarks": this.AddListForm.controls.remarks.value || null,
        "livestatus": this.AddListForm.controls.active.value ? this.AddListForm.controls.active.value : false,
        "createdBy": this.data?.createdBy,
        "createdDate": this.data?.createdDate,
        "updatedBy": this.data?.createdBy,
        "updatedDate": new Date(),
        "lineItemCategoryName": this.AddListForm.controls.LineItemCategory.value || null,
        "lineItemName": this.AddListForm.controls.LineItem.value || null,
        "calculationParameter": this.AddListForm.controls.calculationParameter.value || null,
        "calculationType": this.AddListForm.controls.calculationType.value || null,
        "taxCodeName": this.AddListForm.controls.taxName.value || null,
        "rowNumber": this.data?.row ? this.data?.row : 0
      }

      if (this.data?.overallList?.length > 0) {
        let duplicate = this.data?.overallList.some((option: any) => option?.customerContractFFSId === payload?.customerContractFFSId &&
          option?.aamroLineItemId === payload?.aamroLineItemId && option?.rowNumber !== payload?.rowNumber)
        if (duplicate) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Entry",
            confirmButtonColor: "#007dbd",
            text: "Data already exist..!",
            showConfirmButton: true,
            timer: 2000,
          });
          this.AddListForm.controls.LineItem.reset();
          return;
        } else {
          this.dialogRef.close(payload);
        }
      } else {
        this.dialogRef.close(payload);
      }
    }
  }

  Close() {
    this.dialogRef.close()
  }

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  getLineItemCategory(value: any) {
    let customer = this.lineItemCategory.find(option => option?.lineItemCategoryName == value)
    return customer?.lineItemCategoryId;
  }
  getLineItemID(value: any) {
    debugger
    let customer = this.LineItem.find(option => option?.lineItemName == value)
    return customer?.lineItemId;
  }
  getCalculationParameterID(value: any) {
    let customer = this.CalculationParameter.find(option => option?.calculationParameter == value)
    return customer?.calculationParameterId;
  }
  getCalculationTypeID(value: any) {
    let customer = this.CalculationType.find(option => option?.calculationType == value)
    return customer?.calculationTypeId;
  }
  getTaxNameId(value: any) {
    let customer = this.TaxType.find(option => option?.taxCodeName == value)
    return customer?.taxCodeId;
  }

  value(event:any){
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
    this.AddListForm.controls['value'].setValue(input.value);
  }

  minvalue(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') {
        value = '0';
      }
    }
    const regex = /^\d{0,14}(\.\d{0,2})?$/;
    if (!regex.test(value)) {
      value = input.value.slice(0, -1);
    }
    const splitValue = value.split('.');
    if (splitValue[0].length > 14) {
      splitValue[0] = splitValue[0].slice(0, 14);
      value = splitValue.join('.');
    }
  
    input.value = value;
    this.AddListForm.controls['minimumValue'].setValue(input.value);
  }
}
