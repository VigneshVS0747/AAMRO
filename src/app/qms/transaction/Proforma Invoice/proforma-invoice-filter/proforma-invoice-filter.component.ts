import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { ProformaInvoiceAddComponent } from '../proforma-invoice-add/proforma-invoice-add.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Exchange } from '../../Quotations/quotation-model/quote';

export const MY_FORMATS = {
  parse: {
    dateInput: ['DD/MM/YYYY', 'DD/MMM/YYYY'] as any,
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-proforma-invoice-filter',
  templateUrl: './proforma-invoice-filter.component.html',
  styleUrls: ['./proforma-invoice-filter.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ProformaInvoiceFilterComponent implements OnInit {

  JobOrderNumberList: any[] = [];
  PIFilterList: any[] = [];
  PIFilterLineItemList: any[] = [];
  pageSize = 10;
  skip = 0;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = false;
  public selectedDataItem: any;

  show1Table: boolean = true;
  show2Table: boolean = false;
  selectedJOIds: string[] = [];
  selectedLineItem: any[] = [];
  LineItemDetails: any[] = [];
  customerId: any;

  constructor(private regionService: RegionService, private PIService: ProformaInvoiceService, 
    public filterDailog: MatDialogRef<ProformaInvoiceFilterComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.customerId=this.data.customerId;
    this.getAllJobOrderList();
  }

  PIFilterForm = new FormGroup({
    fromDate: new FormControl('', [Validators.required]),
    toDate: new FormControl('', [Validators.required]),
    JobNumberControl: new FormControl([]),
    ref12Conrol: new FormControl(''),
  },
    {
      validators: DateValidatorService.dateRangeValidator('fromDate', 'toDate')
    })

  get f() {
    return this.PIFilterForm.controls;
  }

  onInputChange(event: any): void {
    const inputValue: string = event.target.value;
    const sanitizedValue: string = inputValue.replace(/\s+/g, '');
  
    this.PIFilterForm.get('ref12Conrol')?.setValue(sanitizedValue, { emitEvent: false });
  }
  
  

  find() {

    if (this.PIFilterForm.controls.JobNumberControl.value?.length === 0) {
      this.PIFilterForm.controls.JobNumberControl?.setValue(null)
    }
    const filterPayload = {
      fromDate: this.normalizeDateToUTC(this.PIFilterForm.controls.fromDate.value),
      toDate: this.normalizeDateToUTC(this.PIFilterForm.controls.toDate.value),
      jobOrderIds: this.PIFilterForm.controls.JobNumberControl.value || null,
      referenceNumber: this.PIFilterForm.controls.ref12Conrol.value || null,
      referenceNumber2: null,
      mawbNumber: null,
      mblNumber: null,
      vendorId:this.customerId
    };


    this.PIService.getFilterJoList(filterPayload).subscribe((res: any) => {
      this.PIFilterList = res;
      this.PIFilterList = this.PIFilterList.map(item => {
        return {
          ...item,
          jobOrderDate: new Date(item.jobOrderDate),
        };
      });
    })

  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getAllJobOrderList() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.JobOrderNumberList = res;
      this.JobOrderNumberList = this.JobOrderNumberList?.filter(option => option?.customerId === this.customerId);
    })
  }

  

  public onSelectionChange(event: any): void {
    if (event.selectedRows.length > 0) {
      event.selectedRows?.forEach((row: any) => {
        const selectedJobOrderId = row.dataItem.jobOrderId;
        if (this.selectedJOIds.indexOf(selectedJobOrderId) === -1) {
          this.selectedJOIds.push(selectedJobOrderId);
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows?.forEach((row: any) => {
        const deselectedJobOrderId = row.dataItem.jobOrderId;
        const index = this.selectedJOIds.indexOf(deselectedJobOrderId);
        if (index !== -1) {
          this.selectedJOIds.splice(index, 1);
        }
      });
    }
  }


  next() {
    this.show1Table = false;
    this.show2Table = true;
    let payload = {
      jobOrderIds: this.selectedJOIds,
      vendorId: this.customerId
    }
    this.PIService.getJOLineItems(payload).subscribe((res: any) => {
      console.log(res)
      this.PIFilterLineItemList = res;
      this.PIFilterLineItemList = this.PIFilterLineItemList.map(item => {
        return {
          ...item,
          jobOrderDate: new Date(item.jobOrderDate),
        };
      });
    })
  }

  public on2Change(event: any): void {
    if (event.selectedRows.length > 0) {
      event.selectedRows?.forEach((row: any) => {
        const selectedJobOrder = row.dataItem;
        if (this.selectedLineItem.indexOf(selectedJobOrder) === -1) {
          this.selectedLineItem.push(selectedJobOrder);
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows?.forEach((row: any) => {
        const deselectedJobOrder = row.dataItem;
        const index = this.selectedLineItem.indexOf(deselectedJobOrder);
        if (index !== -1) {
          this.selectedLineItem.splice(index, 1);
        }
      });
    }

    console.log(this.selectedLineItem)
  }

  add() {
    const requests: any[] = [];

    this.selectedLineItem?.forEach(item => {
      let payload = {
        jobOrderId: item?.jobOrderId,
        lineItemId: item?.lineItemId
      };

      let joNumber = item?.jobOrderNumber;
      let jobOrderDate = item?.jobOrderDate;
      let aliasName = item?.aliasName;

      const request = this.PIService.getLIDetailsbyLIdandJoId(payload).toPromise().then((res: any) => {
        console.log("ressssssssssssssssss",res);
        debugger
        // const payload: Exchange = {
        //   fromCurrencyId:   this.currencyId,
        //   toCurrencyId: this.FromcurrencyId,
        //   value: this.selectedvalueCustomercurrency
        // };
  
        // // Perform first API call and wait for response
        // this.Qs.CurrencyExchanges(payload).pipe(
        //   first(),
        //   switchMap((res) => {
        //     this.exchangecurrency = res;
        //     this.cusexchange = this.exchangecurrency.exchangeRate;
  
        //     // Set the customer exchange rate and value in customer currency
        //     this.QLineItem.controls['customerExchangeRate'].setValue(this.exchangecurrency.exchangeRate);
        //     this.QLineItem.controls['valueInCustomerCurrency'].setValue(this.exchangecurrency.convertedValue);
  
        //     // If valueInCustomerCurrency is set, make the next API call
        //     if (this.QLineItem.controls['valueInCustomerCurrency'].value != null) {
        //       const payload1: Exchange = {
        //         fromCurrencyId: this.FromcurrencyId,
        //         toCurrencyId: this.companycurrency.currencyId,
        //         value: this.QLineItem.controls['valueInCustomerCurrency'].value
        //       };
        //       console.log("payload1", payload1);
  
        //       return this.Qs.CurrencyExchanges(payload1).pipe(first());
        //     } else {
        //       return []; // If no value in customer currency, skip to next step
        //     }
        //   })
        // ).subscribe((res1) => {
        //   if (res1) {
        //     this.valueInCompanyCurrency = res1;
        //     console.log(" this.comp1", this.valueInCompanyCurrency);
        //     this.QLineItem.controls['valueInCompanyCurrency'].setValue(this.valueInCompanyCurrency.convertedValue);
        //   }
        
        // if (res && res.length > 0) {
        //   let newItem = {
        //     proformaInvDetailId: this.data?.proformaInvDetailId || 0,
        //     proformaInvoiceId: +this.data?.ProformaInvoiceId || 0,
        //     revenueLineitemId: +res?.[0]?.lineItemId || 0,
        //     jobOrderId: res?.[0]?.jobOrderId || 0,
        //     invoiceAmtinCusCurr: +res?.[0]?.totalinCustomerCurrency || 0,
        //     exchangeRate: +this.data?.exchangeRate || 0,
        //     invoiceAmtinComCurr: +res?.[0]?.totalinCompanyCurrency || 0,
        //     createdBy: this.data?.createdBy,
        //     updatedBy: this.data?.createdBy,

        //     jobOrderNumber: joNumber,
        //     jobOrderDate: jobOrderDate,
        //     lineItemCode: res?.[0]?.lineItemCode,
        //     lineItemName: res?.[0]?.lineItemName,
        //     lineItemCategoryName: res?.[0]?.lineItemCategoryName,
        //     aliasName: aliasName,
        //     regionName: res?.[0]?.regionName,
        //     calculationParameter: res?.[0]?.calculationParameter,
        //     calculationType: res?.[0]?.calculationType,
        //     unitPrice: res?.[0]?.unitPrice,
        //     sapInvoiceUnitPrice: res?.[0]?.sapInvoiceUnitPrice,
        //     quantity: res?.[0]?.quantity,
        //     taxPer: res?.[0]?.taxPer,
        //     taxValue: res?.[0]?.taxValue,
        //     totalinCompanyCurrency: parseFloat(res?.[0]?.totalinCompanyCurrency),
        //     totalinCustomerCurrency: parseFloat(res?.[0]?.totalinCustomerCurrency),
        //     invoiceAmount: parseFloat(res?.[0]?.invoiceAmount),
        //     remarks: res?.[0]?.remarks || null,
        //   };
        //   this.LineItemDetails = this.LineItemDetails || [];
        //   this.LineItemDetails.push(newItem);
        // }
        if (res && res.length > 0) {
          const newItems = res.map((item: any) => ({
            proformaInvDetailId: this.data?.proformaInvDetailId || 0,
            proformaInvoiceId: +this.data?.ProformaInvoiceId || 0,
            revenueLineitemId: +item?.lineItemId || 0,
            jobOrderId: item?.jobOrderId || 0,
            invoiceAmtinCusCurr: +item?.totalinCustomerCurrency || 0,
            exchangeRate: +this.data?.exchangeRate || 0,
            invoiceAmtinComCurr: +item?.totalinCompanyCurrency || 0,
            createdBy: this.data?.createdBy,
            updatedBy: this.data?.createdBy,
        
            jobOrderNumber: joNumber,
            jobOrderDate: jobOrderDate,
            lineItemCode: item?.lineItemCode,
            lineItemName: item?.lineItemName,
            lineItemCategoryName: item?.lineItemCategoryName,
            aliasName: aliasName,
            regionName: item?.regionName,
            calculationParameter: item?.calculationParameter,
            calculationType: item?.calculationType,
            unitPrice: item?.unitPrice,
            sapInvoiceUnitPrice: item?.sapInvoiceUnitPrice,
            quantity: item?.quantity,
            taxPer: item?.taxPer,
            taxValue: item?.taxValue,
            totalinCompanyCurrency: parseFloat(item?.totalinCompanyCurrency),
            totalinCustomerCurrency: parseFloat(item?.totalinCustomerCurrency),
            invoiceAmount: parseFloat(item?.invoiceAmount),
            remarks: item?.remarks || null,
          }));
        
          // Initialize the array if it's undefined and then push all new items
          this.LineItemDetails = this.LineItemDetails || [];
          Array.prototype.push.apply(this.LineItemDetails, newItems);  
        }
      });

      requests.push(request);
    });

    Promise.all(requests).then(() => {
      console.log(this.LineItemDetails);
      this.filterDailog.close(this.LineItemDetails);
    }).catch(error => {
      console.error("Error processing line items:", error);
      this.filterDailog.close(this.LineItemDetails);
    });
  }


  Close() {
    this.filterDailog.close();
  }
}
