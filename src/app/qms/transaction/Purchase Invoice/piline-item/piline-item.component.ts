import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { TaxCode } from 'src/app/crm/master/taxcode/taxcode.model';
import { CalculationParameters, CalculationTypes, DefaultSettings, groupCompany, sourceFrom } from 'src/app/Models/crm/master/Dropdowns';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { Country } from 'src/app/ums/masters/countries/country.model';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { VendorFilter } from '../../job-order-expense-booking/job-order-expense-booking.model';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { JobOrderExpenseBookingService } from '../../job-order-expense-booking/job-order-expense-booking.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuotationService } from '../../Quotations/quotation.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Store } from '@ngrx/store';
import { JobOrderExpenseBookingDialogComponent } from '../../job-order-expense-booking/job-order-expense-booking-dialog/job-order-expense-booking-dialog.component';
import Swal from 'sweetalert2';
import { PIService } from '../pi.service';
import { PILineItemDetail } from '../purchase-invoice-modals';
import { JobOrderRevenueBookingService } from '../../Job-Order-Revenue/Job-order-revenue.service';
import { changeExchange, Exchange } from '../../Quotations/quotation-model/quote';

@Component({
  selector: 'app-piline-item',
  templateUrl: './piline-item.component.html',
  styleUrls: ['./piline-item.component.css','../../../../ums/ums.styles.css']
})
export class PIlineItemComponent {
  userId$: string;
  PILineItemForm: FormGroup;
  date = new Date();
  viewMode: boolean = false;
  LiveStatus = 1;
  lineItemCtgDatalist: lineitem[];
  filteredLineItemCtgOptions$: Observable<any[]>;
  categoryId: any;
  lineItemCategoryName: any;
  LineItemMaster: any[] = [];
  enablevendor: boolean;
  taxcodelist: TaxCode[];
  filteredTaxCodeOptions$: Observable<any[]>;
  taxId: any;
  taxCodeName: any;
  taxPer: any;
  filteredCountryOptions$: Observable<any[]>;
  CountryDatalist: Country[];

  serviceInId: any;
  filteredLineItemOptions$: Observable<any[]>;
  lineItemList: any[];
  lineItemCode: any;
  lineItemCategoryId: any;
  lineItemName: any;
  CalculationTyplist: CalculationTypes[];
  CalculationParlist: CalculationParameters[];
  filteredCalculationParOptions$: Observable<any[]>;
  filteredCalculationTypeOptions$: Observable<any[]>;
  calculationParameterId: any;
  calculationParameter: any;
  calculationTypeId: any;
  calculationType: any;
  regionList: any[];
  regionId: any;
  filteredRegionOptions$: Observable<any[]>;
  sourceList: sourceFrom[];
  filteredSourceOptions$: Observable<any[]>;
  sourceFromId: any;
  sourceFrom: any;
  filteredCurrencyListOptions$: any;
  currencyList: Currency[];
  currencyId: any;
  filteredgroupCompanyListOptions$: Observable<any[]>;
  groupCompanyList: groupCompany[];
  groupCompanyId: any;
  vendorList: VendorFilter[];
  filteredvendorListOptions$: Observable<any[]>;
  vendorId: any;
  vendorName: any;
  companyName: any;
  regionName: any;
  currencyName: any;
  joLineitemId: any;
  vendorType: any;
  totalInCompanyCurrency: any;
  filterReferenceNumber: any;
  countryName: any;
  joList: any[]=[];
  filteredJobOrderOptions$: any;
  jobOrderId: any;
  selectedLineItem: any;
  jobOrderNumber: any;
  lineItemListnew: any[];
  jobDate: any;
  lineItemListFiltered: any[];
  Exchange: any;
  totalInVendorCurrency: any;
  jobcostingBookingId: any;
  calculationTypeReadonly: boolean;
  quantityfromJO: string;
  quantitys: number;
  convert: changeExchange;
  defaultSettingsValues: DefaultSettings[];


