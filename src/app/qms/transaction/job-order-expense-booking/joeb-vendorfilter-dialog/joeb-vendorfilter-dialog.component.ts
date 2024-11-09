import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { JOCostBookingDetail, VendorIdbyValue } from '../job-order-expense-booking.model';
import { JobOrderExpenseBookingService } from '../job-order-expense-booking.service';
import { map, Observable, startWith } from 'rxjs';
import { PurchaseQuotationCuvService } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation-cuv.service';
import { PqPrice } from 'src/app/crm/transaction/purchese-quotation/purchase-quotation.model';
import { LowerCasePipe } from '@angular/common';
import { RegionService } from 'src/app/services/qms/region.service';
import Swal from 'sweetalert2';
import { QuotationService } from '../../Quotations/quotation.service';

@Component({
  selector: 'app-joeb-vendorfilter-dialog',
  templateUrl: './joeb-vendorfilter-dialog.component.html',
  styleUrls: ['./joeb-vendorfilter-dialog.component.css', '../../../../ums/ums.styles.css']
})
export class JoebVendorfilterDialogComponent {
  viewMode: boolean=false;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  enquryControl = new FormControl('');
  select = new FormControl();
  JOCostBookingDetail: JOCostBookingDetail[] = [];
  vendorId: any;
  vendorType: any;
  vendorIdbyValue: VendorIdbyValue[];
  filteredvendorIdbyValueListOptions$: Observable<any[]>;
  refNumber: any;
  Id: any;
  selectedValue: any;
  priceDetails: any[];
  vendorpriceDetails: any[] = [];
  sourceFrom: any;
  tableShow: boolean = true;
  vendorTypeId: number;
  lineItem: number;
  selectedItem: any;
  FilterLineItems: any[] = [];

