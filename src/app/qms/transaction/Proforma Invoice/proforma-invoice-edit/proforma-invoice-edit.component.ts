import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProformaInvDetail } from '../proforma-modals';
import { ProformaInvoiceAddComponent } from '../proforma-invoice-add/proforma-invoice-add.component';
import { trimLeadingZeros } from 'src/app/qms/date-validator';

@Component({
  selector: 'app-proforma-invoice-edit',
  templateUrl: './proforma-invoice-edit.component.html',
  styleUrls: ['./proforma-invoice-edit.component.css']
})
export class ProformaInvoiceEditComponent implements OnInit {

  addProformLineItem: ProformaInvDetail = new ProformaInvDetail();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public editDailog: MatDialogRef<ProformaInvoiceAddComponent>) { }


  ngOnInit(): void {
    if (this.data && this.data.list) {
      this.data.list["rowNumber"] = this.data.rowNumber;

      this.PILineItemForm.patchValue({
        JobNumberConrol: this.data?.list?.jobOrderNumber,
        JobDate: this.data?.list?.jobOrderDate,
        LineItemCode: this.data?.list?.lineItemCode,
        LineItemDesc: this.data?.list?.lineItemName,
        LineItemCate: this.data?.list?.lineItemCategoryName,
        AliasName: this.data?.list?.aliasName,
        Region: this.data?.list?.regionName,
        calculationParameter: this.data?.list?.calculationParameter,
        calculationType: this.data?.list?.calculationType,
        UnitCustomerCurrency: this.data?.list?.unitPrice,
        sapInvoiceUnitPrice: this.data?.list?.sapInvoiceUnitPrice,
        quantity: this.data?.list?.quantity,
        tax: this.data?.list?.taxPer,
        taxValue: this.data?.list?.taxValue,
        NetPayableinCompanyCurrency: this.data?.list?.totalinCompanyCurrency,
        NetPayableinCustomerCurrency: this.data?.list?.totalinCustomerCurrency,
        invoiceAmount: this.data?.list?.invoiceAmount,
        Remarks: this.data?.list?.remarks,
      })
    }

    if(this.data?.view){
      this.PILineItemForm.disable();
    }
  }

  PILineItemForm = new FormGroup({
    JobNumberConrol: new FormControl({ value: '', disabled: true }),
    JobDate: new FormControl({ value: '', disabled: true }),
    LineItemCode: new FormControl({ value: '', disabled: true }),
    LineItemDesc: new FormControl({ value: '', disabled: true }),
    LineItemCate: new FormControl({ value: '', disabled: true }),
    AliasName: new FormControl(''),
    Region: new FormControl({ value: '', disabled: true }),
    calculationParameter: new FormControl({ value: '', disabled: true }),
    calculationType: new FormControl({ value: '', disabled: true }),
    UnitCustomerCurrency: new FormControl({ value: '', disabled: true }),
    sapInvoiceUnitPrice: new FormControl({ value: '', disabled: true }),
    quantity: new FormControl({ value: '', disabled: true }),
    tax: new FormControl({ value: '', disabled: true }),
    taxValue: new FormControl({ value: '', disabled: true }),
    NetPayableinCustomerCurrency: new FormControl({ value: '', disabled: true }),
    NetPayableinCompanyCurrency: new FormControl({ value: '', disabled: true }),
    invoiceAmount: new FormControl('', [Validators.min(0)]),
    Remarks: new FormControl(''),
  })

  onInputChange() {
    const netPayable: any = this.PILineItemForm.get('NetPayableinCustomerCurrency')?.value;
    const invoiceAmountControl: any = this.PILineItemForm.get('invoiceAmount');
  
    if (invoiceAmountControl) {
      const invoiceAmount = +invoiceAmountControl.value;
  
      if (invoiceAmount < 0) {
        invoiceAmountControl.setErrors({ negativeAmount: true });
      }
      else if (invoiceAmount > netPayable) {
        invoiceAmountControl.setErrors({ amountExceeded: true });
      } 
      else {
        invoiceAmountControl.setErrors(null);
      }
    }
  }
  

  trimDecimalField(event: any, controlName: string): void {
    let inputValue = event.target.value;
    if (inputValue.startsWith('-')) {
      inputValue = inputValue.substring(1);
    }
    inputValue = this.trimLeadingZeros(inputValue);
    this.PILineItemForm.get(controlName)?.setValue(inputValue, { emitEvent: false });
  }

  trimLeadingZeros(value: string): string {
    return value.replace(/^0+(?!\.)/, '');
  }

  Add() {
    debugger;
    if (this.PILineItemForm.invalid) {
      this.PILineItemForm.markAllAsTouched();
    } else {
      let invoice:any = this.PILineItemForm.controls['invoiceAmount']?.value;
      this.data.list["proformaInvDetailId"] = +this.data?.proformaInvDetailId ? +this.data?.proformaInvDetailId : 0,
      this.data.list["aliasName"] = this.PILineItemForm.controls.AliasName.value;
      //this.data.list["invoiceAmtinCusCurr"].value;
      if (this.PILineItemForm.controls['invoiceAmount']) {
        this.data.list["invoiceAmount"] = parseFloat(invoice);
      }
      this.data.list["remarks"] = this.PILineItemForm.controls.Remarks.value
      this.data.list["updatedBy"] = this.data?.createdBy,
      this.data.list["createdBy"] = this.data?.createdBy,


      this.editDailog.close( this.data.list);
    }

  }

  close(){
    this.editDailog.close()
  }
}