  constructor(
    private fb: FormBuilder,
    private lineIetmService: LineitemmasterService,
    private jobOrderExpenseBookingService: JobOrderExpenseBookingService,
    private commonService: CommonService,
    private regionService: RegionService,
    public dialogFilter: MatDialog,
    private quotationService: QuotationService,
    private UserIdstore: Store<{ app: AppState }>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: LineitemmasterService,
    public dialogRef: MatDialogRef<PIlineItemComponent>,private PIS:PIService,
    private jobOrderRevenueBookingService: JobOrderRevenueBookingService,private Qs: QuotationService


  ) { dialogRef.disableClose = true; }
  ngOnInit() {
    this.GetUserId();
    this.iniForm();
    this.GetLineItem();
   // this.getAllSource();
    //this.getCurrencyList();
    //this.GetAllGroupCompany();
    this.GetAllCalculationParameter();
    this.GetAllCalculationType();
    this.getAllRegion();
    this.getTaxCode();
    //this.getServiceIn();
    this.GetAllJobOrder();
    this.Exchange = this.data.Exchange;
    this.currencyId = this.data.currencyId;
    this.PILineItemForm.controls['exchangeRate'].setValue(this.Exchange);
    this.EditMode();

  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  EditMode() {
    if (this.data.mode == 'Edit') {
      this.PILineItemForm.patchValue(this.data.LineData);
      if (this.data.LineData.isVendor == true) {
        this.enablevendor = true;
        this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
          this.vendorList = res;
          this.vendorFun();
          var data = this.vendorList.find(x => x.vendorId == this.data.LineData.vendorId)
          this.PILineItemForm.controls['vendorId'].setValue(data);
          this.vendorType = data?.vendorType;
        });
      } else {
        this.enablevendor = false;
        this.vendorList = [];
        this.vendorId = null;
      }

      this.PILineItemForm.controls['jobOrderId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['joLineitemId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['calculationParameterId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['calculationTypeId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['taxId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['regionId'].setValue(this.data.LineData);
      //this.PILineItemForm.controls['joCostBookingId'].setValue(this.data.LineData);
      this.calculationTypeReadonly=true;
      this.jobcostingBookingId = this.data.LineData.joCostBookingId;


      this.lineItemCategoryName = this.data.LineData.lineItemCategoryName;
      this.lineItemCategoryId = this.data.LineData.lineItemCategoryId;

      this.lineItemCode = this.data.LineData.lineItemCode;

      this.lineItemName = this.data.LineData.lineItemName;
      this.joLineitemId = this.data.LineData.joLineitemId;
  
      this.regionId = this.data.LineData.regionId;
      this.regionName = this.data.LineData.regionName;


      this.calculationParameter = this.data.LineData.calculationParameter;
      this.calculationParameterId = this.data.LineData.calculationParameterId;

      this.calculationType = this.data.LineData.calculationType;
      this.calculationTypeId = this.data.LineData.calculationTypeId;

      this.taxCodeName = this.data.LineData.taxCodeName;
      this.taxId = this.data.LineData.taxId;
      this.taxPer= this.data.LineData.taxPer;

      this.jobOrderId = this.data.LineData.jobOrderId;
      this.jobOrderNumber = this.data.LineData.jobOrderNumber;
      this.getjobdisc();
      // this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,0).subscribe((res=>{
      //   this.lineItemList=res;
  
      //   console.log("ressrteragerger",res);
      //   this.lineItemFun();
      // }));

      // this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,this.joLineitemId).subscribe((res=>{
      //   this.selectedLineItem = res[0];
      //   this.PILineItemForm.patchValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['joLineitemId'].setValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['calculationParameterId'].setValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['calculationTypeId'].setValue( this.selectedLineItem);
      //   this.PILineItemForm.controls['taxId'].setValue( this.selectedLineItem);
      //   this.PILineItemForm.controls['regionId'].setValue( this.selectedLineItem);
      //   this.PILineItemForm.controls['taxPer'].setValue( this.selectedLineItem.taxPer);
   
   
      //   this.lineItemCategoryName =  this.selectedLineItem.lineItemCategoryName;
      //   this.lineItemCode =  this.selectedLineItem.lineItemCode;
      //   this.lineItemName =  this.selectedLineItem.lineItemName;
      //   this.joLineitemId =  this.selectedLineItem.joLineitemId;
    
      //   this.regionId =  this.selectedLineItem.regionId;
      //   this.regionName =  this.selectedLineItem.regionName;
   
   
      //   this.calculationParameter =  this.selectedLineItem.calculationParameter;
      //   this.calculationParameterId =  this.selectedLineItem.calculationParameterId;
   
      //   this.calculationType =  this.selectedLineItem.calculationType;
      //   this.calculationTypeId =  this.selectedLineItem.calculationTypeId;
   
      //   this.taxCodeName =  this.selectedLineItem.taxCodeName;
      //   this.taxId =  this.selectedLineItem.taxId;
      //  }));
   

    }
    else if (this.data.mode == 'view') {
      this.viewMode = true;
      this.PILineItemForm.disable();

      this.PILineItemForm.patchValue(this.data.LineData);
      this.PILineItemForm.controls['jobOrderId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['joLineitemId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['calculationParameterId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['calculationTypeId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['taxId'].setValue(this.data.LineData);
      this.PILineItemForm.controls['regionId'].setValue(this.data.LineData);
      this.calculationTypeReadonly=true;
      this.lineItemCategoryName = this.data.LineData.lineItemCategoryName;
      this.lineItemCode = this.data.LineData.lineItemCode;
      this.lineItemName = this.data.LineData.lineItemName;
      this.joLineitemId = this.data.LineData.joLineitemId;

      this.jobcostingBookingId = this.data.LineData.joCostBookingId;

      this.lineItemCategoryName = this.data.LineData.lineItemCategoryName;
      this.lineItemCategoryId = this.data.LineData.lineItemCategoryId;

      this.jobOrderId = this.data.LineData.jobOrderId;
      this.jobOrderNumber = this.data.LineData.jobOrderNumber;

      this.regionId = this.data.LineData.regionId;
      this.regionName = this.data.LineData.regionName;

      this.calculationParameter = this.data.LineData.calculationParameter;
      this.calculationParameterId = this.data.LineData.calculationParameterId;

      this.calculationType = this.data.LineData.calculationType;
      this.calculationTypeId = this.data.LineData.calculationTypeId;

      this.taxCodeName = this.data.LineData.taxCodeName;
      this.taxId = this.data.LineData.taxId;
      this.taxPer  =   this.data.LineData.taxPer;


      // this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,0).subscribe((res=>{
      //   this.lineItemList=res;
  
      //   console.log("ressrteragerger",res);
      //   this.lineItemFun();
      // }));

      // this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,this.joLineitemId).subscribe((res=>{
      //   this.selectedLineItem = res[0];
      //   console.log("this.selectedLineItem",this.selectedLineItem);
      //   this.PILineItemForm.patchValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['joLineitemId'].setValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['calculationParameterId'].setValue(this.selectedLineItem);
      //   this.PILineItemForm.controls['calculationTypeId'].setValue( this.selectedLineItem);
      //   this.PILineItemForm.controls['taxId'].setValue( this.selectedLineItem);
      //   this.PILineItemForm.controls['regionId'].setValue( this.selectedLineItem);
   
   
      //   this.lineItemCategoryName =  this.selectedLineItem.lineItemCategoryName;
      //   this.lineItemCode =  this.selectedLineItem.lineItemCode;
      //   this.lineItemName =  this.selectedLineItem.lineItemName;
      //   this.joLineitemId =  this.selectedLineItem.joLineitemId;
    
      //   this.regionId =  this.selectedLineItem.regionId;
      //   this.regionName =  this.selectedLineItem.regionName;
   
   
      //   this.calculationParameter =  this.selectedLineItem.calculationParameter;
      //   this.calculationParameterId =  this.selectedLineItem.calculationParameterId;
   
      //   this.calculationType =  this.selectedLineItem.calculationType;
      //   this.calculationTypeId =  this.selectedLineItem.calculationTypeId;
   
      //   this.taxCodeName =  this.selectedLineItem.taxCodeName;
      //   this.taxId =  this.selectedLineItem.taxId;
      //  }));

    }

  }

  // #region Form
  iniForm() {
    this.PILineItemForm = this.fb.group({
      purchaseInvDetailId: [0],
      purchaseInvoiceId: [0],
      jobOrderId:[0],
      lineItemCategoryId :[null],
      sourceFromId:[null],
      refNumberId:[null],
      jobOrderNumber:[null],
      joLineitemId: [null],
      lineItemCode: [null],
      lineItemCategoryName: [null],
      currencyId:[null],
      currencyName:[null],
      regionId: [null],
      calculationParameterId: [null],
      calculationTypeId: [null],
      rate: [null],
      quantity: [null],
      value: [null],
      taxId: [null],
      taxPer: [null],
      taxValue: [null],
      totalInVendorCurrency: [null],
      minValueInVendorCurrency: [0],
      exchangeRate: [null],
      totalInCompanyCurrency: [null],
      remarks: [null],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date],
      qLIVendorValue:[null],
      jobOrderDate:[null]
    });
  }

  //#region vendor filter
  onVendorCheckboxChange(event: any) {
    if (event.checked == true) {
      this.enablevendor = true;
      this.jobOrderExpenseBookingService.GetAllVendors().subscribe(res => {
        this.vendorList = res;
        this.vendorFun();
      });
    } else {
      this.enablevendor = false;
      this.vendorList = [];
      this.vendorId = null;
      this.PILineItemForm.controls['vendorId'].reset();
    }

  }

  vendorFun() {
    this.filteredvendorListOptions$ = this.PILineItemForm.controls['vendorId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.vendorName)),
      map((name: any) => (name ? this.filteredvendorListOptions(name) : this.vendorList?.slice()))
    );
  }
  private filteredvendorListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.vendorList.filter((option: any) => option.vendorName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataVendor();
  }
  NoDataVendor(): any {
    this.PILineItemForm.controls['vendorId'].setValue('');
    return this.vendorList;
  }
  displayvendorListLabelFn(data: any): string {
    return data && data.vendorName ? data.vendorName : '';
  }
  vendorListSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.vendorId = selectedValue.vendorId;
    this.vendorName = selectedValue.vendorName;
    this.vendorType = selectedValue.vendorType;
    this.vendorfillter();
  }
  vendorfillter() {
    const payload = {
      vendorId: this.vendorId,
      lineitemId: this.joLineitemId
    }
    this.quotationService.Searchcontractvendorrs(payload).subscribe((res => {
      if (res.length > 0) {
        console.log('vendor select ', res);

        //     var direct = this.sourceFromList.find(id=>id.sourceFromId==2);
        //     this.selectedSourceFromId=2
        //      this.selectedSourceFromName=direct?.sourceFrom;
        //      this.selectedRefNumberId = res[0].refNumberId;
        //      this.selectedrefNumber = res[0].refNumber;
        //      this.calculationTypeId=res[0].calculationTypeId;
        //      this.calculationParameterId =res[0].calculationParameterId
        //      this.getSourceFrom(this.selectedSourceFromId);
        //      this.PILineItemForm.controls['sourceFromId'].setValue(direct);
        //      this.PILineItemForm.controls['refNumberId'].setValue(res[0]);
        debugger;
        var carculationparms = this.CalculationParlist.find(id => id.calculationParameterId == res[0].calculationParameterId);
        this.calculationParameter = carculationparms?.calculationParameter;
        this.PILineItemForm.controls['calculationParameterId'].setValue(carculationparms);

        var carculationtype = this.CalculationTyplist.find(id => id.calculationTypeId == res[0].calculationTypeId);
        this.calculationType = carculationtype?.calculationType;
        this.PILineItemForm.controls['calculationTypeId'].setValue(carculationtype);

        var tax = this.taxcodelist.find(id => id.taxCodeId == res[0].taxId);
        this.taxCodeName = tax?.taxCodeName;
        this.PILineItemForm.controls['taxId'].setValue(tax);
      }
    }));
  }
  vendorEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.vendorId = null;
    }
  }
  //#region Get job Order//
  GetAllJobOrder() {
    this.regionService.GetAllJobOrder().subscribe((res: any) => {
      this.joList = res;
      this.JobOrderFun();
    });
  }
  JobOrderFun() {
    debugger
    this.filteredJobOrderOptions$ = this.PILineItemForm.controls['jobOrderId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobOrderNumber)),
      map((name: any) => (name ? this.filteredJobOrderOptions(name) : this.joList?.slice()))
    );
  }
  private filteredJobOrderOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.joList.filter((option: any) => option.jobOrderNumber.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataJobOrder();
  }
  NoDataJobOrder(): any {
    this.PILineItemForm.controls['jobOrderId'].setValue('');
    return this.joList;
  }
  displayJobOrderListLabelFn(data: any): string {
    return data && data.jobOrderNumber ? data.jobOrderNumber : '';
  }
  JobOrderSelectedoption(data: any) {
    let selectedValue = data.option.value;
    console.log("data",data);
    this.jobOrderId = selectedValue.jobOrderId;
    this.jobOrderNumber = selectedValue.jobOrderNumber;
    this.jobDate = selectedValue.jobOrderDate;
    this.PILineItemForm.controls["jobOrderDate"].setValue(this.jobDate);

    this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,0).subscribe((res=>{
      this.lineItemListnew=res;

      const filteredList1 = this.lineItemList.filter(item1 => {
        // Check if this item is present in the new list
        const isPresentInNewList = this.lineItemListnew.some(item2 => item2.joLineitemId === item1.lineItemId);
        
        // If present, remove from the new list
        if (isPresentInNewList) {
          this.lineItemListnew = this.lineItemListnew.filter(item2 => item2.joLineitemId !== item1.lineItemId);
        }
        
        // If present, filter out from the first list as well
        return !isPresentInNewList;
      });
      
      // Reassign filtered lists back to the original lists
      this.lineItemListFiltered = filteredList1;
      this.lineItemListnew=[];
      //this.lineItemList=[];

      console.log("Reassign filtered lists back to the original lists",this.lineItemList);

     
      this.lineItemFun();
    }));
  }
  getjobdisc(){
    this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId,0).subscribe((res=>{
      this.lineItemListnew=res;

      const filteredList1 = this.lineItemList.filter(item1 => {
        // Check if this item is present in the new list
        const isPresentInNewList = this.lineItemListnew.some(item2 => item2.joLineitemId === item1.lineItemId);
        
        // If present, remove from the new list
        if (isPresentInNewList) {
          this.lineItemListnew = this.lineItemListnew.filter(item2 => item2.joLineitemId !== item1.lineItemId);
        }
        
        // If present, filter out from the first list as well
        return !isPresentInNewList;
      });
      
      // Reassign filtered lists back to the original lists
      this.lineItemListFiltered = filteredList1;
      this.lineItemListnew=[];
      //this.lineItemList=[];

      console.log("Reassign filtered lists back to the original lists",this.lineItemList);

     
      this.lineItemFun();
    }));
  }
  JEmpty(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.PILineItemForm.reset();
      this.iniForm();
    }}
  //#region FilterDialog
  // FilterDialog() {
  //   if (!this.vendorId) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Info!",
  //       text: "Please select the Vendor",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     return;
  //   }
  //   const dialogRef = this.dialogFilter.open(JoebVendorfilterDialogComponent, {
  //     data: {
  //       vendorId: this.vendorId, vendorType: this.vendorType, sourceFrom: this.sourceFrom,

  //     },
  //     disableClose: true,
  //     autoFocus: false,
  //     height: '700px'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != null) {
  //       this.filterReferenceNumber = result;
  //       alert(this.filterReferenceNumber)
  //     }
  //   });
  // }


  //#region Add to List
  dateFilter1 = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return !date || date <= currentDate;
  };
  AddtoList() {

    
  let iscalculationParameterId = this.PILineItemForm.controls['calculationParameterId'].value
  if(iscalculationParameterId?.calculationParameterId === null || iscalculationParameterId?.calculationParameterId === undefined || iscalculationParameterId?.calculationParameterId ===null){
    this.PILineItemForm.controls['calculationParameterId'].reset();
  }
  let iscalculationTypeId = this.PILineItemForm.controls['calculationTypeId'].value
  if(iscalculationTypeId?.calculationTypeId === null || iscalculationTypeId?.calculationTypeId === undefined || iscalculationTypeId?.calculationTypeId ===null){
    this.PILineItemForm.controls['calculationTypeId'].reset();
  }
  
  let tax = this.PILineItemForm.controls['taxId'].value
  if(tax?.taxCodeName === "" || tax?.taxCodeName === undefined || tax?.taxCodeName ===null){
    this.PILineItemForm.controls['taxId'].reset();
  }

    if (this.PILineItemForm.valid) {
      const PIDetail: JobOrderExpenseBookingDialogComponent = {
        ...this.PILineItemForm.value,
      }
      console.log("PIDetail",PIDetail);
      this.totalInCompanyCurrency = this.PILineItemForm.controls['totalInCompanyCurrency'].value;
      this.totalInVendorCurrency = this.PILineItemForm.controls['totalInVendorCurrency'].value;

      PIDetail.lineItemCode = this.lineItemCode;
      PIDetail.lineItemName = this.lineItemName;
      PIDetail.joLineitemId = this.joLineitemId;
      PIDetail.joCostBookingId = this.jobcostingBookingId


      PIDetail.groupCompanyId = this.groupCompanyId;
      PIDetail.companyName = this.companyName;

      PIDetail.regionId = this.regionId;
      PIDetail.regionName = this.regionName;


      PIDetail.calculationParameter = this.calculationParameter;
      PIDetail.calculationParameterId = this.calculationParameterId;

      PIDetail.calculationType = this.calculationType;
      PIDetail.calculationTypeId = this.calculationTypeId;

      PIDetail.taxCodeName = this.taxCodeName;
      PIDetail.taxId = this.taxId;
      PIDetail.taxPer=this.taxPer

      PIDetail.jobOrderId = this.jobOrderId;
      PIDetail.jobOrderNumber=this.jobOrderNumber;

      PIDetail.lineItemCategoryName = this.lineItemCategoryName;
      PIDetail.lineItemCategoryId=this.lineItemCategoryId;

      //PIDetail.currencyId = this.currencyId;
     // PIDetail.currencyName=this.currencyName;
      PIDetail.totalInVendorCurrency = parseFloat(this.totalInVendorCurrency);
      PIDetail.totalInCompanyCurrency = parseFloat(this.totalInCompanyCurrency);
      // if (jocbDetail.serviceInId == null) {
      //   this.PILineItemForm.controls['serviceInId'].reset();
      //   return;
      // } else if (jocbDetail.groupCompanyId == null) {
      //   this.PILineItemForm.controls['groupCompanyId'].reset();
      //   return;

      // } else if (jocbDetail.regionId == null) {
      //   this.PILineItemForm.controls['regionId'].reset();
      //   return;

      // } else if (jocbDetail.sourceFromId == null) {
      //   this.PILineItemForm.controls['sourceFromId'].reset();
      //   return;

      // } else if (jocbDetail.currencyId == null) {
      //   this.PILineItemForm.controls['currencyId'].reset();
      //   return;

      // } else if (jocbDetail.calculationParameterId == null) {
      //   this.PILineItemForm.controls['calculationParameterId'].reset();
      //   return;

      // } else if (jocbDetail.calculationTypeId == null) {
      //   this.PILineItemForm.controls['calculationTypeId'].reset();
      //   return;

      // } else if (jocbDetail.taxId == null) {
      //   this.PILineItemForm.controls['taxId'].reset();
      //   return;

      // }
      const AllLineItems={
        ...PIDetail,
        pInLineItemVendorValue:this.data.LineData.pInLineItemVendorValue
      }
      this.dialogRef.close(AllLineItems);
      this.PILineItemForm.reset();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      this.PILineItemForm.markAllAsTouched();
      this.validateall(this.PILineItemForm);
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



  //#region  currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.LiveStatus).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.PILineItemForm.controls['currencyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.currencyName)),
      map((name: any) => (name ? this.filteredCurrencyListOptions(name) : this.currencyList?.slice()))
    );
  }
  private filteredCurrencyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.currencyList.filter((option: any) => option.currencyName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataCurrency();
  }
  NoDataCurrency(): any {
    this.PILineItemForm.controls['currencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.currencyId = selectedValue.currencyId;
    this.currencyName = selectedValue.currencyName;

  }
  //#endregion

  //#region  GroupCompany
  GetAllGroupCompany() {
    this.commonService.GetAllGroupCompany().subscribe(result => {
      this.groupCompanyList = result;
      this.groupCompanyFun();
    });
  }
  groupCompanyFun() {
    this.filteredgroupCompanyListOptions$ = this.PILineItemForm.controls['groupCompanyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.companyName)),
      map((name: any) => (name ? this.filteredgroupCompanyListOptions(name) : this.groupCompanyList?.slice()))
    );
  }
  private filteredgroupCompanyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.groupCompanyList.filter((option: any) => option.companyName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatagroupCompany();
  }
  NoDatagroupCompany(): any {
    this.PILineItemForm.controls['groupCompanyId'].setValue('');
    return this.groupCompanyList;
  }
  displaygroupCompanyListLabelFn(data: any): string {
    return data && data.companyName ? data.companyName : '';
  }
  groupCompanyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.groupCompanyId = selectedValue.groupCompanyId;
    this.companyName = selectedValue.companyName;

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
    this.filteredCalculationParOptions$ = this.PILineItemForm.controls['calculationParameterId'].valueChanges.pipe(
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
    this.PILineItemForm.controls['calculationParameterId'].setValue('');
    return this.CalculationParlist;
  }
  displayculationParLabelFn(data: any): string {
    return data && data.calculationParameter ? data.calculationParameter : '';
  }
  CalculationParSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.calculationParameterId = selectedValue.calculationParameterId;
    this.calculationParameter = selectedValue.calculationParameter;

    this.calculationTypeId = selectedValue.calculationTypeId;
    this.calculationType = selectedValue.calculationType;
    this.PILineItemForm.controls['calculationTypeId'].setValue(selectedValue);
    this.PILineItemForm.controls['quantity'].disable();

    if (this.calculationType) {
      this.calculationTypeReadonly=true;
    } else {
      this.calculationTypeReadonly=false;
    }
    this.getQuantity();
  }
  getQuantity(){
    this.jobOrderRevenueBookingService.GetQuatityFromJO(this.jobOrderId,this.calculationParameterId).subscribe(res=>{
      this.quantityfromJO=res;
      console.log(' this.quantityfromJO', this.quantityfromJO);
      this.PILineItemForm.controls['quantity'].setValue(this.quantityfromJO);
      this.calculateValue();
      this.checkCIF();
      });
  }
  
  checkCIF() {
    debugger;
    let calculationParam = this.PILineItemForm.controls['calculationParameterId'].value;
    let calculationType = this.PILineItemForm.controls['calculationTypeId'].value;

    if (calculationParam?.calculationParameter === 'CI Value') {
      if (calculationType?.calculationType === 'Percentage') {
        this.PILineItemForm.controls['quantity']?.patchValue(1);
        this.quantitys = 1;
        let rate = parseFloat(this.PILineItemForm.controls['rate']?.value);
        // rate = isNaN(rate) ? 0 : rate;
        this.regionService.GetJobOrderById(this.jobOrderId).subscribe((res: any) => {
          console.log("res",res);
          let CIFvalue = res.joGeneral.overallCIFValue;
          let cifcurrencyId = res.joGeneral.cifCurrencyId;

          const payload1: Exchange = {
            fromCurrencyId:cifcurrencyId,
            toCurrencyId: this.currencyId,
            value:CIFvalue 
          };
         this.Qs.CurrencyExchanges(payload1).subscribe((res=>{
          this.convert = res;
          let cifPer = this.convert.convertedValue / 100;
          let multipliedValue = cifPer * rate || 0;
          this.PILineItemForm.controls['value'].setValue(multipliedValue)
  
          // const minvalue = this.PILineItemForm.controls['minValueInVendorCurrency'].value;
          // if (minvalue) {
          //   if (minvalue < multipliedValue) {
          //     this.PILineItemForm.patchValue({ taxValue: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });
  
          //   } else {
          //     this.PILineItemForm.controls['taxValue'].setValue(minvalue);
          //   }
          // }
          // else {
          //   this.PILineItemForm.patchValue({ taxValue: isNaN(multipliedValue) ? 0 : multipliedValue.toFixed(4) });
          // }
          this.PILineItemForm.controls['quantity'].disable();
          this.calculateVCurrency();
          this.calculateCCurrency();
         }));
          
         
          //CIFvalue = typeof CIFvalue === 'number' ? CIFvalue : 0;
  
         
        });
        
      } else {
        this.PILineItemForm.controls['quantity'].enable();
      }
    }
    else {
      this.PILineItemForm.controls['quantity'].enable();
    }
    this.calculateVCurrency();
  }
  //#endregion
  //#region select culationType
  GetAllCalculationType() {
    this.commonService.GetAllCalculationType().subscribe(result => {
      this.CalculationTyplist = result;
      this.CalculationTypeFun()
    });
  }
  CalculationTypeFun() {
    this.filteredCalculationTypeOptions$ = this.PILineItemForm.controls['calculationTypeId'].valueChanges.pipe(
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
    this.PILineItemForm.controls['calculationTypeId'].setValue('');
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
    this.commonService.GetAllActiveTaxCodes().subscribe(result => {
      this.taxcodelist = result;
      this.TaxCodeFun()
    });
  }
  TaxCodeFun() {
    this.filteredTaxCodeOptions$ = this.PILineItemForm.controls['taxId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.taxCodeName)),
      map((name: any) => (name ? this.filteredTaxCodeOptions(name) : this.taxcodelist?.slice()))
    );
  }
  private filteredTaxCodeOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.taxcodelist.filter((option: any) => option.taxCodeName.toLowerCase().includes(filterValue));
    this.PILineItemForm.controls['taxPer'].setValue(null);
    this.taxPer = null;
    return results.length ? results : this.NoDataTaxCode();
  }
  NoDataTaxCode(): any {
    this.PILineItemForm.controls['taxId'].setValue(null);
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
    this.PILineItemForm.controls['taxPer'].setValue(this.taxPer);
    this.taxValueCalculate();
  }

  emptytaxper(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.PILineItemForm.controls['taxPer'].setValue(null);
      this.taxPer = null;
      this.taxCodeName = '';
      this.taxId = null;
    }
  }

  //#endregion

  //#region GetLineItem
  GetLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe((res => {
      this.lineItemList = res;
      this.lineItemFun();
    }));
  }
  lineItemFun() {
    this.filteredLineItemOptions$ = this.PILineItemForm.controls['joLineitemId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.lineItemName)),
      map((name: any) => (name ? this.filteredLineItemOptions(name) : this.lineItemListFiltered?.slice()))
    );
  }
  private filteredLineItemOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.lineItemListFiltered.filter((option: any) => option.lineItemName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataLineItem();
  }
  NoDataLineItem(): any {
    this.PILineItemForm.controls['joLineitemId'].setValue('');
    return this.lineItemListFiltered;
  }
  displayLineItemListLabelFn(data: any): string {
    return data && data.lineItemName ? data.lineItemName : '';
  }
  lineItemSelectedOption(data: any) {
    let selectedValue = data.option.value;
    this.joLineitemId = selectedValue.lineItemId;
    this.lineItemCode = selectedValue.lineItemCode;
    this.lineItemName = selectedValue.lineItemName;
    var select = this.lineItemListFiltered.find(id=>id.lineItemId ==  this.joLineitemId);
    this.lineItemCategoryId = select?.lineItemCategoryId;
    this.lineItemCategoryName = selectedValue.lineItemCategoryName;
    this.PILineItemForm.controls["lineItemCategoryName"].setValue(this.lineItemCategoryName);
    this.PILineItemForm.controls["lineItemCode"].setValue(this.lineItemCode);


    // this.PIS.GetAllJonOrderExpenseByJobOrderId(this.jobOrderId ,this.joLineitemId).subscribe((res=>{
    //  this.selectedLineItem = res[0];
    //  console.log("this.selectedLineItem",this.selectedLineItem);
    //  this.PILineItemForm.patchValue(this.selectedLineItem);
    //  this.PILineItemForm.controls['joLineitemId'].setValue(this.selectedLineItem);
    //  this.PILineItemForm.controls['calculationParameterId'].setValue(this.selectedLineItem);
    //  this.PILineItemForm.controls['calculationTypeId'].setValue( this.selectedLineItem);
    //  this.PILineItemForm.controls['taxId'].setValue( this.selectedLineItem);
    //  this.PILineItemForm.controls['taxPer'].setValue( this.selectedLineItem.taxPer);
    //  this.PILineItemForm.controls['regionId'].setValue( this.selectedLineItem);
    //  this.PILineItemForm.controls['minValueInVendorCurrency'].setValue( this.selectedLineItem.minValue||0);
     


    //  this.lineItemCategoryName =  this.selectedLineItem.lineItemCategoryName;
    //  this.lineItemCode =  this.selectedLineItem.lineItemCode;
    //  this.lineItemName =  this.selectedLineItem.lineItemName;
    //  this.joLineitemId =  this.selectedLineItem.joLineitemId;
 
    //  this.regionId =  this.selectedLineItem.regionId;
    //  this.regionName =  this.selectedLineItem.regionName;


    //  this.calculationParameter =  this.selectedLineItem.calculationParameter;
    //  this.calculationParameterId =  this.selectedLineItem.calculationParameterId;

    //  this.calculationType =  this.selectedLineItem.calculationType;
    //  this.calculationTypeId =  this.selectedLineItem.calculationTypeId;

    //  this.taxCodeName =  this.selectedLineItem.taxCodeName;
    //  this.taxId =  this.selectedLineItem.taxId;
    // }));

  }
  //#endregion lineItem

  //#region ServiceIn 
  getServiceIn() {
    this.commonService.getCountries(1).subscribe((result) => {
      this.CountryDatalist = result;
      this.CountryTypeFun();
    });
  }

  CountryTypeFun() {
    this.filteredCountryOptions$ = this.PILineItemForm.controls['serviceInId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.countryName)),
      map((name: any) => (name ? this.filterCountryFunType(name) : this.CountryDatalist?.slice()))
    );
  }
  private filterCountryFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CountryDatalist.filter((option: any) => option.countryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoData();
  }
  NoData(): any {
    this.PILineItemForm.controls['serviceInId'].setValue('');
    return this.CountryDatalist;
  }
  displayCountryLabelFn(countrydata: any): string {
    return countrydata && countrydata.countryName ? countrydata.countryName : '';
  }
  CountrySelectedoption(CountryData: any) {
    let selectedCountry = CountryData.option.value;
    this.serviceInId = selectedCountry.countryId;
    this.countryName = selectedCountry.countryName
  }

  //#region Region 
  getAllRegion() {
    this.data.mode == 'Edit'
    this.regionService.getRegions().subscribe(data => {
      this.regionList = data;
      if (this.data.mode != 'Edit' && this.data.mode != 'View') {
        this.commonService.GetAllDefaultSettings().subscribe(res => {
          this.defaultSettingsValues = res;
          let defaultValue = this.defaultSettingsValues.find(x => x.settingName == 'Region')
          this.regionId = defaultValue?.defaultValueId;

          let value = this.regionList.find(x => x.regionId == this.regionId);
          this.PILineItemForm.controls['regionId'].setValue(value);
          this.regionName = value.regionName;
        });
      }
      this.RegionFun();
    });
  }
  RegionFun() {
    this.filteredRegionOptions$ = this.PILineItemForm.controls['regionId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.regionName)),
      map((name: any) => (name ? this.filterRegionFunType(name) : this.regionList?.slice()))
    );
  }
  private filterRegionFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.regionList.filter((option: any) => option.regionName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoRegionData();
  }
  NoRegionData(): any {
    this.PILineItemForm.controls['regionId'].setValue('');
    return this.regionList;
  }
  displayRegionLabelFn(data: any): string {
    return data && data.regionName ? data.regionName : '';
  }
  RegionSelectedoption(Data: any) {
    let selectedValue = Data.option.value;
    this.regionId = selectedValue.regionId;
    this.regionName = selectedValue.regionName
  }

  //#region Source 
  getAllSource() {
    this.commonService.GetAllSourceFrom().subscribe(data => {
      this.sourceList = data;
      this.sourceFun();
    });
  }
  sourceFun() {
    this.filteredSourceOptions$ = this.PILineItemForm.controls['sourceFromId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.sourceFrom)),
      map((name: any) => (name ? this.filtersourceFunFunType(name) : this.sourceList?.slice()))
    );
  }
  private filtersourceFunFunType(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.sourceList.filter((option: any) => option.sourceFrom.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoRegionData();
  }
  NosourceData(): any {
    this.PILineItemForm.controls['sourceFromId'].setValue('');
    return this.sourceList;
  }
  displaysourceLabelFn(countrydata: any): string {
    return countrydata && countrydata.sourceFrom ? countrydata.sourceFrom : '';
  }
  sourceSelectedoption(Data: any) {
    let selectedValue = Data.option.value;
    this.sourceFromId = selectedValue.sourceFromId;
    this.sourceFrom = selectedValue.sourceFrom
  }

  //#region close Dialog window
  Close() {
    this.dialogRef.close();
  }

  //#region Calculation
  rete(event: any) {
    debugger
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,4})?$/;
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
    this.PILineItemForm.controls['rate'].setValue(input.value);
    let calculationParam = this.PILineItemForm.controls['calculationParameterId'].value;

    if (calculationParam?.calculationParameter === 'CI Value') {
      this.checkCIF();
    }
    this.calculateValue()
    this.calculateVCurrency();
 
  }
  taxValueCalculate() {
    const value = parseFloat(this.PILineItemForm.controls['value'].value) ? parseFloat(this.PILineItemForm.controls['value'].value) : 0;
    this.taxPer = this.PILineItemForm.controls['taxPer'].value;
    let taxvalue = (value / 100) * this.taxPer
    if (this.taxPer) {
      this.PILineItemForm.controls['taxValue'].setValue(taxvalue.toFixed(4));
    } else {
      this.PILineItemForm.controls['taxValue'].setValue(0);
    }
    this.calculateVCurrency();
  }

  quantity(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,6}(\.\d{0,2})?$/;
    if (value.startsWith('0') && !value.startsWith('0.')) {
      value = value.slice(1);
    }
    if (!regex.test(value)) {
      value = value.slice(0, -1);
    }
    const parts = value.split('.');
    if (parts[0].length > 6) {
      parts[0] = parts[0].slice(0, 6);
    }
    input.value = parts.join('.');
    this.PILineItemForm.controls['quantity'].setValue(input.value);
    this.calculateValue();
    this.calculateVCurrency();
  }

  calculateValue() {

    let calculationParam = this.PILineItemForm.controls['calculationParameterId'].value;

    if (calculationParam?.calculationParameter != 'CI Value') {
      const rate = this.PILineItemForm.controls['rate'].value || 0.00
      const quantity = this.PILineItemForm.controls['quantity'].value || 0.00
      const values = rate * quantity;
      this.PILineItemForm.controls['value'].setValue(values.toFixed(4));
    }
  }

  taxValue(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const regex = /^\d{0,14}(\.\d{0,4})?$/;
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
    //const numericValue = parseFloat(input.value);
    this.PILineItemForm.controls['taxValue'].setValue(input.value);
    this.calculateVCurrency();
  }

  calculateVCurrency() {
    debugger
    const value = this.PILineItemForm.controls['value'].value || 0.00
    const taxValue = this.PILineItemForm.controls['taxValue'].value || 0.00
    const values = parseFloat(value) + parseFloat(taxValue);
    this.PILineItemForm.controls['totalInVendorCurrency'].setValue(values.toFixed(2));
    this.calculateCCurrency();
    this.taxValueCalculate();
  }
  calculateCCurrency() {
    debugger
    const totalInVendorCurrency = this.PILineItemForm.controls['totalInVendorCurrency'].value || 0.00
    const exchangeRate = this.PILineItemForm.controls['exchangeRate'].value || 0.00
    const values = parseFloat(totalInVendorCurrency) * parseFloat(exchangeRate);
    this.PILineItemForm.controls['totalInCompanyCurrency'].setValue(values.toFixed(2));
  }

}
