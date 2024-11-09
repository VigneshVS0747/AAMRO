import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs';
import { LineitemService } from 'src/app/crm/master/lineitemcategory/lineitem.service';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import { CalculationParameters, CalculationTypes } from 'src/app/Models/crm/master/Dropdowns';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from '../../Quotations/quotation.service';
import { changeExchange, Exchange } from '../../Quotations/quotation-model/quote';
import { CurrenciesService } from 'src/app/ums/masters/currencies/currencies.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';

@Component({
  selector: 'app-pidetails',
  templateUrl: './pidetails.component.html',
  styleUrls: ['./pidetails.component.css']
})
export class PIdetailsComponent {
  QLIVendorValueDetail:FormGroup
  Date = new Date();
  CalculationParlist: CalculationParameters[]=[];
  filteredCalculationParOptions$: any;
  calculationParameterId: any;
  calculationParameter: any;
  CalculationTyplist:CalculationTypes[]=[];
  filteredCalculationTypeOptions$: any;
  calculationTypeId: any;
  calculationType: any;
  taxcodelist: TaxCode[]=[];
  filteredTaxCodeOptions$: any;
  taxId: any;
  taxCodeName: any;
  aamroLineItemCatList: lineitem[]=[];
  filteredAamroLineItemCatOptions$: any;
  selectedAamroLineItemCatId: any;
  selectedAamroLineItemcat: any;
  disablefields: boolean;
  currencyId: any;
  companycurrency:Currency;
  valueInCompanyCurrency:changeExchange;
  exchange: number;
  valueInCompany: number;
  minValueInCompanyCurrency: changeExchange;
  minValueInCompany: number;
  taxper: any;

  constructor(private fb:FormBuilder,
    private Cservice:CommonService,
  private LS:LineitemService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PIdetailsComponent>,private Qs: QuotationService,private currencyS: CurrenciesService){

  }
  ngOnInit(): void {
    this.InitializeForm();
    this.getAamroLineItemCategories();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.getTaxCode();
    this.getCompanyCurrency();
    this.EditMode();
    this.selectedAamroLineItemCatId = this.data.Load.aamroLineItemCatId;
    this.selectedAamroLineItemcat = this.data.Load.lineItemCategoryName;
    this.currencyId=this.data.currencyId;  
  }
  InitializeForm(){
    this.QLIVendorValueDetail = this.fb.group({
      pILIVendorValueId: [0],
      purchaseInvDetailId:[0],
      aamroLineItemCatId:[null,Validators.required],
      vendorLineItem:[null,Validators.required],
      lineItemCategoryName:[null],
      calculationParameterId:[null,Validators.required],
      calculationParameter:[null],
      calculationTypeId:[null,Validators.required],
      calculationType:[null],
      valueInVendorCurrency:[null,Validators.required],
      minValueInVendorCurrency:[0],	
      //exchangeRate:[null,Validators.required],
      taxId:[null,Validators.required],
      taxCodeName:[null],
      taxPercentage:[null,Validators.required],
      remarks:[null],
      createdBy:1,
      createdDate:this.Date,
      updatedBy: 1,
      updatedDate: this.Date,
      qLIVendorValue:[null]
  
    });
   }


