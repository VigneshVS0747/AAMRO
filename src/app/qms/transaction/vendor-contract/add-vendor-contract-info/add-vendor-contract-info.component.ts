import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddCustomerInfoComponent } from '../../customer-contract/add-customer-info/add-customer-info.component';
import { LineitemService } from '../../../../crm/master/lineitemcategory/lineitem.service';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { decimalValidator } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-vendor-contract-info',
  templateUrl: './add-vendor-contract-info.component.html',
  styleUrls: ['./add-vendor-contract-info.component.css']
})
export class AddVendorContractInfoComponent {

  filteredLineItemCategory: Observable<any[]>;
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
  calculationType: any;
  calculationTypeReadonly: boolean;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddVendorContractInfoComponent>,private commonService: CommonService,
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
        LineItem: this.data?.list?.vendorLineItem,
        calculationParameter: this.data?.list?.calculationParameter,
        calculationType: this.data?.list?.calculationType,
        value: this.data?.list?.unitValue,
        taxName: this.data?.list?.taxCodeName,
        taxPercentage: this.data?.list?.taxPercentage,
        minimumValue: this.data?.list?.minValue,
        remarks: this.data?.list?.remarks,
        active: this.data?.list?.livestatus,
      })
      // this.AddListForm.controls.LineItemCategory.disable();


    }
  }

  AddListForm = new FormGroup({
    LineItemCategory: new FormControl('', [Validators.required, this.CategoryOptionValidator.bind(this)]),
    LineItem: new FormControl('', [Validators.required,Validators.maxLength(200)]),
    calculationParameter: new FormControl('', [Validators.required, this.CalParamOptionValidator.bind(this)]),
    calculationType: new FormControl('', [Validators.required, this.CalTypeOptionValidator.bind(this)]),
    value: new FormControl('', [Validators.required,decimalValidator(14, 2)]),
    taxName: new FormControl('', [Validators.required, this.TaxOptionValidator.bind(this)]),
    taxPercentage: new FormControl({ value: '', disabled: true }),
    minimumValue: new FormControl('0'),
    remarks: new FormControl('', [Validators.maxLength(500)]),
    active: new FormControl(true),
  })

  get f() {
    return this.AddListForm.controls;
  }

  CategoryOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.lineItemCategory?.some((option: any) => option?.lineItemCategoryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CalParamOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.CalculationParameter?.some((option: any) => option?.calculationParameter === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CalTypeOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.CalculationType?.some((option: any) => option?.calculationType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  TaxOptionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
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

  getLineItem(event: any) {
    this.matFilter();
  }
  getLineItemId(event: any) {
    this.matFilter();
  }
  getTaxPercentage(event: any) {
    const selectedTaxName = event.option.value;
    const selectedTaxOption = this.TaxType.find(option => option.taxCodeName === selectedTaxName);
    if (selectedTaxOption) {
      const taxPercentage = selectedTaxOption.taxPer;
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
        console.log("LineItemMaster==>", res);
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
    this.triggerValidation();
    console.log(this.data)
    if (this.AddListForm.invalid) {
      this.AddListForm.markAllAsTouched();
    } else {

      //GetLineItem
      let selectedName = this.data?.list?.lineItemCategoryName;
      if (this.data?.list?.lineItemCategoryName != null && this.data?.list?.lineItemCategoryName != null) {
        this.getLineItem(selectedName);
      }


      let payload = {
        vcffsDetailId: this.data?.selectedCategoryId ? this.data?.selectedCategoryId : 0,
        vendorContractFFSId: +this.data?.vendorContractId ? +this.data?.vendorContractId : 0,
        aamroLineItemCatId: this.getLineItemCategory(this.AddListForm.controls.LineItemCategory.value),
        vendorLineItem: this.AddListForm.controls.LineItem.value,
        calculationParameterId: this.getCalculationParameterID(this.AddListForm.controls.calculationParameter.value),
        calculationTypeId: this.getCalculationTypeID(this.AddListForm.controls.calculationType.value),
        unitValue: this.AddListForm.controls.value.value,
        taxId: this.getTaxNameId(this.AddListForm.controls.taxName.value),
        taxPercentage: this.AddListForm.controls.taxPercentage.value,
        minValue: this.AddListForm.controls.minimumValue.value?this.AddListForm.controls.minimumValue.value : 0,
        remarks: this.AddListForm.controls.remarks.value,
        livestatus: this.AddListForm.controls.active.value ? this.AddListForm.controls.active.value : false,
        createdBy: this.data?.createdBy,
        createdDate: this.data?.createdDate ? this.data?.createdDate : new Date(),
        updatedBy: this.data?.createdBy,
        updatedDate: new Date(),
        lineItemCategoryName: this.AddListForm.controls.LineItemCategory.value,
        calculationParameter: this.AddListForm.controls.calculationParameter.value,
        calculationType: this.AddListForm.controls.calculationType.value,
        taxCodeName: this.AddListForm.controls.taxName.value,
        rowNumber: this.data?.row ? this.data?.row : 0,
        vendorContractMappingModal: this.data?.list?.vendorContractMappingModal
      }
      this.dialogRef.close(payload);
    }
  }

  Close() {
    this.dialogRef.close()
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