  constructor(
    private UserIdstore: Store<{ app: AppState }>,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogFilter: MatDialogRef<JoebVendorfilterDialogComponent>,
    public dialog: MatDialog,
    private purchaseQuotationCuvService: PurchaseQuotationCuvService,
    private regionService: RegionService, private Qs: QuotationService

  ) { dialogFilter.disableClose = true; }
  ngOnInit() {
    debugger
    this.vendorType = this.data.vendorType;
    this.vendorId = this.data.vendorId;
    this.lineItem = this.data.lineItem;
    this.refNumber = this.data.refNumber;
    this.viewMode = this.data.viewMode;
    if (this.data.sourceFrom) {
      this.sourceFrom = this.data.sourceFrom;
      this.selectedValue = this.sourceFrom;
    }

    if (this.vendorType == 'V') {
      this.vendorTypeId = 2;
    } else if (this.vendorType == 'PV') {
      this.vendorTypeId = 1;
    }
    // this.selectedValue = this.data.vendorType.toLowerCase();
    if (this.selectedValue && this.vendorType && this.vendorId) {
      this.enquryControl.setValue(this.selectedValue);
      this.jobOrderExpenseBookingService.GetVerndorDetails(this.selectedValue, this.vendorTypeId, this.vendorId, this.lineItem).subscribe(res => {
        this.vendorIdbyValue = res;

        if(this.selectedValue === 'Contract'){
          const selectedJobOrderDate = this.data?.costBookingDate;
  
          if (selectedJobOrderDate) {
            const selectedDate = new Date(selectedJobOrderDate);
            selectedDate.setHours(0, 0, 0, 0);
          
            this.vendorIdbyValue = this.vendorIdbyValue.filter((item: any) => {
              const validFromDate = new Date(item.validFrom);
              const validToDate = new Date(item.validTo);
          
              validFromDate.setHours(0, 0, 0, 0);
              validToDate.setHours(0, 0, 0, 0);
          
              return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';
    
            });
  
            // if(this.PQandCdrp?.length === 0 || this.PQandCdrp === null || this.PQandCdrp === undefined){
            //   this.selectedReference = '';
            //   this.jocbdForm.controls['refNumberId'].reset();
            // }
          }
        }

        

        this.vendorIdbyValueFun();
        if (this.refNumber) {
          let getvalue = this.vendorIdbyValue.find(x => x.refNumber == this.refNumber);
          if (getvalue) {
            this.select.setValue(getvalue);
          }
          this.Id = getvalue?.id;

          if (this.selectedValue == 'PQ') {
            this.vendorpriceDetails = [];
            this.tableShow = true;
            this.purchaseQuotationCuvService.getAllPurchaseQuotationById(this.Id).subscribe(res => {
              this.priceDetails = res.pqPrice;
            });
          }
          else if (this.selectedValue == 'Contract') {
            this.priceDetails = [];
            this.tableShow = false;
            const payload = {
              vendorId: this.vendorId,
              lineitemId: this.lineItem
            }
            this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
              this.vendorpriceDetails = res;
            }));
          }

        }
      });
    }
  }

  radioChange(event: any) {
    debugger;
    this.select.reset();
    this.priceDetails = [];
    this.selectedValue = event?.value;
    this.jobOrderExpenseBookingService.GetVerndorDetails(this.selectedValue, this.vendorTypeId, this.vendorId, this.lineItem).subscribe(res => {
      this.vendorIdbyValue = res;
      
      if(this.selectedValue === 'contract'){
        const selectedJobOrderDate = this.data?.costBookingDate;
  
        if (selectedJobOrderDate) {
          const selectedDate = new Date(selectedJobOrderDate);
          selectedDate.setHours(0, 0, 0, 0);
        
          this.vendorIdbyValue = this.vendorIdbyValue.filter((item: any) => {
            const validFromDate = new Date(item.validFrom);
            const validToDate = new Date(item.validTo);
        
            validFromDate.setHours(0, 0, 0, 0);
            validToDate.setHours(0, 0, 0, 0);
        
            return selectedDate >= validFromDate && selectedDate <= validToDate && item?.contractStatus === 'Active';
  
          });

          // if(this.PQandCdrp?.length === 0 || this.PQandCdrp === null || this.PQandCdrp === undefined){
          //   this.selectedReference = '';
          //   this.jocbdForm.controls['refNumberId'].reset();
          // }
        }
      }
      


      this.priceDetails = [];
      this.vendorIdbyValueFun();
    });
  }


  vendorIdbyValueFun() {
    this.filteredvendorIdbyValueListOptions$ = this.select.valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.refNumber)),
      map((name: any) => (name ? this.filteredvendorIdbyValueListOptions(name) : this.vendorIdbyValue?.slice()))
    );
  }
  private filteredvendorIdbyValueListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorIdbyValue.filter((option: any) => option.refNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatavendorIdbyValue();
  }
  NoDatavendorIdbyValue(): any {
    this.select.setValue('');
    return this.vendorIdbyValue;
  }
  displayvendorIdbyValueListLabelFn(data: any): string {
    return data && data.refNumber ? data.refNumber : '';
  }
  vendorIdbyValueListSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.Id = selectedValue.id;
    this.refNumber = selectedValue.refNumber;
    if (this.selectedValue == 'PQ') {
      this.vendorpriceDetails = [];
      this.tableShow = true;
      this.purchaseQuotationCuvService.getAllPurchaseQuotationById(this.Id).subscribe(res => {
        this.priceDetails = res.pqPrice;
      });
    }
    else if (this.selectedValue == 'Contract') {
      this.priceDetails = [];
      this.tableShow = false;
      const payload = {
        vendorId: this.vendorId,
        lineitemId: this.lineItem
      }
      this.Qs.Searchcontractvendorrs(payload).subscribe((res => {
        this.vendorpriceDetails = res;
      }));
      // this.regionService.GetAllVendorById(this.Id).subscribe((res:any)=>{
      //   this.vendorpriceDetails=res?.result?.vendorContractDetailsModal.vendorContractMappingModal;
      //   var Filter = this.vendorpriceDetails.filter(id=>id.aamroLineItemId==this.lineItem);
      //   this.vendorpriceDetails=Filter;

      // });
    }
  }


  // AddtoList() {
  //   this.dialogFilter.close()
  // }
  Close() {
    this.dialogFilter.close();
  }


  //#region  FILTER
  public toggleCheckbox(dataItem: any): void {
    if (this.selectedItem === dataItem) {
      this.selectedItem = null;  // Deselect if the same item is clicked
    } else {
      this.selectedItem = dataItem;  // Select the new item
    }
  }

  public isChecked(dataItem: any): boolean {
    return this.selectedItem === dataItem;
  }

  AddToList() {
    debugger
    if (this.selectedItem != null) {
      const data = {
        seletedItem: this.selectedItem,
        selectedvalue: this.selectedValue,
        selectedrefnumId: this.Id,
        selectedrefnumber:this.refNumber
      }
      this.dialogFilter.close(data);
    } else {
      Swal.fire({
        icon: "info",
        title: "Info!",
        text: "Please select the Line Item",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}