   EditMode(){
    if(this.data.mode =="Edit"){
      debugger;
      this.disablefields=false;
      this.QLIVendorValueDetail.patchValue(this.data.VData);
      this.selectedAamroLineItemCatId = this.data.VData.aamroLineItemCatId,
      this.selectedAamroLineItemcat = this.data.VData.lineItemCategoryName,
      this.calculationParameterId = this.data.VData.calculationParameterId,
      this.calculationParameter = this.data.VData.calculationParameter,
      this.calculationTypeId = this.data.VData.calculationTypeId,
      this.calculationType = this.data.VData.calculationType,
      this.taxId = this.data.VData.taxId,
      this.taxCodeName = this.data.VData.taxCodeName,
      this.valueInCompany = this.data.VData.valueInCompanyCurrency,
      this.minValueInCompany= this.data.VData.minValueInCompanyCurrency,
      this.exchange= this.data.VData.exchangeRate
      this.QLIVendorValueDetail.controls["pILIVendorValueId"].setValue(this.data.VData.piliVendorValueId);
      this.QLIVendorValueDetail.controls["purchaseInvDetailId"].setValue(this.data.VData.purchaseInvDetailId);
      this.QLIVendorValueDetail.controls["aamroLineItemCatId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["calculationParameterId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["calculationTypeId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["taxId"].setValue(this.data.VData);
    }else if(this.data.mode =="view"){
      this.ViewMode();
    }
   }

   ViewMode(){
    debugger;
    this.disablefields=true;
      this.QLIVendorValueDetail.disable();
      this.QLIVendorValueDetail.patchValue(this.data.VData);
      this.selectedAamroLineItemCatId = this.data.VData.aamroLineItemCatId,
      this.selectedAamroLineItemcat = this.data.VData.lineItemCategoryName,
      this.calculationParameterId = this.data.VData.calculationParameterId,
      this.calculationParameter = this.data.VData.calculationParameter,
      this.calculationTypeId = this.data.VData.calculationTypeId,
      this.calculationType = this.data.VData.calculationType,
      this.taxId = this.data.VData.taxId,
      this.taxCodeName = this.data.VData.taxCodeName,
      this.valueInCompany = this.data.VData.valueInCompanyCurrency,
      this.minValueInCompany= this.data.VData.minValueInCompanyCurrency,
      this.exchange= this.data.VData.exchangeRate
      this.QLIVendorValueDetail.controls["pILIVendorValueId"].setValue(this.data.VData.piliVendorValueId);
      this.QLIVendorValueDetail.controls["purchaseInvDetailId"].setValue(this.data.VData.purchaseInvDetailId);
      this.QLIVendorValueDetail.controls["aamroLineItemCatId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["calculationParameterId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["calculationTypeId"].setValue(this.data.VData);
      this.QLIVendorValueDetail.controls["taxId"].setValue(this.data.VData);
   }

//#region aamroLineItemCat
getAamroLineItemCategories() {
  this.LS.GetAlllineItem(1).subscribe((result) => {
    this.aamroLineItemCatList = result;
    this.aamroLineItemCatFun();
    var cat =this.aamroLineItemCatList.find(id=>id.lineItemCategoryId==this.data.Load.lineItemCategoryId);
    this.selectedAamroLineItemCatId = cat?.lineItemCategoryId;
    this.selectedAamroLineItemcat = cat?.lineItemCategoryName;
    this.QLIVendorValueDetail.controls["aamroLineItemCatId"].setValue(cat);
  });
}
aamroLineItemCatFun() {
  this.filteredAamroLineItemCatOptions$ = this.QLIVendorValueDetail.controls['aamroLineItemCatId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.lineItemCategoryName)),
    map((name: any) => (name ? this.filteredAamroLineItemCatOptions(name) : this.aamroLineItemCatList?.slice()))
  );
}
private filteredAamroLineItemCatOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.aamroLineItemCatList.filter((option: any) => option.lineItemCategoryName.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDataAamroLineItemCat();
}
NoDataAamroLineItemCat(): any {
  this.QLIVendorValueDetail.controls['aamroLineItemCatId'].setValue('');
  return this.aamroLineItemCatList;
}
displayAamroLineItemCatListLabelFn(data: any): string {
  return data && data.lineItemCategoryName ? data.lineItemCategoryName : '';
}
aamroLineItemCatSelectedOption(data: any) {
  let selectedValue = data.option.value;
  this.selectedAamroLineItemCatId = selectedValue.lineItemCategoryId;
  this.selectedAamroLineItemcat = selectedValue.lineItemCategoryName
}
//#endregion aamroLineItemCat

   //#region select CalculationParameter
GetAllCalculationParameter() {
  this.Cservice.GetAllCalculationParameter().subscribe(result => {
    this.CalculationParlist = result;
    this.CalculationParFun()
  });
}
CalculationParFun() {
  this.filteredCalculationParOptions$ = this.QLIVendorValueDetail.controls['calculationParameterId'].valueChanges.pipe(
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
  this.QLIVendorValueDetail.controls['calculationParameterId'].setValue('');
  return this.CalculationParlist;
}
displayculationParLabelFn(data: any): string {
  return data && data.calculationParameter ? data.calculationParameter : '';
}
CalculationParSelectedoption(data: any) {
  let selectedValue = data.option.value;
  this.calculationParameterId = selectedValue.calculationParameterId;
  this.calculationParameter = selectedValue.calculationParameter;
}
//#endregion
 //#region select culationType
 GetAllCalculationType() {
  this.Cservice.GetAllCalculationType().subscribe(result => {
    this.CalculationTyplist = result;
    this.CalculationTypeFun()
    console.log(this.CalculationTyplist)
  });
}
CalculationTypeFun() {
  this.filteredCalculationTypeOptions$ = this.QLIVendorValueDetail.controls['calculationTypeId'].valueChanges.pipe(
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
  this.QLIVendorValueDetail.controls['calculationTypeId'].setValue('');
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

 //#region select taxcode
 getTaxCode() {
  this.Cservice.GetAllActiveTaxCodes().subscribe(result => {
    this.taxcodelist = result;
    this.TaxCodeFun()
  });
}
TaxCodeFun() {
  this.filteredTaxCodeOptions$ = this.QLIVendorValueDetail.controls['taxId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
    map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
  );
}
private filteredTaxCodeOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDataTaxCode();
}
NoDataTaxCode(): any {
  this.QLIVendorValueDetail.controls['taxId'].setValue(null);
  return this.taxcodelist;
}
displayTaxCodeLabelFn(data: any): string {
  return data && data.taxCodeName ? data.taxCodeName : '';
}

TaxCodeSelectedoption(data: any) {
  let selectedValue = data.option.value;
  this.taxId = selectedValue.taxCodeId;
  this.taxCodeName = selectedValue.taxCodeName;
  this.taxper= selectedValue.taxPer
  this.QLIVendorValueDetail.controls["taxPercentage"].setValue(this.taxper);

  if (this.QLIVendorValueDetail.controls['valueInVendorCurrency'].value != null) {
    const payload: Exchange = {
      fromCurrencyId: this.currencyId,
      toCurrencyId: this.companycurrency.currencyId,
      value: this.QLIVendorValueDetail.controls['valueInVendorCurrency'].value
    }
    console.log("payload1", payload);
    this.Qs.CurrencyExchanges(payload).subscribe((res => {
      this.valueInCompanyCurrency = res;
      console.log("this.valueInCompanyCurrency",this.valueInCompanyCurrency)
      this.exchange = this.valueInCompanyCurrency.exchangeRate;
      this.valueInCompany=this.valueInCompanyCurrency.convertedValue;
    }));
  }
  if (this.QLIVendorValueDetail.controls['minValueInVendorCurrency'].value != null) {
    const payload: Exchange = {
      fromCurrencyId: this.currencyId,
      toCurrencyId: this.companycurrency.currencyId,
      value: this.QLIVendorValueDetail.controls['minValueInVendorCurrency'].value
    }
    console.log("payload2", payload);
    this.Qs.CurrencyExchanges(payload).subscribe((res => {
      this.minValueInCompanyCurrency = res;
      console.log("this.minValueInCompanyCurrency",this.minValueInCompanyCurrency)
      this.exchange = this.minValueInCompanyCurrency.exchangeRate;
      this.minValueInCompany=this.minValueInCompanyCurrency.convertedValue;
    }));
  }
}
//#endregion


//#region  AddToList

AddToList(){
  debugger;
  let iscalculationParameterId = this.QLIVendorValueDetail.controls['calculationParameterId'].value
  if(iscalculationParameterId?.calculationParameterId === null || iscalculationParameterId?.calculationParameterId === undefined){
    this.QLIVendorValueDetail.controls['calculationParameterId'].reset();
  }

  let iscalculationTypeId = this.QLIVendorValueDetail.controls['calculationTypeId'].value
  if(iscalculationTypeId?.calculationTypeId === null || iscalculationTypeId?.calculationTypeId === undefined){
    this.QLIVendorValueDetail.controls['calculationTypeId'].reset();
  }

  let tax = this.QLIVendorValueDetail.controls['taxId'].value
  if(tax?.taxCodeName === "" || tax?.taxCodeName === undefined){
    this.QLIVendorValueDetail.controls['taxId'].reset();
  }
  if(this.QLIVendorValueDetail.valid){
    debugger
    const QLineItemVD ={
      ...this.QLIVendorValueDetail.value,
      aamroLineItemCatId:this.selectedAamroLineItemCatId,
      lineItemCategoryName:this.selectedAamroLineItemcat,
      calculationParameterId:this.calculationParameterId,
      calculationParameter:this.calculationParameter,
      calculationTypeId:this.calculationTypeId,
      calculationType:this.calculationType,
      taxId:this.taxId,
      taxCodeName:this.taxCodeName,
      valueInCompanyCurrency:this.valueInCompany,
      minValueInCompanyCurrency:this.minValueInCompany,
      exchangeRate:this.exchange
  
    }
    console.log("QLineItemVD",QLineItemVD);
    this.dialogRef.close(QLineItemVD);
  }else{
    this.QLIVendorValueDetail.markAllAsTouched();
    this.validateall(this.QLIVendorValueDetail);
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

//#region close;

close(){
  this.dialogRef.close();
}

//#region Get Company curency
getCompanyCurrency() {
  this.currencyS.GetCurrencyByCompanyCurrency().subscribe((res => {
    this.companycurrency = res[0];
    console.log("this.companycurrency = res;", this.companycurrency)
  }));
}
}
