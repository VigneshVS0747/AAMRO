import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs';
import { sourceFrom } from 'src/app/Models/crm/master/Dropdowns';
import { CommonService } from 'src/app/services/common.service';
import { QLIVendorValue, QLIVendorValueDetail, QlineItem, vendorQuotationFilterList } from '../quotation-model/quote';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { QLIVendorValueDetailComponent } from '../qlivendor-value-detail/qlivendor-value-detail.component';

@Component({
  selector: 'app-vendorvalue',
  templateUrl: './vendorvalue.component.html',
  styleUrls: ['./vendorvalue.component.css']
})
export class VendorvalueComponent implements OnInit {
  vendorValue: FormGroup;
  QLIvendorValue: FormGroup;
  sourceFromList: sourceFrom[]=[];
  filteredSourceFromOptions$: any;
  selectedSourceFromId: any;
  PQandCdrp:vendorQuotationFilterList[]=[];
  filteredRefNumberOptions$: any;
  selectedRefNumberId: any;
  currencyList:Currency[]=[];
  filteredCurrencyOptions$: any;
  selectedCurrencyId: any;
  QVLD: any[]=[];
  selectedSourceFromName: any;
  selectedrefNumber: any;
  selectedCurrencyname: any;
  date = new Date();
  vendorId: any = null;
  vendorType: any;
  name: any;
  disablefields: boolean;

constructor(private fb:FormBuilder,private Cs:CommonService,
  @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VendorvalueComponent>,
    public dialog: MatDialog
){

}

  ngOnInit(): void {
    this.InitializeForm();
    this.InitializeVendorLineItem();
    this.SetCustomerLineItemValues();
    this.getSourceFroms();
    this.getCurrencies();
    this.EditMode();


    console.log("this.data.lineItemList",this.data.lineItemList);
  }

 InitializeForm(){
  this.vendorValue = this.fb.group({
    aamrolineitemdis: [''],
    calculationParameter: [''],
    calculationType: [''],
    minimumcharge:[''],
    tax: [null],  
  });
 }

 InitializeVendorLineItem(){
  
  this.QLIvendorValue = this.fb.group({
    qLIVendorValueId:[0],
    qLineItemId:[0],
    sourceFromId: [{ value: '', disabled: true }],
    sourceFrom:[''],
    refNumberId: [{ value: '', disabled: true }],
    refNumber: [''],
    currencyId: [{ value: '', disabled: true }],
    currencyName: [''],
    createdBy: 1,
    createdDate: [this.date],
    updatedBy: 1,
    updatedDate: [this.date] 
  });
 }

