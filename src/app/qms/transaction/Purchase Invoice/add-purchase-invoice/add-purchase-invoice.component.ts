import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, startWith, map } from 'rxjs';
import { CommodityService } from 'src/app/crm/master/commodity/commodity.service';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { IncoTermService } from 'src/app/crm/master/incoterm/incoterm.service';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { CommonService } from 'src/app/services/common.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { ProformaInvoiceService } from 'src/app/services/qms/proforma-invoice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { ProformaInvoiceEditComponent } from '../../Proforma Invoice/proforma-invoice-edit/proforma-invoice-edit.component';
import { ProformaInvoiceFilterComponent } from '../../Proforma Invoice/proforma-invoice-filter/proforma-invoice-filter.component';
import { ProformaInvoiceGeneral, ProformaInvDetail } from '../../Proforma Invoice/proforma-modals';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ImagePreviewComponent } from '../../customer-contract/image-preview/image-preview.component';
import { environment } from 'src/environments/environment.development';
import { PIContainer, PILineItemDetail, PurchaseInvoice } from '../purchase-invoice-modals';
import { ExchangeModel, groupCompany } from 'src/app/Models/crm/master/Dropdowns';
import { PIlineItemComponent } from '../piline-item/piline-item.component';
import { PIvendorvalueComponent } from '../pivendorvalue/pivendorvalue.component';
import { PIService } from '../pi.service';
import { PurchaseInvoiceFilterComponent } from '../purchase-invoice-filter/purchase-invoice-filter.component';
import { aggregateBy, AggregateResult } from '@progress/kendo-data-query';
import { JOCostBookingDetail } from '../../job-order-expense-booking/job-order-expense-booking.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

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
  selector: 'app-add-purchase-invoice',
  templateUrl: './add-purchase-invoice.component.html',
  styleUrls: ['./add-purchase-invoice.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AddPurchaseInvoiceComponent {

  //kendo pagination//
  public aggregates: any[] = [
    { field: "totalInCompanyCurrency", aggregate: "sum" }
  ];

  public aggregates1: any[] = [
    { field: "totalInVendorCurrency", aggregate: "sum" }
  ];
  public total: any;
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  //Autocomplete observables
  filteredVendor: Observable<any[]>;
  filteredBillingCurrencyControl: Observable<any[]>;
  filteredCustomerAddress: Observable<any[]>;
  filteredContactPersonControl: Observable<any[]>;
  filteredStatus: Observable<any[]>;
  filteredApprovalStatus: Observable<any[]>;
  filteredoriginCountryControl: Observable<any[]>;
  filtereddestinationCountryControl: Observable<any[]>;
  filteredgroupcompany: Observable<any[]>;

  hasViewRoute: any;
  disableStatus: boolean = true;
  liveStatus = 1;

  //Array variables
  VendorList: any[] = [];
  vendorAddressList: any[] = [];
  ContactPersonList: any[] = [];
  CustomerBillingCurrencyList: any[] = [];
  statusList: any[] = [];
  approvalStatusList: any[] = [];
  OriginCountryList: any[] = [];
  DestinationCountryList: any[] = [];
  CommodityList: any[] = [];

  //Modal Varaibles
  PIGeneralList: PurchaseInvoice = new PurchaseInvoice();
  PIDetailList: ProformaInvDetail = new ProformaInvDetail();

  //Line Item Grid
  PILineItemList: any[] = [];

  //Attachment
  attchmentList: any[] = [];
  showAddRow: boolean;
  editRow: boolean = false;
  @ViewChild('fileInput') fileInput: any;
  selectedDocId: any;
  Filepath = environment.Fileretrive;
  DocControl = new FormControl('', [Validators.required, Validators.maxLength(250), this.DocumentNameValidator.bind(this)]);
  filteredDocName: Observable<any[]>;
  documentList: any[] = [];
  documentName: any
  remark: any;
  fileToUpload: File | null = null;
  selectedItem: any = null;
  SelectedDocName: any;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  skip = 0;
  purchaseInvoiceId: any;
  pagePrivilege: Array<string>;
  userId$: any;
  groupcomapny: any[] = [];
  LineItems: any[] = [];
  Mode:any;
  JOCostBookingDetail: JOCostBookingDetail[] = [];
  exchangeValue:ExchangeModel;
  exchangerate: any;
  selectedbillCurrencyId: any;
  selectedstatusId: number;
  selectedvendorId: any;
  public total2: any;
  invalidLineItem: any[]=[];
  hasViewRoute1: boolean;
  date = new Date();
  selectedIndex = 0;


  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>,
    private regionService: RegionService, private UserIdstore: Store<{ app: AppState }>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private docmentsService: DocmentsService,
    private vendorSvc: VendorService, public dateValidator: DateValidatorService,
    private customerService: CustomerService, private commonService: CommonService,
    private jobtypeService: JobtypeserviceService, private commodityService: CommodityService,
    private incoTermService: IncoTermService, private reasonmstSvc: ReasonService,
    private PIService: ProformaInvoiceService, private vendor: VendorService, private PIs: PIService,
    private Cservice: CommonService,private errorHandler: ApiErrorHandlerService) {
  }

  ngOnInit(): void {
    this.GetUserId();
    this.VendorGetAll();
    this.getbillingCurrencyList();
    this.GetPIStatusList();
    this.getAllApprovalStatus();
    this.getCountryMaster();
    this.getDocumentList();
    this.GetAllGroupCompany();
    this.matFilters();
    this.calculateAggregates();
    this.calculateAggregates1();
    this.route.paramMap.subscribe(params => {
      const currentUrl = this.router.url;
      this.hasViewRoute = currentUrl.includes('/view');
      this.hasViewRoute1 = currentUrl.includes('/edit');
      if (this.hasViewRoute) {
        this.Mode = "view";
        this.disableForms();
      }else if (this.hasViewRoute1){
        this.Mode ="Edit";
        this.getDocuments();
      }

      this.purchaseInvoiceId = params.get('id');
      if (this.purchaseInvoiceId != '' && this.purchaseInvoiceId != null) {
        this.getPerFormaInvoice();
      } else {
        const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.PIGeneralForm.patchValue({
          billDate: formattedDate
        });
      }
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
    this.PIGeneralForm.get('exchangeRate')?.disable();
    this.PIGeneralForm.get('statusId')?.setValue("Draft");
    this.selectedstatusId=1;
    this.PIGeneralForm.get('approvalStatus')?.setValue("NA");
    this.matFilters();
  }

  PIGeneralForm = new FormGroup({
    invoiceNumber: new FormControl({ value: '', disabled: true }),
    vendorId: new FormControl('', [Validators.required, this.CustomerNameValidator.bind(this)]),
    billNumber: new FormControl(''),
    billDate: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    billingCurrencyId: new FormControl('', [Validators.required, this.BillingCurrencyValidator.bind(this)]),
    addressId: new FormControl('', [Validators.required, this.CustomerAddressValidator.bind(this)]),
    contactId: new FormControl('', [Validators.required, this.ContactPersonValidator.bind(this)]),
    exchangeRate: new FormControl(null),
    invAmount: new FormControl(''),
    groupCompanyId: new FormControl('', [Validators.required]),
    statusId: new FormControl('', [Validators.required, this.StatusValidator.bind(this)]),
    sapInvoiceNo: new FormControl({ value: '', disabled: true }, Validators.maxLength(25)),
    approvalStatus: new FormControl({ value: '', disabled: true }),
    closedReasonControl: new FormControl(''),
    remarks: new FormControl('', [Validators.maxLength(500)]),
  })
  get f1() {
    return this.PIGeneralForm.controls;
  }

// #region calculate Aggregates
private calculateAggregates(): void {
  const value = aggregateBy(this.LineItems, this.aggregates);
  this.total = value;
 // this.total.toFixed(2);
}

private calculateAggregates1(): void {
  const value = aggregateBy(this.LineItems, this.aggregates1);
  this.total2 = value;
  //this.total2.toFixed(2);
}

  get dateFilter() {
    return this.dateValidator.dateFilter;
  }
  get futuredateFilter() {
    return this.dateValidator.futuredateFilter;
  }

  disableForms() {
    this.PIGeneralForm.disable();
  }
  statusDisableOption(option: any) {
    return option?.piStatus !== 'Cancel';
  }

  getPerFormaInvoice() {
    this.PIs.GetAllPurchaseInvoiceId(this.purchaseInvoiceId).subscribe((res: any) => {
      console.log(res)
      this.PIGeneralList = res?.purchaseInvoiceGeneral;
      this.attchmentList = res?.purchaseInvoiceDocuments;
      this.LineItems = res?.purchaseInvoiceDetails;
      this.selectedstatusId = this.PIGeneralList.statusId;
      this.selectedbillCurrencyId = this.PIGeneralList.billingCurrencyId;
      this.selectedvendorId = this.PIGeneralList.vendorId;
      this.getExchange();
      this.calculateAggregates();
      this.calculateAggregates1();
      if (this.PIGeneralList.vendorId) {
        this.vendor.getVendorbyId(this.PIGeneralList.vendorId).subscribe((res) => {
          this.vendorAddressList = res.vAddresses;
          let primaryAddress = this.vendorAddressList.find(option => option?.primaryAddress === true)
          this.PIGeneralForm.get('addressId')?.patchValue(primaryAddress?.addressName);
          this.matFilters();
        });

        this.vendor.getVendorbyId(this.PIGeneralList.vendorId).subscribe((res) => {
          this.ContactPersonList = res.vContacts;
          let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
          this.PIGeneralForm.get('contactId')?.patchValue(primaryContact?.contactPerson);
          this.matFilters();
        })

        // this.vendor.getVendorbyId(id?.customerId).subscribe((res) => {
        //   console.log(res);
        //   this.PIGeneralForm.get('billingCurrencyId')?.patchValue(res?.vendors?.);

        //   if (res?.vendors?.bi === "All Currency") {
        //     this.PIGeneralForm.get('billingCurrencyId')?.enable();
        //   } else if (res?.vendors?.billingCurrency === "Party Currency") {
        //     this.PIGeneralForm.get('billingCurrencyId')?.disable();
        //   }        
        // })
      }
      if (this.PIGeneralList != null) {
        this.PIGeneralForm.patchValue({
          invoiceNumber: this.PIGeneralList.invoiceNumber,
          billNumber: this.PIGeneralList.billNumber,
          invAmount:this.PIGeneralList.invAmount,
          billDate: this.PIGeneralList.billDate || null,
          dueDate: this.PIGeneralList.dueDate === '1900-01-01T00:00:00' ? null : this.PIGeneralList.dueDate,
          sapInvoiceNo: this.PIGeneralList.sapInvoiceNo,
          vendorId: this.PIGeneralList.vendorName,
          billingCurrencyId: this.PIGeneralList.currencyName,
          exchangeRate: this.PIGeneralList.exchangeRate,
          addressId: this.PIGeneralList.addressName,
          contactId: this.PIGeneralList.contactPerson,
          statusId: this.PIGeneralList.status,
          groupCompanyId: this.PIGeneralList.companyName,
          approvalStatus: '',
          remarks: this.PIGeneralList.remarks
        })
      }
    })
  }
  getSelectedDoc(selectedId: number): string {
    const selectedDoc = this.documentList.find(
      (item) => item.documentId === selectedId
    );
    return selectedDoc ? selectedDoc.documentName : "";
  }
  //Mat filters
  matFilters() {
    this.filteredVendor = this.PIGeneralForm.controls.vendorId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );
    this.filteredBillingCurrencyControl = this.PIGeneralForm.controls.billingCurrencyId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerBillingCurrency(value || '')),
    );
    this.filteredCustomerAddress = this.PIGeneralForm.controls.addressId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomerAddress(value || '')),
    );
    this.filteredContactPersonControl = this.PIGeneralForm.controls.contactId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterContactPerson(value || '')),
    );
    this.filteredStatus = this.PIGeneralForm.controls.statusId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStatus(value || '')),
    );
    this.filteredApprovalStatus = this.PIGeneralForm.controls.approvalStatus.valueChanges.pipe(
      startWith(''),
      map(value => this._filterApprovalStatus(value || '')),
    );
    this.filteredDocName = this.DocControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoc(value || '')),
    );
    this.filteredgroupcompany = this.PIGeneralForm.controls.groupCompanyId.valueChanges.pipe(
      startWith(''),
      map(value => this._filtergroupcompany(value || '')),
    );
  }

  private _filterCustomer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.VendorList.filter((option: any) => option?.vendorName.toLowerCase().includes(filterValue));
  }
  private _filterCustomerBillingCurrency(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerBillingCurrencyList.filter((option: any) => option?.currencyName.toLowerCase().includes(filterValue));
  }
  private _filterCustomerAddress(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vendorAddressList.filter((option: any) => option?.addressName.toLowerCase().includes(filterValue));
  }
  private _filterContactPerson(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ContactPersonList.filter((option: any) => option?.contactPerson.toLowerCase().includes(filterValue));
  }
  private _filterStatus(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.statusList.filter(option => option?.piStatus.toLowerCase().includes(filterValue));
  }
  private _filterApprovalStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.approvalStatusList.filter(option => option?.approvalStatus.toLowerCase().includes(filterValue));
  }
  private _filterDoc(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.documentList.filter(option => option?.documentName.toLowerCase().includes(filterValue));
  }
  private _filtergroupcompany(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupcomapny.filter(option => option?.companyName.toLowerCase().includes(filterValue));
  }

  CustomerNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.VendorList?.some((option: any) => option?.vendorName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  BillingCurrencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.CustomerBillingCurrencyList?.some((option: any) => option?.currencyName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CustomerAddressValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.vendorAddressList?.some((option: any) => option?.addressName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  ContactPersonValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.ContactPersonList?.some((option: any) => option?.contactPerson === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.statusList?.some((option: any) => option?.piStatus === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  DocumentNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.documentList?.some((option: any) => option?.documentName === value);
    return isValid ? null : { invalidOption: true };
  }



  //API's 
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  VendorGetAll() {
    this.vendor.VendorGetAllActive().subscribe((res: any) => {
      this.VendorList = res;
      console.log("res", res);
      this.matFilters();
    })
  }
  GetAllGroupCompany() {
    this.commonService.GetAllGroupCompany().subscribe(res => {
      this.groupcomapny = res;
      var grpcpny = this.groupcomapny.find(id=>id.groupCompanyId==1);
      this.PIGeneralForm.get('groupCompanyId')?.patchValue(grpcpny?.companyName);
      this.matFilters();
    });
  }
  getbillingCurrencyList() {
    this.regionService.GetAllCurrency(this.liveStatus).subscribe((result: any) => {
      this.CustomerBillingCurrencyList = result;
      this.matFilters();
    });
  }
  GetPIStatusList() {
    this.PIService.GetPIStatusList().subscribe((res: any) => {
      this.statusList = res;
      this.matFilters();
    });
  }
  getAllApprovalStatus() {
    this.regionService.GetAllContractCustomerApprovalStatus().subscribe((res: any) => {
      this.approvalStatusList = res?.result;
      console.log("this.approvalStatusList",this.approvalStatusList);
      this.matFilters();
    });
  }

  getCountryMaster() {
    this.commonService.getCountries(this.liveStatus).subscribe((result) => {
      this.OriginCountryList = result;
      this.DestinationCountryList = result;
      this.matFilters();
    });
  }

  getDocuments(){
    this.PIs.GetAllDocumentMappingByScreenId(18).subscribe(res => {
      if (res) {
        this.attchmentList = res.map(ele => {
          return {
            qDocumentId: 0,
            quotationId: 0,
            documentId: ele.documentId,
            remarks: '',
            createdBy: parseInt(this.userId$),
            createdDate: this.date,
            documentName: '',
            documentIdName: ele.documentName,
            IseditDoc: false,
            newDoc: true,
            files: ''
          };
        });
        this.attchmentList = [...this.attchmentList];
      }
      console.log(this.attchmentList)
    });
  }

  //Change events
  OnchangeEvent(event: any) {
    let value = event?.option?.value;
    this.matFilters();
  }
  OnCurrencyChangeEvent(event: any) {
    debugger
    let value = event?.option?.value;
    console.log(value)
    var currency = this.CustomerBillingCurrencyList.find(id=>id?.currencyName == value);
    this.selectedbillCurrencyId = currency.currencyId;
    this.getExchange();
    this.matFilters();
  }

  OnvendorChangeEvent(event: any) {
    debugger
    let value = event?.option?.value ? event?.option?.value : event;
    let id = this.VendorList.find(option => option.vendorName === value);
    this.selectedvendorId=id?.vendorId;
    if (id) {
      this.vendor.getVendorbyId(id?.vendorId).subscribe((res) => {
        this.vendorAddressList = res.vAddresses;
        let primaryAddress = this.vendorAddressList.find(option => option?.primaryAddress === true)
        this.PIGeneralForm.get('addressId')?.patchValue(primaryAddress?.addressName);
        this.matFilters();
      });

      this.vendor.getVendorbyId(id?.vendorId).subscribe((res) => {
        this.ContactPersonList = res.vContacts;
        let primaryContact = this.ContactPersonList.find(option => option?.primaryContact === true)
        this.PIGeneralForm.get('contactId')?.patchValue(primaryContact?.contactPerson);
        this.matFilters();
      })

      this.vendor.getVendorbyId(id?.vendorId).subscribe((res) => {
        console.log(res);
        var currency = this.CustomerBillingCurrencyList.find(id=>id?.currencyId == res?.vendors?.vendorCurrencyId);
        this.selectedbillCurrencyId = res?.vendors?.vendorCurrencyId;
        this.PIGeneralForm.get('billingCurrencyId')?.patchValue(currency?.currencyName);
        this.getExchange();
        if (res?.vendors?.billingCurrencyId === 1) {
          this.PIGeneralForm.get('billingCurrencyId')?.disable();
        } else if (res?.vendors?.billingCurrencyId ===2) {
          this.PIGeneralForm.get('billingCurrencyId')?.enable();
        }        
      })
    }
    this.matFilters();
  }
//#region getExchange
getExchange() {
  debugger;
  this.commonService.GetExchangeById(this.selectedbillCurrencyId).subscribe(res => {
    this.exchangeValue = res;
    console.log("this.exchangeValue",this.exchangeValue)
    this.exchangerate = this.exchangeValue.exchangerate;
    this.PIGeneralForm.get('exchangeRate')?.patchValue(this.exchangerate);
  })
}
  //Line Item Tab

  filterDailog: any;
  editDailog: any;
  filter() {
    if(this.selectedvendorId!=null){
      this.filterDailog = this.dialog.open(PurchaseInvoiceFilterComponent, {
        data:{
          vendorId: this.selectedvendorId,
          currencyId:this.selectedbillCurrencyId
        } ,
        disableClose: true,
        autoFocus: false
      })
      this.filterDailog.afterClosed().subscribe((result: any) => {
        debugger
        if (result) {
          const newItems = result.filter((newItem: any) => {
            return !this.LineItems.some(existingItem => 
              existingItem.jobOrderId === newItem.jobOrderId && 
              existingItem.joLineitemId === newItem.joLineitemId
            );
          });
      
          this.LineItems = [...this.LineItems, ...newItems];
          this.calculateAggregates();
          this.calculateAggregates1();
        }
      });
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select vendor and then filter",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  Edit(dataItem: any) {
    this.editDailog = this.dialog.open(ProformaInvoiceEditComponent, {
      disableClose: true,
      autoFocus: false
    })
  }

  View(dataItem: any) {
    this.editDailog = this.dialog.open(ProformaInvoiceEditComponent, {
      disableClose: true,
      autoFocus: false
    })
  }
  Delete(dataItem: any, index: any) {
    this.LineItems = this.LineItems.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }


  //Attachment tab
  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documentList = res;
    });
  }

  SelectedDoc(value: any) {
    let selectedValue = this.attchmentList.find(option => option.documentIdName === value);

    if (selectedValue) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate Entry",
        text: "This document is already selected.",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
        timer: 2000
      });
      this.DocControl.reset();
    } else {
      this.SelectedDocName = value;
      this.matFilters();
      let val = this.documentList.find((c: any) => c?.documentName.toLowerCase() === value.toLowerCase());
      this.selectedDocId = val?.documentId
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.fileToUpload = file;
  }


  addAttached() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });
    if (!this.showAddRow) {
      const newRow = {
        docName: '',
        documentName: '',
        remark: '',
        Isedit: true,
      }
      this.attchmentList = [newRow, ...this.attchmentList];
      this.showAddRow = true;
      this.editRow = false;
    }
  }

  AttachedSave(dataItem: any) {
    if (this.DocControl.invalid || (this.fileInput.nativeElement.value == '' || this.fileInput.nativeElement.value == undefined || this.fileInput.nativeElement.value == null)) {
      this.DocControl.markAllAsTouched();
    } else {
      const formData = {
        documentId: this.selectedDocId,
        documentIdName: this.SelectedDocName,
        documentName: this.fileToUpload?.name,
        remarks: this.remark,
        Isedit: false,
        file: this.fileToUpload,
        createdBy: parseInt(this.userId$),
        createdDate: new Date()
      };
      this.attchmentList = this.attchmentList.filter(item => item.documentName !== '');
      this.attchmentList = [...this.attchmentList, formData];

      this.remark = '';
      this.fileInput.nativeElement.value = '';
      this.DocControl.reset();
      this.fileToUpload = null;
      this.showAddRow = false;
      this.editRow = false;
    }

  }
  AttachedUpdate(data: any, index: any) {
    const updatedDocuments = this.attchmentList.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
    this.DocControl.patchValue(this.getSelectedDoc(data.documentId))
    this.showAddRow = true;
    this.attchmentList = updatedDocuments;
  }
  onAttachedCancel(data: any, index: any){
    debugger
    if(data?.documentId){
      data.Isedit = false;
      this.attchmentList = [...this.attchmentList];
      this.showAddRow = false;
      data.newDoc = false;
      return;
    } else {
      this.attchmentList = this.attchmentList.filter((_, idx) => idx !== index);
      this.showAddRow = false;
    }

  }
  selectedItemUrl: string | ArrayBuffer | null = null;
  AttchedView(dataItem: any, index: any) {
    this.selectedItem = this.attchmentList[index];
    const file = this.selectedItem.file;
    if (file != undefined) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const dialogRef = this.dialog.open(ImagePreviewComponent, {
            data: { imageUrl: e.target.result }
          });
        };
        reader.readAsDataURL(file);
      } else {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } else {
      let dialogRef = this.dialog.open(this.imagePreview,
        { data: this.Filepath + dataItem?.documentName });
    }



  }
  AttchedDelete(dataItem: any, index: any) {
    this.attchmentList = this.attchmentList.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }

  // onAttachedCancel(obj: any, index: any) {
  //   obj.Isedit = false;
  //   this.showAddRow = false;
  //   this.editRow = false;
  //   this.attchmentList = this.attchmentList.filter((_, i) => i !== index);
  //   this.cdr.detectChanges();
  // }


  //Overall Action

  triggerValidation() {
    Object.keys(this.PIGeneralForm.controls).forEach(field => {
      const control = this.PIGeneralForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  validateAllForms() {
    if (this.PIGeneralForm.invalid) {
      this.PIGeneralForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Please fill the mandatory fields in general tab`,
        showConfirmButton: true,
      });
      this.changeTab(0);
      return false;
    }
    return true;
  }


  saveAll(id:number) {
    debugger;
   if(id==1){

    this.PIGeneralForm.controls.dueDate.setValidators(null);
    this.PIGeneralForm.controls.dueDate.updateValueAndValidity();

    this.PIGeneralList.purchaseInvoiceId = this.purchaseInvoiceId || 0,
    this.PIGeneralList.invoiceNumber = this.PIGeneralForm.controls.invoiceNumber.value || '',
    this.PIGeneralList.billNumber = this.PIGeneralForm.controls.billNumber.value || '',
    this.PIGeneralList.billDate = this.normalizeDateToUTC(this.PIGeneralForm.controls.billDate.value),
    this.PIGeneralList.dueDate =  this.normalizeDateToUTC(this.PIGeneralForm.controls.dueDate.value) || '1900-01-01T00:00:00' ,
    this.PIGeneralList.sapInvoiceNo = this.PIGeneralForm.controls.sapInvoiceNo.value || '',
    this.PIGeneralList.vendorId = this.getCustomerId(this.PIGeneralForm.controls.vendorId.value) || 0,
    this.PIGeneralList.billingCurrencyId = this.getCustomerBillId(this.PIGeneralForm.controls.billingCurrencyId.value) || 0,
    this.PIGeneralList.invAmount = this.PIGeneralForm.controls.invAmount.value || 0,
    this.PIGeneralList.exchangeRate = this.PIGeneralForm.controls.exchangeRate.value || 0,
    this.PIGeneralList.addressId = this.getVendorAddressId(this.PIGeneralForm.controls.addressId.value) || 0,
    this.PIGeneralList.contactId = this.getVendorContactId(this.PIGeneralForm.controls.contactId.value) || 0,
    this.PIGeneralList.groupCompanyId = this.getcompanyId(this.PIGeneralForm.controls.groupCompanyId.value) || 0,
    this.PIGeneralList.statusId = this.getStatusId(this.PIGeneralForm.controls.statusId.value) || 0,
    this.PIGeneralList.remarks = this.PIGeneralForm.controls.remarks.value || '',
    this.PIGeneralList.createdBy = parseInt(this.userId$),
    this.PIGeneralList.updatedBy = parseInt(this.userId$)
    if(id==1){
      if(this.PIGeneralList.statusId==1){
        this.PIGeneralList.statusId=1;
      }else{
        this.PIGeneralList.statusId=6;
      }
      
    }
    else if(id==2){
      if(this.PIGeneralList.statusId==1){
        this.PIGeneralList.statusId=2; 
      }
    }

  let payload: PIContainer = {
    purchaseInvoiceGeneral: this.PIGeneralList,
    purchaseInvoiceDetails: this.LineItems,
    purchaseInvoiceDocuments: this.attchmentList
  }
  console.log("payload", payload)

  this.PIs.PurchaseInvoiceSave(payload).subscribe((res: any) => {
    if (res) {
      if (this.purchaseInvoiceId) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated successfully",
          showConfirmButton: true,
        }).then((result) => {
          if (result.dismiss !== Swal.DismissReason.timer) {
            this.router.navigate(['/qms/transaction/purchase-invoice-list']);
          }
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added successfully",
          showConfirmButton: true,
        }).then((result) => {
          if (result.dismiss !== Swal.DismissReason.timer) {
            this.router.navigate(['/qms/transaction/purchase-invoice-list']);
          }
        });
      }

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  },
    (err: HttpErrorResponse) => {
      let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
      if(stausCode === 500){
        this.errorHandler.handleError(err);
      } else if(stausCode === 400){
        this.errorHandler.FourHundredErrorHandler(err);
      } else {
        this.errorHandler.commonMsg();
      }
    })

   }else if(id==2){
    this.triggerValidation();
    if (!this.validateAllForms()) {
      return;
    } else {
      let j = 0
      this.LineItems.forEach(ele => {
        if (ele.regionId ==null || ele.calculationParameterId==null || ele.calculationTypeId==null || ele.taxId==null) {
          j++;
          this.invalidLineItem.push(ele.lineItemName);
        }
      });
  
      if (j > 0) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Please fill the LineItem details in LineItem tab: " + this.invalidLineItem.join(", ") + ".",
          showConfirmButton: false,
          timer: 2000,
        });
        this.invalidLineItem = [];
        this.changeTab(1);
        return;
      }
      if(this.total2.totalInVendorCurrency == undefined){
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please Fill LineItems.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(1);
        return;
      }
      if(this.PIGeneralForm.controls.invAmount.value!=this.total2.totalInVendorCurrency.sum.toFixed(4)){
        Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Invoice amount should not match from the lineItem Total In Vendor Currency.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(0);
        return;
      }
      
      this.PIGeneralList.purchaseInvoiceId = this.purchaseInvoiceId || 0,
        this.PIGeneralList.invoiceNumber = this.PIGeneralForm.controls.invoiceNumber.value || '',
        this.PIGeneralList.billNumber = this.PIGeneralForm.controls.billNumber.value || '',
        this.PIGeneralList.billDate = this.normalizeDateToUTC(this.PIGeneralForm.controls.billDate.value),
        this.PIGeneralList.dueDate = this.normalizeDateToUTC(this.PIGeneralForm.controls.dueDate.value) || null,
        this.PIGeneralList.sapInvoiceNo = this.PIGeneralForm.controls.sapInvoiceNo.value || '',
        this.PIGeneralList.vendorId = this.getCustomerId(this.PIGeneralForm.controls.vendorId.value) || 0,
        this.PIGeneralList.billingCurrencyId = this.getCustomerBillId(this.PIGeneralForm.controls.billingCurrencyId.value) || 0,
        this.PIGeneralList.invAmount = this.PIGeneralForm.controls.invAmount.value || 0,
        this.PIGeneralList.exchangeRate = this.PIGeneralForm.controls.exchangeRate.value || 0,
        this.PIGeneralList.addressId = this.getVendorAddressId(this.PIGeneralForm.controls.addressId.value) || 0,
        this.PIGeneralList.contactId = this.getVendorContactId(this.PIGeneralForm.controls.contactId.value) || 0,
        this.PIGeneralList.groupCompanyId = this.getcompanyId(this.PIGeneralForm.controls.groupCompanyId.value) || 0,
        this.PIGeneralList.statusId = this.getStatusId(this.PIGeneralForm.controls.statusId.value) || 0,
        this.PIGeneralList.remarks = this.PIGeneralForm.controls.remarks.value || '',
        this.PIGeneralList.createdBy = parseInt(this.userId$),
        this.PIGeneralList.updatedBy = parseInt(this.userId$)
       if(id==2){
          if(this.PIGeneralList.statusId==1){
            this.PIGeneralList.statusId=2; 
          }
        }

      let payload: PIContainer = {
        purchaseInvoiceGeneral: this.PIGeneralList,
        purchaseInvoiceDetails: this.LineItems,
        purchaseInvoiceDocuments: this.attchmentList
      }
      console.log("payload", payload)

      this.PIs.PurchaseInvoiceSave(payload).subscribe((res: any) => {
        if (res) {
          if (this.purchaseInvoiceId) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Updated successfully",
              showConfirmButton: true,
            }).then((result) => {
              if (result.dismiss !== Swal.DismissReason.timer) {
                this.router.navigate(['/qms/transaction/purchase-invoice-list']);
              }
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added successfully",
              showConfirmButton: true,
            }).then((result) => {
              if (result.dismiss !== Swal.DismissReason.timer) {
                this.router.navigate(['/qms/transaction/purchase-invoice-list']);
              }
            });
          }

        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      },
        (err: HttpErrorResponse) => {
          let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
          if(stausCode === 500){
            this.errorHandler.handleError(err);
          } else if(stausCode === 400){
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        })
    }

   }
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }
  //Get Mat Id's
  getCustomerId(value: any) {
    let option = this.VendorList.find(option => option?.vendorName == value)
    return option?.vendorId;
  }
  getCustomerBillId(value: any) {
    let option = this.CustomerBillingCurrencyList.find(option => option?.currencyName == value)
    return option?.currencyId;
  }
  getVendorAddressId(value: any) {
    let option = this.vendorAddressList.find(option => option?.addressName == value)
    return option?.vAddressId;
  }
  getVendorContactId(value: any) {
    let option = this.ContactPersonList.find(option => option?.contactPerson == value)
    return option?.vContactId;
  }
  getStatusId(value: any) {
    let option = this.statusList.find(option => option?.piStatus == value)
    return option?.piStatusId;
  }
  getcompanyId(value: any) {
    let option = this.groupcomapny.find(option => option?.companyName == value)
    return option?.groupCompanyId;
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  draft() {

  }

  reset() {
    debugger;
    if(this.Mode=="Edit"){
      this.getPerFormaInvoice();
    }else{
      this.PIGeneralForm.reset();
      this.LineItems=[];
      this.attchmentList=[];
    }
  }

  Return() {
    this.router.navigate(["/qms/transaction/purchase-invoice-list"]);
  }

  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    // if (event.key === "Enter") {
    //   this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
    //   this.editRow = false;
    // }
  }
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
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      // this.oncancel(dataItem);
    }
  }

  //#endregion

  //#region Line Items

  addLineItem() {
    if(this.selectedbillCurrencyId!=null){
      const dialogRef = this.dialog.open(PIlineItemComponent, {
     
        data: {
          LineData: this.LineItems,
          Exchange:this.exchangeValue.exchangerate,
          currencyId:this.selectedbillCurrencyId
        }, disableClose: true, autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result!=null){
          this.LineItems.push(result);
          this.LineItems = [...this.LineItems];
          this.calculateAggregates();
          this.calculateAggregates1();
        }
      });
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select vendor currency and then Add",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  
  }


  onEdit(Data: any, i: number) {
    debugger
    const dialogRef = this.dialog.open(PIlineItemComponent, {
      data: {
        LineData: Data,
        Exchange:this.exchangeValue.exchangerate,
        currencyId:this.selectedbillCurrencyId,
        mode: 'Edit',
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.LineItems.splice(i, 1);
        this.LineItems.splice(
          i,
          0,
          result
        );
        this.LineItems = [...this.LineItems];
        this.calculateAggregates();
        this.calculateAggregates1();
      }
    });
  }


  onview(Data: any, i: number) {
    const dialogRef = this.dialog.open(PIlineItemComponent, {
      data: {
        LineData: Data,
        mode: 'view',
      }, disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.LineItems.splice(i, 1);
        this.LineItems.splice(
          i,
          0,
          result
        );
        this.LineItems = [...this.LineItems];
        this.calculateAggregates();
        this.calculateAggregates1();
      }
    });
  }

  onDelete(item: any, i: number) {
    debugger;
    if(this.selectedstatusId==1){
      if (i !== -1) {
        this.LineItems.splice(i, 1);
        this.LineItems = [...this.LineItems];
        this.calculateAggregates();
        this.calculateAggregates1();
      }
    }else{
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "You can't delete this because its move to Approval process or SAP Integration",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }


  //#region Add vendor value
  Onvendorvalue(Data: any, i: number) {
    const dialogRef = this.dialog.open(PIvendorvalueComponent, {
      data: {
        cuslineitem: this.LineItems[i],
        lineItemList: this.LineItems[i],
        Mode: this.Mode,
        billDate: this.PIGeneralForm.controls.billDate.value

      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result != null) {
        const QlineItem: PILineItemDetail = {
          ...Data,
          sourceFromId: result.sourceFromId,
          refNumberId: result.refNumberId,
          currencyId: result.currencyId,
          pInLineItemVendorValue: result
        }

        this.LineItems.splice(i, 1);
        this.LineItems.splice(
          i,
          0,
          QlineItem
        );
        this.LineItems = [...this.LineItems];
      }
    });
  }

  invamt(event:any) {
    debugger
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
    this.PIGeneralForm.controls['invAmount'].setValue(input.value);

    this.PIGeneralForm.controls['invAmount'].value;
  }
}
