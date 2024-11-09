import { Component, ElementRef, Inject, TemplateRef, ViewChild } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, map, startWith } from 'rxjs';
import { AddVendorContractInfoComponent } from '../add-vendor-contract-info/add-vendor-contract-info.component';
import { RegionService } from 'src/app/services/qms/region.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { LineitemService } from '../../../../crm/master/lineitemcategory/lineitem.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { VendorContractMappingModals } from '../vendor-contract-modal';
import Swal from 'sweetalert2';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { decimalValidator, trimLeadingZeros } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-add-vendor-contract-mapping',
  templateUrl: './add-vendor-contract-mapping.component.html',
  styleUrls: ['./add-vendor-contract-mapping.component.css']
})
export class AddVendorContractMappingComponent {

  filteredLineItemCategory: Observable<any[]>;
  filteredLineItem: Observable<any[]>;
  filteredCalculationParameter: Observable<any[]>;
  filteredCalculationType: Observable<any[]>;
  filteredTaxName: Observable<any[]>;

  MappingList: any[] = [];
  pageSize = 10;
  skip = 0;
  showAddRow: boolean | undefined;
  editRow: boolean = false;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;

  Livestatus = 1;
  LineItemMaster: any[] = [];
  LineItemList: any[] = [];
  CalculationParameter: any[] = [];
  CalculationType: any[] = [];
  TaxType: any[] = [];
  lineItemCategory: any[] = [];

  LineItemCategory = new FormControl('', [Validators.required, this.lineItemCategoryNameValidator.bind(this)]);
  LineItem = new FormControl('', [Validators.required, this.lineItemNameValidator.bind(this)]);
  calculationParameter = new FormControl('', [Validators.required, this.CalculationParameterValidator.bind(this)]);
  calculationType = new FormControl('', [Validators.required, this.CalculationTypeValidator.bind(this)]);
  taxName = new FormControl('', [Validators.required, this.taxCodeNameValidator.bind(this)]);
  value = new FormControl('', [Validators.required, decimalValidator(14, 2)]);
  taxPercentage = new FormControl({ value: '', disabled: true });
  minimumValue = new FormControl('', [decimalValidator(14, 2)]);
  remarks = new FormControl('', [Validators.maxLength(500)]);
  detailId: any;
  taxPer: any;
  addDailog: any;
  @ViewChild('addTemplates', { static: true }) addTemplate: TemplateRef<any>;