 EditMode(){
  debugger;
  if(this.data.Mode =="Edit"){
    if(this.data.cuslineitem.quotationLineItemVendorValues!=null || undefined){
      this.disablefields=false;
      this.selectedSourceFromId = this.data.cuslineitem.quotationLineItemVendorValues.sourceFromId;
    this.selectedRefNumberId = this.data.cuslineitem.quotationLineItemVendorValues.refNumberId;
    this.selectedCurrencyId = this.data.cuslineitem.quotationLineItemVendorValues.currencyId;
    this.selectedSourceFromName = this.data.cuslineitem.quotationLineItemVendorValues.sourceFrom;
    this.selectedrefNumber=this.data.cuslineitem.quotationLineItemVendorValues.refNumber;
    this.selectedCurrencyname =this.data.cuslineitem.quotationLineItemVendorValues.currencyName;
    this.getSourceFrom( this.selectedSourceFromId);
    this.QLIvendorValue.controls["qLIVendorValueId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues.qliVendorValueId);
    this.QLIvendorValue.controls["qLineItemId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues.qLineItemId);
    this.QLIvendorValue.controls["sourceFromId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QLIvendorValue.controls["refNumberId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QVLD=this.data.cuslineitem.quotationLineItemVendorValues.quotationLineItemVendorValueDetails;
    }else{
      this.disablefields=false;
      this.selectedSourceFromId = this.data.cuslineitem.sourceFromId;
      this.selectedRefNumberId = this.data.cuslineitem.refNumberId;
      this.selectedCurrencyId = this.data.cuslineitem.currencyId;
      this.selectedSourceFromName = this.data.cuslineitem.sourceFrom;
      this.selectedrefNumber=this.data.cuslineitem.refNumber;
      this.selectedCurrencyId = this.data.cuslineitem.vendorCurrencyId;
      this.selectedCurrencyname = this.data.cuslineitem.currencyName;
      this.getSourceFrom( this.selectedSourceFromId);
      this.QLIvendorValue.controls["sourceFromId"].setValue(this.data.cuslineitem);
      this.QLIvendorValue.controls["refNumberId"].setValue(this.data.cuslineitem);
      this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem);
      //this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem.selectedvendor);
      //this.QVLD=this.data.cuslineitem.quotationLineItemVendorValues.quotationLineItemVendorValueDetails;

      // if(this.data.lineItemList!=null ){
      //   var lineItem = this.data.lineItemList
      //     let Lineitem:QLIVendorValueDetail = {
      //       qLIVendorValueDetailId: 0,
      //       qLIVendorValueId: 0,
      //       aamroLineItemCatId:lineItem.lineItemCategoryId,
      //       vendorLineItem:null,
      //       calculationParameterId: lineItem.calculationParameterId,
      //       calculationTypeId: lineItem.calculationTypeId,
      //       valueInVendorCurrency:lineItem.valueInCustomerCurrency,
      //       valueInCompanyCurrency: lineItem.minValueInCustomerCurrency,
      //       minValueInVendorCurrency:lineItem.minValueInVendorCurrency,
      //       minValueInCompanyCurrency: lineItem.minValueInCompanyCurrency,
      //       exchangeRate:null,
      //       taxId:lineItem.taxId,
      //       taxPercentage: lineItem.taxPercentage,
      //       createdDate: this.date,
      //       updatedDate: this.date,
      //       createdBy: 1,
      //       updatedBy: 1,
      //       lineItemCategoryName:lineItem.lineItemCategoryName,
      //       calculationParameter:lineItem.calculationParameter,
      //       taxCodeName:lineItem.taxCodeName,
      //       calculationType:lineItem.calculationType,
      //     }
      //     this.QVLD.push(Lineitem);
      //     this.QVLD=[...this.QVLD];
      // }
    }
    
  }else{
    if(this.data.cuslineitem.quotationLineItemVendorValues!=null || undefined){
      this.disablefields=true;
      this.selectedSourceFromId = this.data.cuslineitem.quotationLineItemVendorValues.sourceFromId;
    this.selectedRefNumberId = this.data.cuslineitem.quotationLineItemVendorValues.refNumberId;
    this.selectedCurrencyId = this.data.cuslineitem.quotationLineItemVendorValues.currencyId;
    this.selectedSourceFromName = this.data.cuslineitem.quotationLineItemVendorValues.sourceFrom;
    this.selectedrefNumber=this.data.cuslineitem.quotationLineItemVendorValues.refNumber;
    this.selectedCurrencyname =this.data.cuslineitem.quotationLineItemVendorValues.currencyName;
    this.getSourceFrom( this.selectedSourceFromId);
    this.QLIvendorValue.controls["qLIVendorValueId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues.qliVendorValueId);
    this.QLIvendorValue.controls["qLineItemId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues.qLineItemId);
    this.QLIvendorValue.controls["sourceFromId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QLIvendorValue.controls["refNumberId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem.quotationLineItemVendorValues);
    this.QVLD=this.data.cuslineitem.quotationLineItemVendorValues.quotationLineItemVendorValueDetails;
    }else{
      this.disablefields=true;
      this.selectedSourceFromId = this.data.cuslineitem.sourceFromId;
      this.selectedRefNumberId = this.data.cuslineitem.refNumberId;
      this.selectedCurrencyId = this.data.cuslineitem.currencyId;
      this.selectedSourceFromName = this.data.cuslineitem.sourceFrom;
      this.selectedrefNumber=this.data.cuslineitem.refNumber;
      this.selectedCurrencyId = this.data.cuslineitem.vendorCurrencyId;
      this.selectedCurrencyname = this.data.cuslineitem.currencyName;
      this.getSourceFrom( this.selectedSourceFromId);
      this.QLIvendorValue.controls["sourceFromId"].setValue(this.data.cuslineitem);
      this.QLIvendorValue.controls["refNumberId"].setValue(this.data.cuslineitem);
      this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem);
      //this.QLIvendorValue.controls["currencyId"].setValue(this.data.cuslineitem.selectedvendor);
      //this.QVLD=this.data.cuslineitem.quotationLineItemVendorValues.quotationLineItemVendorValueDetails;

      // if(this.data.lineItemList!=null ){
      //   var lineItem = this.data.lineItemList
      //     let Lineitem:QLIVendorValueDetail = {
      //       qLIVendorValueDetailId: 0,
      //       qLIVendorValueId: 0,
      //       aamroLineItemCatId:lineItem.lineItemCategoryId,
      //       vendorLineItem:null,
      //       calculationParameterId: lineItem.calculationParameterId,
      //       calculationTypeId: lineItem.calculationTypeId,
      //       valueInVendorCurrency:lineItem.valueInVendorCurrency,
      //       valueInCompanyCurrency: lineItem.valueInCompanyCurrency,
      //       minValueInVendorCurrency:lineItem.minValueInVendorCurrency,
      //       minValueInCompanyCurrency: lineItem.minValueInCompanyCurrency,
      //       exchangeRate:null,
      //       taxId:lineItem.taxId,
      //       taxPercentage: lineItem.taxPercentage,
      //       createdDate: this.date,
      //       updatedDate: this.date,
      //       createdBy: 1,
      //       updatedBy: 1,
      //       lineItemCategoryName:lineItem.lineItemCategoryName,
      //       calculationParameter:lineItem.calculationParameter,
      //       taxCodeName:lineItem.taxCodeName,
      //       calculationType:lineItem.calculationType,
      //     }
      //     this.QVLD.push(Lineitem);
      //     this.QVLD=[...this.QVLD];
      // }
    }
  }
 }
  
 SetCustomerLineItemValues(){
  this.vendorValue.patchValue({
    aamrolineitemdis:this.data.cuslineitem.lineItemName,
    calculationParameter:this.data.cuslineitem.calculationParameter,
    calculationType:this.data.cuslineitem.calculationType,
    minimumcharge:this.data.cuslineitem.minValueInCustomerCurrency,
    tax:this.data.cuslineitem.taxCodeName
 });
}


//#region sourceFrom
getSourceFroms() {
  this.Cs.GetAllSourceFrom().subscribe((result) => {
    this.sourceFromList = result;
    this.sourceFromFun();
  });
}
sourceFromFun() {
  this.filteredSourceFromOptions$ = this.QLIvendorValue.controls['sourceFromId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.sourceFrom)),
    map((name: any) => (name ? this.filteredSourceFromOptions(name) : this.sourceFromList?.slice()))
  );
}
private filteredSourceFromOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.sourceFromList.filter((option: any) => option.sourceFrom.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDataSourceFrom();
}
NoDataSourceFrom(): any {
  this.QLIvendorValue.controls['sourceFromId'].setValue('');
  return this.sourceFromList;
}
displaySourceFromListLabelFn(data: any): string {
  return data && data.sourceFrom ? data.sourceFrom : '';
}
sourceFromSelectedOption(data: any) {
  let selectedValue = data.option.value;
  this.selectedSourceFromId = selectedValue.sourceFromId;
  this.selectedSourceFromName = selectedValue.sourceFrom;
  this.getSourceFrom(this.selectedSourceFromId);
}
//#endregion sourceFrom

//#region get from SourceFrom
 
getSourceFrom(id:number){

    const Data={
      vendorType:id,
      vendorId:null
    }
    this.Cs.GetAllPQandContract(Data).subscribe((res=>{
      this.PQandCdrp = res;
      console.log("76876669y9y",res);
      this.refNumberFun();
     }));
  }
 
refNumberFun() {
  this.filteredRefNumberOptions$ = this.QLIvendorValue.controls['refNumberId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.refNumber)),
    map((name: any) => (name ? this.filteredRefNumberOptions(name) : this.PQandCdrp?.slice()))
  );
}
private filteredRefNumberOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.PQandCdrp.filter((option: any) => option.refNumber.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDataRefNumber();
}
NoDataRefNumber(): any {
  this.QLIvendorValue.controls['refNumberId'].setValue('');
  return this.PQandCdrp;
}
displayRefNumberListLabelFn(data: any): string {
  return data && data.refNumber ? data.refNumber : '';
}
refNumberSelectedOption(data: any) {
  let selectedValue = data.option.value;
  this.selectedRefNumberId = selectedValue.refNumberId;
  this.selectedrefNumber = selectedValue.refNumber
}
//#endregion refNumber
//#region currency
getCurrencies() {
  this.Cs.getCurrencies(1).subscribe((result) => {
    this.currencyList = result;
    this.currencyFun();
  });
}
currencyFun() {
  this.filteredCurrencyOptions$ = this.QLIvendorValue.controls['currencyId'].valueChanges.pipe(
    startWith(''),
    map((value: any) => (typeof value === 'string' ? value : value?.currencyName)),
    map((name: any) => (name ? this.filteredCurrencyOptions(name) : this.currencyList?.slice()))
  );
}
private filteredCurrencyOptions(name: string): any[] {
  const filterValue = name.toLowerCase();
  const results = this.currencyList.filter((option: any) => option.currencyName.toLowerCase().includes(filterValue));
  return results.length ? results : this.NoDataCurrency();
}
NoDataCurrency(): any {
  this.QLIvendorValue.controls['currencyId'].setValue('');
  return this.currencyList;
}
displayCurrencyListLabelFn(data: any): string {
  return data && data.currencyName ? data.currencyName : '';
}
currencySelectedOption(data: any) {
  let selectedValue = data.option.value;
  this.selectedCurrencyId = selectedValue.currencyId;
  this.selectedCurrencyname = selectedValue.currencyName;
}
//#endregion currency


//#region vendor Line Item


AddVendorLineItem(){
  const dialogRef = this.dialog.open(QLIVendorValueDetailComponent, {
    data: {
      Load: this.data.cuslineitem,
      currencyId:this.selectedCurrencyId
      
    }, disableClose: true, autoFocus: false
  });
  dialogRef.afterClosed().subscribe(result => {
   if(result!=null){
    this.QVLD.push(result);
    this.QVLD=[...this.QVLD]; 
   }
  });
}

onEdit(Data:any,i:number){
  const dialogRef = this.dialog.open(QLIVendorValueDetailComponent, {
    data: {
      VData: Data,
      mode: 'Edit',
      currencyId:this.selectedCurrencyId
    }, disableClose: true, autoFocus: false
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.QVLD.splice(i, 1);
      this.QVLD.splice(
        i,
        0,
        result
      );
      this.QVLD=[...this.QVLD];
    }
  });
}


onview(Data: any, i: number) {
  const dialogRef = this.dialog.open(QLIVendorValueDetailComponent, {
    data: {
      VData: Data,
      mode: 'view',
      currencyId:this.selectedCurrencyId
    }, disableClose: true, autoFocus: false
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.QVLD.splice(i, 1);
      this.QVLD.splice(
        i,
        0,
        result
      );
      this.QVLD=[...this.QVLD];
    }
  });
}

onDelete(item: any, i: number) {
  if (i !== -1) {
    this.QVLD.splice(i, 1);
    this.QVLD=[...this.QVLD];
  }
}

AddToList(){
  const data:QLIVendorValue={
    ...this.QLIvendorValue.value,
    sourceFromId:this.selectedSourceFromId,
    sourceFrom:this.selectedSourceFromName,
    refNumber:this.selectedrefNumber,
    currencyName:this.selectedCurrencyname,
    refNumberId: this.selectedRefNumberId,
    currencyId: this.selectedCurrencyId,
    quotationLineItemVendorValueDetails:this.QVLD
  }
  
  this.dialogRef.close(data);
}

//#region  close;
close(){
  this.dialogRef.close();
}

}
