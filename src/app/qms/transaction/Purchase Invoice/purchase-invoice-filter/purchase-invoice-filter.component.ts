import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { ProformaInvoiceAddComponent } from '../../Proforma Invoice/proforma-invoice-add/proforma-invoice-add.component';
import { PIService } from '../pi.service';
import { PILineItemDetail } from '../purchase-invoice-modals';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { AddPurchaseInvoiceComponent } from '../add-purchase-invoice/add-purchase-invoice.component';
import { QuotationService } from '../../Quotations/quotation.service';
import { Exchange } from '../../Quotations/quotation-model/quote';
import { CurrenciesService } from 'src/app/ums/masters/currencies/currencies.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import Swal from 'sweetalert2';

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
  selector: 'app-purchase-invoice-filter',
  templateUrl: './purchase-invoice-filter.component.html',
  styleUrls: ['./purchase-invoice-filter.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PurchaseInvoiceFilterComponent {
  JobOrderNumberList: any[] = [];
  PIFilterList: any[] = [];
  PIFilterLineItemList: any[] = [];
  pageSize = 10;
  skip = 0;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = false;
  public selectedDataItem: any;
  date = new Date();
  show1Table: boolean = true;
  show2Table: boolean = false;
  selectedJOIds: any[] = [];
  selectedSource: string[] = [];
  selectedLineItem: any[] = [];
  LineItems: any[] = [];
  vendorId: any;
  currencyId: any;
  companycurrency:Currency;
  PIFilterList1: any[]=[];
  selectedlineitem: any[]=[];

  constructor(private regionService: RegionService, private PIService: ProformaInvoiceService, private PI: PIService, @Inject(MAT_DIALOG_DATA) public data: any,
    public filterDailog: MatDialogRef<AddPurchaseInvoiceComponent>,private Qs: QuotationService, private currencyS: CurrenciesService) { }

  ngOnInit(): void {
    this.getAllJobOrderList();
    this.vendorId = this.data.vendorId;
    this.currencyId = this.data.currencyId;
    this.getCompanyCurrency();
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
      vendorId: this.vendorId
    };


    this.PI.getFilterJoList(filterPayload).subscribe((res: any) => {
      this.PIFilterList1 = res;
      // Filter the list based on source
      const sourceZeroItems = this.PIFilterList1.filter(item => item.source === 0);
      const sourceOneItems = this.PIFilterList1.filter(item => item.source === 1);
    
      // Check for source = 0 and show Swal
      if (sourceZeroItems.length > 0 && sourceOneItems.length > 0) {
        const jobOrderDetails = sourceOneItems.map(item => `${item.jobOrderNumber} - ${item.lineItemName}`).join(', ');
        Swal.fire({
          title: 'Job Orders has no Expense booking Do you want to proceed?',
          text: `Job Order Numbers and Line Items:${jobOrderDetails}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText:'No',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            const payload ={
              ...filterPayload,
              yesnoFlag:true
            }
            this.PI.getFilterPIJoListConfirm(payload).subscribe((res: any) => {
              this.PIFilterList = res;
              console.log("this.PIFilterList",this.PIFilterList)
            });
            this.PIFilterList = this.PIFilterList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
          }else{
            const payload ={
              ...filterPayload,
              yesnoFlag:false
            }
            this.PI.getFilterPIJoListConfirm(payload).subscribe((res: any) => {
              this.PIFilterList = res;
            });
            this.PIFilterList = this.PIFilterList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
          }
        });
      }else if(sourceZeroItems.length > 0){
        const payload ={
          ...filterPayload,
          yesnoFlag:false
        }
        this.PI.getFilterPIJoListConfirm(payload).subscribe((res: any) => {
          this.PIFilterList = res;
        });
        this.PIFilterList = this.PIFilterList.map(item => {
          return {
            ...item,
            jobOrderDate: new Date(item.jobOrderDate),
          };
        });
      }else if(sourceOneItems.length > 0){
        const jobOrderDetails = sourceOneItems.map(item => `${item.jobOrderNumber} - ${item.lineItemName}`).join(', ');
        Swal.fire({
          title: 'Job Orders has no Expense booking Do you want to proceed?',
          text: `Job Order Numbers and Line Items: ${jobOrderDetails}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText:'No',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            const payload ={
              ...filterPayload,
              yesnoFlag:true
            }
            this.PI.getFilterPIJoListConfirm(payload).subscribe((res: any) => {
              this.PIFilterList = res;
              console.log("this.PIFilterList",this.PIFilterList)
            });
            this.PIFilterList = this.PIFilterList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
          }else{
            const payload ={
              ...filterPayload,
              yesnoFlag:false
            }
            this.PI.getFilterPIJoListConfirm(payload).subscribe((res: any) => {
              this.PIFilterList = res;
            });
            this.PIFilterList = this.PIFilterList.map(item => {
              return {
                ...item,
                jobOrderDate: new Date(item.jobOrderDate),
              };
            });
          }
        });
      }
      
     
    });
    

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
    })
  }

  public onSelectionChange(event: any): void {
    if (event.selectedRows.length > 0) {
      event.selectedRows?.forEach((row: any) => {
        const selectedJobOrderId = row.dataItem.jobOrderId;
        const selectedSource = row.dataItem.source;
        const selectelineitem = row.dataItem.lineItemId
        if (this.selectedJOIds.indexOf(selectedJobOrderId) === -1) {
          this.selectedJOIds.push(selectedJobOrderId);
          this.selectedSource.push(selectedSource);
          this.selectedlineitem.push(selectelineitem);
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      event.deselectedRows?.forEach((row: any) => {
        const deselectedJobOrderId = row.dataItem.jobOrderId;
        const index = this.selectedJOIds.indexOf(deselectedJobOrderId);
        const deselectedJsource = row.dataItem.source;
        const index1 = this.selectedSource.indexOf(deselectedJsource);
        const deselectedJlineitem = row.dataItem.lineItemId;
        const index2 = this.selectedSource.indexOf(deselectedJlineitem);
        if (index !== -1) {
          this.selectedJOIds.splice(index, 1);
          this.selectedSource.splice(index1, 1);
          this.selectedlineitem.splice(index2,1);
        }
      });
    }
  }


  next() {
    this.show1Table = false;
    this.show2Table = true;
    let payload = {
      jobOrderIds: this.selectedJOIds,
      sources:this.selectedSource,
      vendorId: this.vendorId,
      lineItemId:this.selectedlineitem
    }
    console.log("payloadjhgyj",payload)
    this.PI.getJOLineItems(payload).subscribe((res: any) => {
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
    debugger;
    if (event.selectedRows.length > 0) {
      this.selectedDataItem = event.selectedRows[0].dataItem;
      event.selectedRows?.forEach((row: any) => {
        const selectedJobOrder = row.dataItem;
        if (this.selectedLineItem.indexOf(selectedJobOrder) === -1) {
          this.selectedLineItem.push(selectedJobOrder);
        }
      });
    }

    if (event.deselectedRows.length > 0) {
      debugger;
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
    debugger;
    console.log("this.selectedLineItem", this.selectedLineItem);
  
    const observables = this.selectedLineItem.map(PI =>
      this.PI.GetAllJobOrderExpenseandJoborderByJobOrderId(PI.jobOrderId, PI.lineItemId, this.currencyId, PI.source)
    );
  
    forkJoin(observables).subscribe((results: any[]) => {
      
      const conversionObservables = results.map((res, index) => {
        const PI = this.selectedLineItem[index];
  
        if (res[0].currencyId != null) {
          const payload1: Exchange = {
            fromCurrencyId: res[0].currencyId,
            toCurrencyId: this.currencyId,
            value: res[0].minValue !== null ? res[0].minValue : 0,
          };
          const minValueConversion$ = this.Qs.CurrencyExchanges(payload1);
  
          const payload2: Exchange = {
            fromCurrencyId: res[0].currencyId,
            toCurrencyId: this.currencyId,
            value: res[0].totalInVendorCurrency
          };
          const totalInVendorCurrencyConversion$ = this.Qs.CurrencyExchanges(payload2);
  
          return totalInVendorCurrencyConversion$.pipe(
            switchMap(totalInVendorCurrency => {
              const payload3: Exchange = {
                fromCurrencyId: this.currencyId,
                toCurrencyId: this.companycurrency.currencyId,
                value: totalInVendorCurrency.convertedValue // Use the converted value here
              };
  
              const totalInCompanyCurrencyConversion$ = this.Qs.CurrencyExchanges(payload3);
  
              return forkJoin([minValueConversion$, totalInCompanyCurrencyConversion$]).pipe(
                map(([minValueInCompanyCurrency, totalInCompanyCurrency]) => ({
                  ...res[0],
                  minValueInVendorCurrency: minValueInCompanyCurrency.convertedValue, // Converted min value
                  totalInVendorCurrency: totalInVendorCurrency.convertedValue, // Already converted vendor total
                  totalInCompanyCurrency: totalInCompanyCurrency.convertedValue, // Converted company total
                  exchangeRate: totalInCompanyCurrency.exchangeRate, // Exchange rate for company currency
                  selectedLineItem: PI
                }))
              );
            })
          );
        } else {
          // Return an empty observable if no conversion is needed
          return of(null);
        }
      }).filter(obs => obs !== null); // Filter out any null observables
  
      forkJoin(conversionObservables).subscribe((updatedResults: any[]) => {
        updatedResults.forEach((updatedRes, index) => {
          const PI = updatedRes.selectedLineItem;
  
          const Pis: PILineItemDetail = {
            purchaseInvDetailId: 0,
            purchaseInvoiceId: 0,
            joLineitemId: PI.lineItemId,
            regionId: updatedRes.regionId || null,
            sourceFromId: 0,
            currencyId: updatedRes.currencyId,
            calculationParameterId: updatedRes.calculationParameterId || null,
            calculationTypeId: updatedRes.calculationTypeId || null,
            rate: updatedRes.rate,
            quantity: updatedRes.quantity,
            value: updatedRes.value,
            taxId: updatedRes.taxId || null,
            taxValue: updatedRes.taxValue,
            minValueInVendorCurrency: updatedRes.minValueInVendorCurrency,
            exchangeRate: updatedRes.exchangeRate,
            createdBy: 0,
            createdDate: this.date,
            updatedBy: 0,
            updatedDate: this.date,
            jobOrderId: PI.jobOrderId,
            jobOrderNumber: PI.jobOrderNumber,
            lineItemName: updatedRes.lineItemName,
            lineItemCategoryName: updatedRes.lineItemCategoryName,
            lineItemCode: updatedRes.lineItemCode,
            companyName: updatedRes.companyName,
            regionName: updatedRes.regionName,
            countryName: updatedRes.countryName,
            calculationParameter: updatedRes.calculationParameter,
            calculationType: updatedRes.calculationType,
            taxCodeName: updatedRes.taxCodeName,
            currencyName: updatedRes.currencyName,
            taxPer: updatedRes.taxPer,
            totalInVendorCurrency: updatedRes.totalInVendorCurrency,
            totalInCompanyCurrency: updatedRes.totalInCompanyCurrency,
            refNumber: '',
            jobOrderDate: PI.jobOrderDate,
            joCostBookingId: updatedRes.joCostBookingId || null,
          };
          this.LineItems.push(Pis);
        });
  
        if (this.LineItems.length > 0) {
          console.log("this.LineItems", this.LineItems);
          this.filterDailog.close(this.LineItems);
        }
      });
    });
  }
  
  
  Close() {
    this.filterDailog.close();
  }

  getCompanyCurrency() {
    this.currencyS.GetCurrencyByCompanyCurrency().subscribe((res => {
      this.companycurrency = res[0];
      console.log("this.companycurrency = res;", this.companycurrency)
    }));
  }

}