  vcffsMappingId:any;
  rowNumber: any;
  livestatus: any;
  calculationTypeReadonly: boolean;
  calculationTypeName: any;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef2: MatDialogRef<AddVendorContractInfoComponent>,
     public dialog: MatDialog,private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getlist();
    this.GetLineItemMaster();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.GetAllTaxType();
    this.matFilter();
    console.log(this.data)
    if(this.data?.view){
      this.showAddRow = true;
    }
    //this.LineItem.disable();
    if (this.data?.detailId) {
      this.detailId = this.data?.detailId;
      // this.MappingList = this.data?.list
      // console.log(this.MappingList)
      this.calculationTypeReadonly=true;
      if (this.data?.list) {
        this.MappingList = this.data.list.map((item: any) => {
          const randomRowNumber = this.generateRandomId(6);
          const cancelID = this.generateRandomId(6);
          return {
            ...item,
            rowNumber: randomRowNumber,
            cancelId: cancelID
          };
        });

        console.log(this.MappingList);
      }


      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.row;
      }
    } else {
      if (this.data?.list) {
        this.detailId = this.data?.detailId;
        this.MappingList = this.data.list.map((item: any) => {
          const randomRowNumber = this.generateRandomId(6);
          const cancelID = this.generateRandomId(6);
          return {
            ...item,
            rowNumber: randomRowNumber,
            cancelId: cancelID
          };
        });

        console.log(this.MappingList);
      }
    }
  }

  trimDecimalFieldValue(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/[^0-9.]/g, '');
  
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('.')) {
      value = '0' + value;
    }
  
    if (parts[0].length > 14) {
      parts[0] = parts[0].slice(0, 14);
    }
  
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
  
    input.value = parts.join('.');
    this.value.setValue(input.value, { emitEvent: false });
  }

  trimDecimalFieldMinValue(event: any): void {
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
    this.minimumValue.setValue( input.value, { emitEvent: false });
  }
  

  matFilter() {
    this.filteredLineItemCategory = this.LineItemCategory.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfilteredLineItemCategory(value || '')),
    );

    this.filteredLineItem = this.LineItem.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfilteredLineItem(value || '')),
    );

    this.filteredCalculationParameter = this.calculationParameter.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCalculationParameter(value || '')),
    );

    this.filteredCalculationType = this.calculationType.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCalculationType(value || '')),
    );
    this.filteredTaxName = this.taxName.valueChanges.pipe(
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
    return this.LineItemList.filter((option: any) => option?.lineItemName.toLowerCase().includes(filterValue));
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

  lineItemCategoryNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.lineItemCategory?.some((option: any) => option?.lineItemCategoryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  lineItemNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.LineItemList?.some((option: any) => option?.lineItemName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CalculationParameterValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CalculationParameter?.some((option: any) => option?.calculationParameter === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CalculationTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CalculationType?.some((option: any) => option?.calculationType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  taxCodeNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.TaxType?.some((option: any) => option?.taxCodeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  getLineItem(event: any) {
    this.matFilter();
  }
  getLineItemId(event: any) {
    this.matFilter();
  }

  calculationParameterEvent(event: any){
    debugger
    let selectedValue = event?.option?.value;
   let calculationTValue= this.CalculationParameter.find(x=>x.calculationParameter==selectedValue)
    this.calculationTypeName = calculationTValue.calculationType;

    if (this.calculationTypeName) {
      this.calculationTypeReadonly=true;
      this.calculationType.setValue(this.calculationTypeName);

    } else {
      this.calculationTypeReadonly=false;
      this.calculationType.reset()
    
    }
    this.matFilter();

  }

  LineItemCategoryEvent(event: any) {
    this.LineItemList = [];
    let selectedName = event?.option?.value ? event?.option?.value : event;

    this.LineItem.reset();
    let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    this.LineItemList = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    this.LineItem.enable();
    this.matFilter();
    if (this.LineItemList?.length != 0) {
      this.LineItem.enable();
      this.matFilter();
    } else {
      this.LineItemList = [];
    }

    // if (this.LineItem.value) {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'Do you want to change the category?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, change it!',
    //     cancelButtonText: 'No, keep it'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.LineItem.reset();
    //       let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    //       this.LineItemList = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    //       if (this.LineItemList?.length != 0) {
    //         this.LineItem.enable();
    //         this.matFilter();
    //       } else {
    //         this.LineItemList = [];
    //       }
    //     }
    //   })
    // } else {
    //   let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    //   this.LineItemList = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    //   if (this.LineItemList?.length != 0) {
    //     this.LineItem.enable();
    //     this.matFilter();
    //   } else {
    //     this.LineItemList = [];
    //   }
    // }

  }

  getLIneItemByID(value: any) {
    this.LineItemList = [];
    let selectedName = value;
    let selectedCategoryId = this.lineItemCategory.find((option: any) => option?.lineItemCategoryName == selectedName)
    this.LineItemList = this.LineItemMaster.filter((option: any) => option?.lineItemCategoryId == selectedCategoryId?.lineItemCategoryId)
    if (this.LineItemList?.length != 0) {
      this.LineItem.enable();
      this.matFilter();
    } else {
      this.LineItemList = [];
    }
  }

  getTaxPercentage(event: any) {
    const selectedTaxName = event.option.value;
    const selectedTaxOption = this.TaxType.find(option => option.taxCodeName === selectedTaxName);
    if (selectedTaxOption) {
      const taxPercentage = selectedTaxOption.taxPer;
      this.taxPercentage?.patchValue(taxPercentage)
      this.taxPer= selectedTaxOption.taxPer;
    } else {
      console.error('Selected tax option not found');
    }
    this.matFilter();
  }

  getMappingList() {
    this.regionService.GetVendorMappingById(this.detailId).subscribe((res: any) => {
      console.log(res)
      this.MappingList = res;
    })
  }

  getlist() {
    this.LineitemService.GetAlllineItem(this.Livestatus).subscribe((result: any) => {
      this.lineItemCategory = result;
      this.matFilter();
    });
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

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });
    // if (!this.showAddRow) {
    //   const newRow: VendorContractMappingModals = {
    //     "vcffsMappingId": '',
    //     "vcffsDetailId": 0,
    //     "aamroLineItemCatId": 0,
    //     "aamroLineItemId": 0,
    //     "calculationParameterId": 0,
    //     "calculationTypeId": 0,
    //     "valueInVendorCurrency": 0,
    //     "minValueInVendorCurrency": 0,
    //     "taxId": 0,
    //     "taxPercentage": 0,
    //     "remarks": '',
    //     "livestatus": false,
    //     "createdBy": 0,
    //     "createdDate": null,
    //     "updatedBy": 0,
    //     "updatedDate": '',
    //     "lineItemCategoryName": '',
    //     "lineItemName": '',
    //     "calculationParameter": '',
    //     "calculationType": '',
    //     "taxCodeName": '',
    //     Isedit: true,
    //     rowNumber: this.generateRandomId(6),
    //     cancelId: ''
    //   }
    //   this.MappingList = [newRow, ...this.MappingList];
    //   this.showAddRow = true;
    //   this.editRow = false;
    //   this.resetFormControls();
    // }

    this.rowNumber= this.generateRandomId(6),
    this.LineItemCategory.reset();
    this.LineItem.reset();
    this.calculationParameter.reset();
    this.calculationType.reset();
    this.value.reset();
    this.taxName.reset();
    this.taxPercentage.reset();
    this.minimumValue.reset();
    this.minimumValue.setValue('0');
    this.remarks.reset();


    this.addDailog = this.dialog.open(this.addTemplate,{
      disableClose: true,
      autoFocus: false
    });

    this.addDailog.afterClosed().subscribe((result: any) => {
    });
  }

  addSave() {
    debugger
    if (
      this.LineItemCategory.invalid ||
      this.LineItem.invalid ||
      this.calculationParameter.invalid ||
      this.calculationType.invalid ||
      this.taxName.invalid ||
      this.value.invalid ||
      this.taxPercentage.invalid
    ) {
      this.LineItemCategory.markAsTouched();
      this.LineItem.markAsTouched();
      this.calculationParameter.markAsTouched();
      this.calculationType.markAsTouched();
      this.taxName.markAsTouched();
      this.value.markAsTouched();
      this.taxPercentage.markAsTouched();
      this.minimumValue.markAsTouched();

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });

      return;
    }

      var NewRow = {
        "vcffsMappingId": this?.vcffsMappingId || 0,
        "vcffsDetailId": this.detailId || 0,
        "aamroLineItemCatId": this.getLineItemCategory(this?.LineItemCategory.value) || 0,
        "aamroLineItemId": this.getLineItemID(this?.LineItem.value) || 0,
        "calculationParameterId": this.getCalculationParameterID(this?.calculationParameter.value) || 0,
        "calculationTypeId": this.getCalculationTypeID(this?.calculationType.value) || 0,
        "valueInVendorCurrency": parseFloat(this?.value?.value ?? '') || 0,
        "minValueInVendorCurrency": parseFloat(this?.minimumValue.value ?? '') || 0,
        "taxId": this.getTaxNameId(this?.taxName.value) || null,
        "taxPercentage": this.taxPercentage.value,
        "remarks": this?.remarks.value || null,
        "livestatus": this?.livestatus ,
        "createdBy": this.data?.createdBy || null,
        "createdDate": new Date(),
        "updatedBy": this.data?.createdBy || null,
        "updatedDate": new Date(),
        "lineItemCategoryName":this?.LineItemCategory.value || null,
        "lineItemName": this?.LineItem.value || null,
        "calculationParameter": this?.calculationParameter.value || null,
        "calculationType": this?.calculationType.value || null,
        "taxCodeName": this?.taxName.value || null,
        Isedit: false,
        rowNumber: this?.rowNumber
      }



      let existingItemIndex = this.MappingList.findIndex(option => 
         option?.rowNumber === NewRow.rowNumber
      );


      if(existingItemIndex > -1){

        let NewItem = this.MappingList.find(option => option.vcffsDetailId === NewRow?.vcffsDetailId &&
          option?.aamroLineItemId === NewRow?.aamroLineItemId && option?.rowNumber !== NewRow?.rowNumber);

          if (NewItem) {
            Swal.fire({
              icon: "warning",
              title: "Duplicate Entry",
              text: "This Line Item is already selected.",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
              timer: 2000
            });
            this.LineItem.reset();
            return;
          } else {
            this.MappingList[existingItemIndex] = NewRow;
            this.MappingList = [...this.MappingList]
            this.addDailog.close()
            this.showAddRow = false;
            this.editRow = false;
          }


      } else {

        const sumValue = this.MappingList.reduce((acc, item) => acc + parseFloat(item.valueInVendorCurrency), 0);

        if (sumValue > this.data?.value) {
          Swal.fire({
            title: 'Error!',
            text: `The selected value is greater than the sum of value (${this.data?.value})!`,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          this.value.reset();
          return;
        }


        let NewItem = this.MappingList.find(option => option.vcffsDetailId === NewRow?.vcffsDetailId &&
          option?.aamroLineItemId === NewRow?.aamroLineItemId && option?.rowNumber !== NewRow?.rowNumber);
  
  
        const isUnique = this.checkForDuplicateLineItems(this.data?.ContractList,NewRow);
  
        if (!isUnique) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Entry",
            text: "This Line Item is already existed in another line item.",
            confirmButtonColor: "#007dbd",
            showConfirmButton: true,
            timer: 2000
          });
          this.LineItem.reset();
          return;
        } else {
          if (NewItem) {
            Swal.fire({
              icon: "warning",
              title: "Duplicate Entry",
              text: "This Line Item is already selected.",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
              timer: 2000
            });
            this.LineItem.reset();
            return;
          } else {
            this.showAddRow = false;
            this.editRow = false;
            let newArray = this.MappingList.filter(option => !option?.Isedit);
            this.MappingList = [...newArray, NewRow];
            this.addDailog.close()
            this.showAddRow = false;
            console.log(this.MappingList);
            this.LineItem.disable();
          }
        }
      }
    // }
  }

  addClose(){
    this.addDailog.close()
    this.showAddRow = false;
  }

  resetFormControls() {
    this.LineItemCategory.markAsPristine();
    this.LineItemCategory.markAsUntouched();
    this.LineItem.markAsPristine();
    this.LineItem.markAsUntouched();
    this.calculationParameter.markAsPristine();
    this.calculationParameter.markAsUntouched();
    this.calculationType.markAsPristine();
    this.calculationType.markAsUntouched();
    this.taxName.markAsPristine();
    this.taxName.markAsUntouched();
    this.value.markAsPristine();
    this.value.markAsUntouched();
    this.taxPercentage.markAsPristine();
    this.taxPercentage.markAsUntouched();
    this.minimumValue.markAsPristine();
    this.minimumValue.markAsUntouched();
    this.remarks.markAsPristine();
    this.remarks.markAsUntouched();
  }

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  Edit(obj: any,) {

    //LineItem option
     this.taxPer=obj.taxPercentage;
     this.rowNumber=obj.rowNumber;
     this.livestatus=obj.livestatus;
     this.vcffsMappingId=obj.vcffsMappingId;


     this.getLIneItemByID(obj.lineItemCategoryName);

    // this.MappingList.forEach((element) => {
    //   element.Isedit = false;
    // });
    // obj.Isedit = true;
    this.showAddRow = true;
    this.editRow = true;

    this.LineItemCategory.setValue(obj?.lineItemCategoryName)
    this.LineItem.setValue(obj?.lineItemName)
    this.calculationParameter.setValue(obj?.calculationParameter)
    this.calculationType.setValue(obj?.calculationType)
    this.value.setValue(obj?.valueInVendorCurrency)
    this.taxName.setValue(obj?.taxCodeName)
    this.taxPercentage.setValue(obj?.taxPercentage)
    this.minimumValue.setValue(obj?.minValueInVendorCurrency)
    this.remarks.setValue(obj?.remarks)

    this.addDailog = this.dialog.open(this.addTemplate,{
      disableClose: true,
      autoFocus: false
    });
  }

  view(obj: any, index: any) {

  }
  Delete(obj: any, index: any) {
    this.MappingList = this.MappingList.filter((_, i) => i !== index);
  }


  checkLineItem(event: any) {

  }

  Save(dataItem: any) {
    debugger
    console.log(dataItem)
    if (
      this.LineItemCategory.invalid ||
      this.LineItem.invalid ||
      this.calculationParameter.invalid ||
      this.calculationType.invalid ||
      this.taxName.invalid ||
      this.value.invalid ||
      this.taxPercentage.invalid
    ) {
      this.LineItemCategory.markAsTouched();
      this.LineItem.markAsTouched();
      this.calculationParameter.markAsTouched();
      this.calculationType.markAsTouched();
      this.taxName.markAsTouched();
      this.value.markAsTouched();
      this.taxPercentage.markAsTouched();
      this.minimumValue.markAsTouched();

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });

      return;
    }

    // const sumValue = this.MappingList.reduce((acc, item) => acc + item.valueInVendorCurrency, 0);
    const sumValue = this.MappingList.reduce((acc, item) => acc + parseFloat(item.valueInVendorCurrency), 0);


    if (sumValue > this.data?.value) {
      Swal.fire({
        title: 'Error!',
        text: `The selected value is greater than the sum of value (${this.data?.value})!`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      this.value.reset();
      return;
    } else {
      var NewRow = {
        "vcffsMappingId": dataItem?.vcffsMappingId || 0,
        "vcffsDetailId": this.detailId || 0,
        "aamroLineItemCatId": this.getLineItemCategory(dataItem?.lineItemCategoryName) || 0,
        "aamroLineItemId": this.getLineItemID(dataItem?.lineItemName) || 0,
        "calculationParameterId": this.getCalculationParameterID(dataItem?.calculationParameter) || 0,
        "calculationTypeId": this.getCalculationTypeID(dataItem?.calculationType) || 0,
        "valueInVendorCurrency": dataItem?.valueInVendorCurrency || null,
        "minValueInVendorCurrency": dataItem?.minValueInVendorCurrency || 0,
        "taxId": this.getTaxNameId(dataItem?.taxCodeName) || null,
        "taxPercentage": this.taxPer,
        "remarks": dataItem?.remarks || null,
        "livestatus": dataItem?.livestatus ,
        "createdBy": this.data?.createdBy || null,
        "createdDate": new Date(),
        "updatedBy": this.data?.createdBy || null,
        "updatedDate": new Date(),
        "lineItemCategoryName": dataItem?.lineItemCategoryName || null,
        "lineItemName": dataItem?.lineItemName || null,
        "calculationParameter": dataItem?.calculationParameter || null,
        "calculationType": dataItem?.calculationType || null,
        "taxCodeName": dataItem?.taxCodeName || null,
        Isedit: false,
        rowNumber: dataItem?.rowNumber
      }

      let existingItemIndex = this.MappingList.findIndex(option => 
        option.aamroLineItemId === NewRow.aamroLineItemId && option?.rowNumber === NewRow.rowNumber
      );
      if(existingItemIndex > -1){
        let newArray = this.MappingList.filter(option => !option?.Isedit);
        this.MappingList = [...newArray, NewRow];
        this.showAddRow = false;
        this.editRow = false;
      } else {
        let NewItem = this.MappingList.find(option => option.vcffsDetailId === NewRow?.vcffsDetailId &&
          option?.aamroLineItemId === NewRow?.aamroLineItemId && option?.rowNumber !== NewRow?.rowNumber);
  
  
        const isUnique = this.checkForDuplicateLineItems(this.data?.ContractList,NewRow);
  
        if (!isUnique) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Entry",
            text: "This Line Item is already existed in another line item.",
            confirmButtonColor: "#007dbd",
            showConfirmButton: true,
            timer: 2000
          });
          this.LineItem.reset();
          return;
        } else {
          if (NewItem) {
            Swal.fire({
              icon: "warning",
              title: "Duplicate Entry",
              text: "This Line Item is already selected.",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
              timer: 2000
            });
            this.LineItem.reset();
            return;
          } else {
            this.showAddRow = false;
            this.editRow = false;
            let newArray = this.MappingList.filter(option => !option?.Isedit);
            this.MappingList = [...newArray, NewRow];
            console.log(this.MappingList);
            this.LineItem.disable();
          }
        }
      }

      


    }
  }


  checkForDuplicateLineItems(dataArray: any[], newRow: any): boolean {
    const aamroLineItemIds = new Set<number>();
    for (const item of dataArray) {
      if (item.vendorContractMappingModal && Array.isArray(item.vendorContractMappingModal)) {
        for (const modalItem of item.vendorContractMappingModal) {
          if (modalItem.aamroLineItemId !== undefined && modalItem.aamroLineItemId !== null && modalItem.rowNumber !== newRow.rowNumber) {
            aamroLineItemIds.add(modalItem.aamroLineItemId);
          }
        }
      }
    }
  
    if (newRow.aamroLineItemId !== undefined && newRow.aamroLineItemId !== null) {
      if (aamroLineItemIds.has(newRow.aamroLineItemId)) {
        return false; 
      }
    }
  
    return true; 
  }
  

  Update(dataItem: any) {

  }

  AddtoList() {
    if (this.showAddRow) {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Please Save the data...!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const sumValue = this.MappingList.reduce((acc, item) => acc + parseFloat(item.valueInVendorCurrency), 0);
    
    if (sumValue != this.data?.value) {
      Swal.fire({
        title: 'Error!',
        text: `The selected value is not equal to the sum of value (${this.data?.value})!`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    } else {
      this.dialogRef2.close(this.MappingList)
    }
  }

  Close() {
    // if (this.showAddRow && this.data?.view) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Oops!",
    //     text: "Please Save the data...!",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   return;
    // }
    this.dialogRef2.close()
  }

 

  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }


  oncancel(obj: any, index: any) {
    obj.Isedit = false;
    this.showAddRow = false;
    this.editRow = false;

    this.MappingList.forEach((element) => {
      element.Isedit = false;
    });

    this.MappingList = this.MappingList.filter(item => item?.cancelId !== '');
    this.LineItem.disable();
  }

  getLineItemCategory(value: any) {
    let customer = this.lineItemCategory.find(option => option?.lineItemCategoryName == value)
    return customer?.lineItemCategoryId;
  }
  getLineItemID(value: any) {
    let customer = this.LineItemList.find(option => option?.lineItemName == value)
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

  //#region Keyboard tab operation

  /// to provoke csave or update method

  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === "Tab" || event.key === "Enter") {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === "Tab") {
      this.cancelButton.nativeElement.focus();
    }
  }
  handleKeyPress(event: any, dataItem: any, index: any) {
    if (event.key === "Enter") {
      this.oncancel(dataItem, index);
    }
  }

}
