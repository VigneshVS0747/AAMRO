import { ChangeDetectorRef, Component, ElementRef, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, map, skip, startWith } from 'rxjs';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { AddCustomerInfoComponent } from '../add-customer-info/add-customer-info.component';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatTabGroup } from '@angular/material/tabs';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import * as saveAs from 'file-saver';
import { environment } from 'src/environments/environment.development';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { CustomerService } from 'src/app/crm/master/customer/customer.service';
import { formatDate } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { ReasonService } from 'src/app/services/crm/reason.service';
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
  selector: 'app-add-customer-contract',
  templateUrl: './add-customer-contract.component.html',
  styleUrls: ['./add-customer-contract.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddCustomerContractComponent {


  filteredCustomer: Observable<any[]>;
  filteredCountry: Observable<any[]>;
  filteredCurrency: Observable<any[]>;
  filteredStatus: Observable<any[]>;
  filteredApprovalStatus: Observable<any[]>;
  filteredcancelReasonControl: Observable<any[]>;
  filteredcopyReference: Observable<any[]>;


  ContractList: any[] = [];
  pageSize = 10;
  skip = 0;
  showAddRow: boolean | undefined;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: any;
  editRow: boolean = false;
  pagePrivilege: Array<string>;


  dialogRef1: any;

  //Attachments
  DocControl = new FormControl('', [Validators.required, Validators.maxLength(250), this.DocumentNameValidator.bind(this)]);
  filteredDocName: Observable<any[]>;
  attchmentList: any[] = [];

  documentName: any
  remark: any;
  fileToUpload: File | null = null;
  selectedItem: any = null;
  SelectedDocName: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  customerContractFFSId: string | null;
  isViewMode: boolean = false
  CustomerList: any[] = [];
  CountryList: any[] = [];
  CurrencyList: any[] = [];
  statusList: any[] = [];
  approvalStatusList: any[] = [];
  CancelReasonList: any[] = [];
  ContractInfo: any;
  liveStatus = 1;
  documentList: any[] = [];
  selectedDocId: any;
  addressId: any;
  Filepath = environment.Fileretrive;
  hasViewRoute: any;
  disableStatus: boolean = true;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  isDraft: boolean;
  CustomerContractList: any[] = [];
  date = new Date;
  isEditDocument:boolean;
  isActive: boolean;
  contractId: any;
  UnknownValueList: any[]=[];
  selectedIndex = 0;

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>, public dialog: MatDialog, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private docmentsService: DocmentsService, private Fs: FileuploadService, private customerService: CustomerService,
    public dateValidator: DateValidatorService, private commonService: CommonService, private reasonmstSvc: ReasonService,
    private errorHandler: ApiErrorHandlerService) {
  }

  ngOnInit() {
    this.CustomerGetAll();
    this.CountryGetAll();
    this.CurrencyGetAll();
    this.getAllCStatus();
    this.getAllApprovalStatus();
    this.getReasons();
    this.GetUserId();
    this.getDocumentList();
    this.getAllCustomer();
    this.getUnknownValues();

    //CopyFrom
    this.route.queryParams.subscribe(params => {
      this.contractId = params['contractId'];
      if (this.contractId) {
        this.getFromExisting(this.contractId);
      }
    });

    this.route.paramMap.subscribe(params => {
      const currentUrl = this.router.url;
      this.hasViewRoute = currentUrl.includes('/view');
      console.log('this.hasViewRoute',this.hasViewRoute)
      if (this.hasViewRoute) {
        this.contractCustomerForm.disable();
      }
      this.customerContractFFSId = params.get('id');
      if (this.customerContractFFSId != '' && this.customerContractFFSId != null) {
        this.getGetAllContractCustomerById(this.customerContractFFSId)
      } else {
        const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.contractCustomerForm.patchValue({
          date: formattedDate
        });
        this.contractCustomerForm.patchValue({
          status: 'Draft',
          approvalStatus: 'NA'
        });
        this.isDraft = true;
        
        
      }
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
      },
    });

    if (this.customerContractFFSId != '' && this.customerContractFFSId != null) {
      this.disableStatus = false;
    }

    this.matFilters();
    if(!this.hasViewRoute && this.customerContractFFSId == '' || this.customerContractFFSId == null){
      this.getDocuments();
    }

  }
  
  getDocuments(){
    this.regionService.GetAllDocumentMappingByScreenId(16).subscribe(res => {
      if (res) {
        this.attchmentList = res.map(ele => {
          return {
            customerContractFFSId: 0,
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
      
  EditDoc(data: any, index: any) {
    debugger
    const updatedDocuments = this.attchmentList.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, Isedit: true };
      }
      return doc;
    });
   this.DocControl.patchValue(data.documentIdName)
    this.showAddRow = true;
    this.isEditDocument = true;
    this.attchmentList = updatedDocuments;
  }
  oncancelDoc(data: any, index: any){
    debugger
    if(data?.documentId){
      data.Isedit = false;
      this.attchmentList = [...this.attchmentList];
      this.showAddRow = false;
      data.newDoc = false;
      this.isEditDocument = false;
      return;
    } else {
      this.attchmentList = this.attchmentList.filter((_, idx) => idx !== index);
      this.showAddRow = false;
      this.isEditDocument = false;
    }
  }

  matFilters() {
    this.filteredCustomer = this.contractCustomerForm.controls.customerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );

    this.filteredCountry = this.contractCustomerForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || '')),
    );

    this.filteredCurrency = this.contractCustomerForm.controls.currency.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCurrency(value || '')),
    );

    this.filteredStatus = this.contractCustomerForm.controls.status.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStatus(value || '')),
    );

    this.filteredApprovalStatus = this.contractCustomerForm.controls.approvalStatus.valueChanges.pipe(
      startWith(''),
      map(value => this._filterApprovalStatus(value || '')),
    );

    this.filteredDocName = this.DocControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoc(value || '')),
    );

    this.filteredcancelReasonControl = this.contractCustomerForm.controls.cancelReasonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcancelReasonControl(value || '')),
    );

    this.filteredcopyReference = this.contractCustomerForm.controls.copyReference.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcopyReference(value || '')),
    );
  }

  private _filterCustomer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter((option: any) => option?.customerName.toLowerCase().includes(filterValue));
  }

  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CountryList.filter(option => option?.countryName.toLowerCase().includes(filterValue));
  }

  private _filterCurrency(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CurrencyList.filter(option => option?.currencyName.toLowerCase().includes(filterValue));
  }

  private _filterStatus(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.statusList.filter(option => option?.contractStatus.toLowerCase().includes(filterValue));
  }

  private _filterApprovalStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.approvalStatusList.filter(option => option?.approvalStatus.toLowerCase().includes(filterValue));
  }

  private _filterDoc(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.documentList.filter(option => option?.documentName.toLowerCase().includes(filterValue));
  }

  private _filteredcancelReasonControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CancelReasonList.filter((option: any) => option?.reasonName.toLowerCase().includes(filterValue));
  }

  private _filteredcopyReference(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CustomerContractList.filter((option: any) => option?.contractNumber.toLowerCase().includes(filterValue));
  }



  contractCustomerForm = new FormGroup({
    customerName: new FormControl('', [Validators.required, this.CustomerNameValidator.bind(this)]),
    date: new FormControl('', [Validators.required]),
    contractNumber: new FormControl({ value: null, disabled: true }),
    customerContractNumber: new FormControl('', [Validators.maxLength(25)]),
    address: new FormControl({ value: '', disabled: true }),
    validFrom: new FormControl('', [Validators.required]),
    validTo: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required, this.CountryValidator.bind(this)]),
    currency: new FormControl('', [Validators.required, this.CurrencyValidator.bind(this)]),
    remarks: new FormControl('', [Validators.maxLength(500)]),
    status: new FormControl('', [Validators.required]),
    cancelReasonControl: new FormControl({ disabled: true, value: '' }, [this.CancelReasonValidator.bind(this)]),
    cancelRemarkControl: new FormControl({ disabled: true, value: '' }, [Validators.maxLength(50)]),
    approvalStatus: new FormControl({ value: '', disabled: true }),
    copyReference: new FormControl('')
  },
    {
      validators: [
        DateValidatorService.dateRangeValidator('validFrom', 'validTo'),
        //DateValidatorService.validFromDateValidator('validFrom', 'date')
      ]
    }
  )

  get dateFilter() {
    return this.dateValidator.dateFilter;
  }

  get f() {
    return this.contractCustomerForm.controls;
  }

  CustomerNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.CustomerList?.some((option: any) => option?.customerName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CountryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CountryList?.some((option: any) => option?.countryName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  CurrencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.CurrencyList?.some((option: any) => option?.currencyName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  CancelReasonValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.CancelReasonList?.some((option: any) => option?.reasonName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  DocumentNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '' && value !== null) {
      var isValid = this.documentList?.some((option: any) => option?.documentName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }


  getGetAllContractCustomerById(id: any) {
    this.regionService.GetAllContractCustomerById(id).subscribe((res: any) => {
      this.ContractInfo = res?.result?.contractCustomer;
      this.ContractList = res?.result?.customerCategory;
      this.attchmentList = res?.result?.customerDocument;

      this.statusId = this.ContractInfo?.statusId;

      this.addressId = this.ContractInfo?.addressId;
      const addressParts = [
        this.ContractInfo?.addressLine1,
        this.ContractInfo?.addressLine2,
        this.ContractInfo?.cityName,
        this.ContractInfo?.stateName,
        this.ContractInfo?.aCountryName
      ];

      const fullAddress = addressParts.filter(part => part).join(', ');


      this.contractCustomerForm.patchValue({
        customerName: this.ContractInfo.customerName,
        date: this.ContractInfo.contractDate,
        contractNumber: this.ContractInfo.contractNumber,
        customerContractNumber: this.ContractInfo.customerRefContractNo,
        address: fullAddress,
        validFrom: this.ContractInfo.validFrom === '1900-01-01T00:00:00' ? null : this.ContractInfo.validFrom,
        validTo: this.ContractInfo.validTo === '1900-01-01T00:00:00' ? null : this.ContractInfo.validTo,        
        country: this.ContractInfo.countryName,
        currency: this.ContractInfo.currencyName,
        remarks: this.ContractInfo.remarks,
        status: this.ContractInfo.contractStatus,
        cancelReasonControl: this.ContractInfo.reasonName,
        cancelRemarkControl: this.ContractInfo.closeRemark,
        approvalStatus: this.ContractInfo.approvalStatus ? this.ContractInfo.approvalStatus : 'NA',
      });
      if (this.hasViewRoute) {
        this.contractCustomerForm.get('status')?.disable();
      } else {
        this.contractCustomerForm.get('status')?.enable();
      }
      if (this.ContractInfo.contractStatus === 'InActive') {
        this.contractCustomerForm.controls.cancelReasonControl.enable();
        this.contractCustomerForm.controls.cancelRemarkControl.enable();
      }

      this.showCancelFields = (this.ContractInfo.contractStatus === 'InActive');
      if (this.ContractInfo.contractStatus === "Draft") {
        this.isDraft = true;
      } else {
        this.isDraft = false;
      }
      this.contractCustomerForm.get('customerName')?.updateValueAndValidity();
      this.contractCustomerForm.controls.customerName?.updateValueAndValidity();
      this.cdr.detectChanges();

      let status = this.contractCustomerForm.controls.status.value;
      if (status === 'Draft') {
        this.contractCustomerForm.enable();
        this.contractCustomerForm.controls.address.disable();
        this.contractCustomerForm.controls.approvalStatus.disable();
      } else if(status === 'Active') {
        this.isActive = true;
        this.contractCustomerForm.disable();
        this.contractCustomerForm.controls.validFrom.enable();
        this.contractCustomerForm.controls.validTo.enable();
        this.contractCustomerForm.controls.status.enable();
        this.contractCustomerForm.controls.remarks.enable();

      } else {
        this.contractCustomerForm.disable();

      }
      this.contractCustomerForm.updateValueAndValidity();
      this.contractCustomerForm.get('validFrom')?.updateValueAndValidity({ emitEvent: true });
      this.contractCustomerForm.get('validTo')?.updateValueAndValidity({ emitEvent: true });
      this.cdr.detectChanges();
    })

    setTimeout(()=>{
      if(this.hasViewRoute){
        this.contractCustomerForm.disable();
      }
    },1500)

  }


  statusDisableOption(option: any) {
    if(this.ContractInfo?.contractStatus === 'Active'){
      return option?.contractStatus !== 'InActive' && option?.contractStatus !== 'Active';
    } else if(!this.customerContractFFSId){
        return option?.contractStatus !== 'Draft'
    } else  {
      return option?.contractStatus !== this.ContractInfo?.contractStatus;
    }
    
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getAllCustomer() {
    this.regionService.GetAllContractCustomer().subscribe((res: any) => {
      console.log(res)
      this.CustomerContractList = res?.result;
      this.matFilters();
    })
  }
  getUnknownValues() {
    this.commonService.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }


  validatePastedValue() {
    const pastedValue = this.contractCustomerForm.get('customerName')?.value;
    const matchingOption = this.CustomerList.find(option => option.customerName === pastedValue);
    if (matchingOption?.customerName) {
      this.OnCustomerChangeEvent(matchingOption?.customerName);
    }
  }

  OnCustomerChangeEvent(event: any) {
    let selectedCustomerName = event?.option?.value ? event?.option?.value : event;
    let serviceCountry = this.contractCustomerForm.controls.country.value;
    if (this.CustomerContractList?.length != 0) {
      let selectedCustomer = this.CustomerList.find(option => option.customerName === selectedCustomerName);
      if (selectedCustomer) {
        const existingContract = this.CustomerContractList.find(contract =>
          contract.customerName === selectedCustomerName &&
          contract.countryName === serviceCountry &&
          (contract.contractStatus === 'Draft' ||
            contract.contractStatus === 'Pending for Approval' ||
            contract.contractStatus === 'Active')
        );

        if (existingContract) {
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: `The customer '${selectedCustomerName}' already has a contract with a 
            status of '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
            showConfirmButton: true,
          });
          this.contractCustomerForm.controls.customerName.reset();
          this.contractCustomerForm.controls.address.reset();
          return;
        } else {
          let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
          this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
            this.addressId = res[0]?.cAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.contractCustomerForm.patchValue({
              address: fullAddress
            });

          })
        }
      } else {
        let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
        this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
          this.addressId = res[0]?.cAddressId;
          const addressParts = [
            res[0]?.addressLine1 || '',
            res[0]?.addressLine2 || '',
            res[0]?.cityName || '',
            res[0]?.stateName || '',
            res[0]?.countryName || ''
          ];

          const fullAddress = addressParts.filter(part => part).join(', ');

          this.contractCustomerForm.patchValue({
            address: fullAddress
          });

        })
      }
      this.matFilters();
    }else{
      let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
          this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
            this.addressId = res[0]?.cAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.contractCustomerForm.patchValue({
              address: fullAddress
            });

          })
    }

    if(selectedCustomerName === '' || selectedCustomerName === null || selectedCustomerName === undefined){
      this.contractCustomerForm.controls.address.reset();
    }
  }

  OnCountryEvent(event: any) {
    let selectedCustomerName = this.contractCustomerForm.controls.customerName.value;
    let serviceCountry = event?.option?.value ? event?.option?.value : event;
    if (this.CustomerContractList?.length != 0) {
      let selectedCustomer = this.CustomerList.find(option => option.customerName === selectedCustomerName);
      if (selectedCustomer) {
        const existingContract = this.CustomerContractList.find(contract =>
          contract.customerName === selectedCustomerName &&
          contract.countryName === serviceCountry &&
          (contract.contractStatus === 'Draft' ||
            contract.contractStatus === 'Pending for Approval' ||
            contract.contractStatus === 'Active')
        );

        if (existingContract) {
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: `The customer '${selectedCustomerName}' already has a contract with a 
            status of '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
            showConfirmButton: true,
          });
          this.contractCustomerForm.controls.country.reset();
          //this.contractCustomerForm.controls.address.reset();
          return;
        } else {
          let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
          this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
            this.addressId = res[0]?.cAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.contractCustomerForm.patchValue({
              address: fullAddress
            });

          })
        }
      } else {
        let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
        this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
          this.addressId = res[0]?.cAddressId;
          const addressParts = [
            res[0]?.addressLine1 || '',
            res[0]?.addressLine2 || '',
            res[0]?.cityName || '',
            res[0]?.stateName || '',
            res[0]?.countryName || ''
          ];

          const fullAddress = addressParts.filter(part => part).join(', ');

          this.contractCustomerForm.patchValue({
            address: fullAddress
          });

        })
      }
      this.matFilters();
    }else{
      let id = this.CustomerList.find(option => option.customerName === selectedCustomerName);
          this.regionService.getAddressByCustomerId(id?.customerId).subscribe((res: any) => {
            this.addressId = res[0]?.cAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.contractCustomerForm.patchValue({
              address: fullAddress
            });

          })
    }

    if(selectedCustomerName === '' || selectedCustomerName === null || selectedCustomerName === undefined){
      this.contractCustomerForm.controls.address.reset();
    }
    this.matFilters();
  }

  OnchangeEvent(event: any) {
    this.matFilters();
  }

  public showCancelFields = false;
  OnStatusChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;

    this.showCancelFields = (value === 'InActive');
    
    this.contractCustomerForm.controls.cancelReasonControl.disable();
    this.contractCustomerForm.controls.cancelRemarkControl.disable();
    this.contractCustomerForm.controls.cancelReasonControl.reset();
    this.contractCustomerForm.controls.cancelRemarkControl.reset();
    this.contractCustomerForm.controls.cancelReasonControl.clearValidators();
    if (value === 'InActive') {
      this.contractCustomerForm.controls.cancelReasonControl.enable();
      this.contractCustomerForm.controls.cancelRemarkControl.enable();
      this.contractCustomerForm.controls.cancelReasonControl.setValidators([Validators.required, this.CancelReasonValidator.bind(this)]);
      this.contractCustomerForm.controls.cancelRemarkControl.setValidators([Validators.required, Validators.maxLength(500)]);
    }
    this.contractCustomerForm.controls.cancelReasonControl.updateValueAndValidity();
    this.contractCustomerForm.controls.cancelRemarkControl.updateValueAndValidity();
    this.contractCustomerForm.controls.cancelRemarkControl.updateValueAndValidity();

    this.matFilters();
  }


  //Copy from existing contract
  // validatePastedValueInCopy(){
  //   const pastedValue = this.contractCustomerForm.get('copyReference')?.value;
  //   const matchingOption = this.CustomerContractList.find(option => option.contractNumber === pastedValue);
  //   if (matchingOption?.contractNumber) {
  //     this.OnCustomerChangeEvent(matchingOption?.contractNumber);
  //   }
  // }
  // OnCopyRefernceEvent(event: any){
  //   let value = event?.option?.value ? event?.option?.value : event;
  //   let selectedContract = this.CustomerContractList.find(option => option.contractNumber === value);
  //   if(selectedContract){
  //     this.getFromExisting(selectedContract?.customerContractFFSId);
  //   }
  // }

  getFromExisting(id: any) {
    this.regionService.GetAllContractCustomerById(id).subscribe((res: any) => {
      this.ContractInfo = res?.result?.contractCustomer;
      this.ContractList = res?.result?.customerCategory?.map((item:any) => {
        return {
          ...item,
          customerContractFFSId: 0,
          ccffsDetailId: 0,
        };
      });
      
      this.attchmentList = res?.result?.customerDocument?.map((item:any) => {
        return {
          ...item,
          customerContractFFSId: 0,
          CCFFSDocumentId: 0,
        };
      });

      this.ContractInfo.customerContractFFSId = 0;
      this.statusId = this.ContractInfo?.statusId;

      this.addressId = this.ContractInfo?.addressId;
      const addressParts = [
        this.ContractInfo?.addressLine1,
        this.ContractInfo?.addressLine2,
        this.ContractInfo?.cityName,
        this.ContractInfo?.stateName,
        this.ContractInfo?.aCountryName
      ];

      const fullAddress = addressParts.filter(part => part).join(', ');


      this.contractCustomerForm.patchValue({
        customerName: this.ContractInfo.customerName,
        //contractNumber: this.ContractInfo.contractNumber,
        //customerContractNumber: this.ContractInfo.customerRefContractNo,
        address: fullAddress,
        country: this.ContractInfo.countryName,
        currency: this.ContractInfo.currencyName,
        remarks: this.ContractInfo.remarks,
        cancelReasonControl: this.ContractInfo.reasonName,
        cancelRemarkControl: this.ContractInfo.closeRemark,
        approvalStatus: this.ContractInfo.approvalStatus ? this.ContractInfo.approvalStatus : 'NA',
      });
      if (this.hasViewRoute) {
        this.contractCustomerForm.get('status')?.disable();
      } else {
        this.contractCustomerForm.get('status')?.enable();
      }
      if (this.ContractInfo.contractStatus === 'InActive') {
        this.contractCustomerForm.controls.cancelReasonControl.enable();
        this.contractCustomerForm.controls.cancelRemarkControl.enable();
      }

      this.showCancelFields = (this.ContractInfo.contractStatus === 'InActive');

      this.contractCustomerForm.get('customerName')?.updateValueAndValidity();
      this.contractCustomerForm.controls.customerName?.updateValueAndValidity();
      this.cdr.detectChanges();

      let status = this.contractCustomerForm.controls.status.value;
      if (status === 'Draft') {
        this.contractCustomerForm.enable();
        this.contractCustomerForm.controls.address.disable();
        this.contractCustomerForm.controls.approvalStatus.disable();
      } else if (status === 'Active') {
        // this.contractCustomerForm.disable();
        // this.contractCustomerForm.controls.customerName.enable();
        // this.contractCustomerForm.controls.validFrom.enable();
        // this.contractCustomerForm.controls.validTo.enable();
        // this.contractCustomerForm.controls.status.enable();
        // this.contractCustomerForm.controls.remarks.enable();
        // this.contractCustomerForm.controls.copyReference.enable();
        // this.contractCustomerForm.controls.country.enable();
        // this.contractCustomerForm.controls.currency.enable();
      } else {
        this.contractCustomerForm.disable();

      }
      this.contractCustomerForm.updateValueAndValidity();
      this.contractCustomerForm.get('validFrom')?.updateValueAndValidity({ emitEvent: true });
      this.contractCustomerForm.get('validTo')?.updateValueAndValidity({ emitEvent: true });
      this.cdr.detectChanges();
    })

    setTimeout(() => {
      if (this.hasViewRoute) {
        this.contractCustomerForm.disable();
      }
    }, 1500)

  }


  CustomerGetAll() {
    this.customerService.getAllActiveCustomer().subscribe((res: any) => {
      this.CustomerList = res;
      this.matFilters();
    })
  }
  CountryGetAll() {
    this.regionService.getAllCountries(1).subscribe((res: any) => {
      this.CountryList = res;
      this.matFilters();
    })
  }
  CurrencyGetAll() {
    this.regionService.GetAllCurrency(1).subscribe((res: any) => {
      this.CurrencyList = res;
      this.matFilters();
    })
  }

  getAllCStatus() {
    this.regionService.GetAllContractCustomerStatus().subscribe((res: any) => {
      this.statusList = res?.result;
      this.matFilters();
    });
  }
  getAllApprovalStatus() {
    this.commonService.GetAllApprovalStatus().subscribe((res: any) => {
      this.approvalStatusList = res;
      this.matFilters();
    });
  }

  getReasons() {
    this.reasonmstSvc.getAllReason(1).subscribe((result) => {
      this.CancelReasonList = result;
      this.matFilters();
    });
  }

  Add() {

    let status = this.contractCustomerForm.controls.status.value;
    if(status === 'Draft' || status === 'Active'){
      this.dialogRef1 = this.dialog.open(AddCustomerInfoComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          customerId: this.customerContractFFSId ? this.customerContractFFSId : 0,
          selectedCategory: 0,
          createdBy: parseInt(this.userId$),
          createdDate: this.ContractInfo?.createdDate,
          overallList: this.ContractList
        },
      });
      this.dialogRef1.afterClosed().subscribe((result: any) => {
        if (result) {
          if (this.checkForDuplicates(this.ContractList, result)) {
            Swal.fire({
              icon: "error",
              title: "Duplicate",
              text: "Data already exist..!",
              confirmButtonColor: "#007dbd",
              showConfirmButton: true,
              timer: 2000,
            });
          } else {
            this.ContractList = [...this.ContractList, result];
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't add the line item when the status is "${status}".`,
        showConfirmButton: true,
      });
    }


  }

  oncancel(obj: any) {

  }

  Edit(obj: any, index: any) {
    console.log(obj)
    let status = this.contractCustomerForm.controls.status.value;
    if(status === 'Draft' || status === 'Active'){
      let selectedCategory: any[] = this.ContractList[index];
      this.dialogRef1 = this.dialog.open(AddCustomerInfoComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          customerId: this.customerContractFFSId ? this.customerContractFFSId : 0,
          selectedCategoryId: obj?.ccffsDetailId,
          createdBy: parseInt(this.userId$),
          createdDate: this.ContractInfo?.createdDate,
          list: selectedCategory,
          row: this.generateRandomId(5),
          view: false,
          overallList: this.ContractList
        },
      });
      this.dialogRef1.afterClosed().subscribe((result: any) => {
        if (result) {
  
          let index = this.ContractList.findIndex(item => item.rowNumber === result.rowNumber);
          if (index !== -1) {
            this.ContractList[index] = result;
            this.ContractList = [...this.ContractList]
          } else {
            if (this.checkForDuplicates(this.ContractList, result)) {
              Swal.fire({
                icon: "error",
                title: "Duplicate",
                text: "Data already exist..!",
                confirmButtonColor: "#007dbd",
                showConfirmButton: true,
                timer: 2000,
              });
            } else {
              this.ContractList = [...this.ContractList, result];
            }
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't edit the line item when the status is "${status}".`,
        showConfirmButton: true,
      });
    }


  }

  checkForDuplicates(array: any[], newItem: any): boolean {
    return array.some(item =>
      String(item.customerContractFFSId) === String(newItem.customerContractFFSId) &&
      String(item.aamroLineItemId) === String(newItem.aamroLineItemId)
    );
  }

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  Save(obj: any) {

  }

  Update(obj: any) {

  }
  view(obj: any, index: any) {
    let selectedCategory: any[] = this.ContractList[index];
    this.dialogRef1 = this.dialog.open(AddCustomerInfoComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        customerId: this.customerContractFFSId ? this.customerContractFFSId : 0,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: this.ContractInfo?.createdDate,
        list: selectedCategory,
        view: true
      },
    });
  }

  Delete(id: any, index: any) {
    let status = this.contractCustomerForm.controls.status.value;
    if(status === 'Draft'){
      this.ContractList = this.ContractList.filter((_, i) => i !== index);
      this.cdr.detectChanges();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't delete the line item when the status is "${status}".`,
        showConfirmButton: true,
      });
    }


  }





  //Attachments
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
    const acceptedFileFormats = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'pdf',
      'doc', 'docx', 'xls', 'xlsx'
    ];

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (acceptedFileFormats.includes(fileExtension)) {
        this.fileToUpload = file;
      } else {
        Swal.fire({
          icon: "info",
          title: "Invalid Formate",
          text: "Invalid file format. Please upload a file with an accepted format.",
          showConfirmButton: true,
        });
        this.fileInput.nativeElement.value = '';
      }
    }
  }



  addAttached() {
    this.DocControl.reset();
    let status = this.contractCustomerForm.controls.status.value;
    this.isEditDocument = false;
    if(status === 'Draft' || status === 'Active'){
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
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't add the documents when the status is "${status}".`,
        showConfirmButton: true,
      });
    }

  }

  AttachedSave(dataItem: any) {
    if (this.DocControl.invalid || (this.fileInput.nativeElement.value == '' || this.fileInput.nativeElement.value == undefined || this.fileInput.nativeElement.value == null)) {
      this.DocControl.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });

      return;
    } else {
      const formData = {
        "customerContractFFSId": this.customerContractFFSId ? this.customerContractFFSId : 0,
        documentId: this.selectedDocId,
        documentIdName: this.SelectedDocName,
        documentName: this.fileToUpload?.name,
        remarks: this.remark,
        Isedit: false,
        file: this.fileToUpload,
        "createdBy": parseInt(this.userId$),
        "createdDate": new Date()
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
  AttachedUpdate(dataItem: any) {

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
    let status = this.contractCustomerForm.controls.status.value;
    if(status === 'Draft'){
      this.attchmentList = this.attchmentList.filter((_, i) => i !== index);
      this.cdr.detectChanges();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `Can't delete the document when the status is "${status}".`,
        showConfirmButton: true,
      });
    }

  }

  onAttachedCancel(obj: any, index: any) {
    obj.Isedit = false;
    this.showAddRow = false;
    this.editRow = false;
    this.attchmentList = this.attchmentList.filter((_, i) => i !== index);
    this.cdr.detectChanges();
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  Return() {
    this.router.navigate(["/qms/transaction/customer-contract-list"]);
  }

  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
      this.editRow = false;
    }
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
      this.oncancel(dataItem);
    }
  }

  //#endregion


  //Overall Control

  triggerValidation() {
    Object.keys(this.contractCustomerForm.controls).forEach(field => {
      const control = this.contractCustomerForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  validateDateFields(): boolean {
    const validFrom = this.contractCustomerForm.controls.validFrom.value;
    const validTo = this.contractCustomerForm.controls.validTo.value;

    let isValid = true;

    if (validFrom === null || validFrom === undefined || validFrom === '') {
      this.contractCustomerForm.controls.validFrom.setErrors({ required: true });
      isValid = false;
    } else {
      this.contractCustomerForm.controls.validFrom.setErrors(null);
    }

    if (validTo === null || validTo === undefined || validTo === '') {
      this.contractCustomerForm.controls.validTo.setErrors({ required: true });
      isValid = false;
    } else {
      this.contractCustomerForm.controls.validTo.setErrors(null);
    }

    return isValid;
  }


  statusId: any;
  // saveAll(event: any) {
  //   this.triggerValidation();
  //   let checkDate = !this.validateDateFields()
  //   if (this.contractCustomerForm.invalid || this.showAddRow || checkDate) {
  //     this.contractCustomerForm.controls.validTo.markAllAsTouched();

  //     if (this.DocControl.invalid) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops!",
  //         text: "Please fill the mandatory fields and save the changes in attachments",
  //         showConfirmButton: true,
  //       });
  //       this.DocControl.markAllAsTouched();
  //     } else {
  //       this.tabGroup.selectedIndex = 0;
  //     }


  //     if (this.showAddRow) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Save is pending",
  //         text: "Please save the changes in attachments",
  //         showConfirmButton: true,
  //       });
  //       this.tabGroup.selectedIndex = 1;
  //     }

  //     if (this.contractCustomerForm.invalid) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops!",
  //         text: "Please fill the mandatory fields",
  //         showConfirmButton: true,
  //       });
  //       this.tabGroup.selectedIndex = 0;

  //       this.contractCustomerForm.markAllAsTouched();
  //     }

  //   } else {

  //     const statusID = this.getStatusId(this.contractCustomerForm.controls.status.value);

  //     if (event === 'Save') {
  //       if (statusID == 1) {
  //         this.statusId = 3;
  //       }
  //       else if (statusID == 6) {
  //         this.statusId = 6;
  //       } else if (statusID == 5) {
  //         this.statusId = 5;
  //       } else if (statusID == 3) {
  //         this.statusId = 3;
  //       } else if (statusID == 2) {
  //         this.statusId = 2;
  //       } else if (statusID == 4) {
  //         this.statusId = 4;
  //       }
  //     }
  //     else if (event === 'Draft') {
  //       if (statusID == 1) {
  //         this.statusId = 1;
  //       } 
  //     }


  //     //Contract Customer
  //     let payload1 = {
  //       contractCustomer: {
  //         customerContractFFSId: this.customerContractFFSId ? this.customerContractFFSId : 0,
  //         contractNumber: this.contractCustomerForm.controls.contractNumber.value || null,
  //         customerId: this.getContractNumber(this.contractCustomerForm.controls.customerName.value) || 0,
  //         contractDate: this.normalizeDateToUTC(this.contractCustomerForm.controls.date.value) || null,
  //         customerRefContractNo: this.contractCustomerForm.controls.customerContractNumber.value || null,
  //         validFrom: this.normalizeDateToUTC(this.contractCustomerForm.controls.validFrom.value) || null,
  //         validTo: this.normalizeDateToUTC(this.contractCustomerForm.controls.validTo.value) || null,
  //         addressId: this.addressId || null,
  //         countryId: this.getCountryId(this.contractCustomerForm.controls.country.value),
  //         currencyId: this.getCurrencyId(this.contractCustomerForm.controls.currency.value),
  //         statusId: this.statusId || this.getStatusId(this.contractCustomerForm.controls.status.value),
  //         approvalStatusId: this.getApprovalStatusId(this.contractCustomerForm.controls.approvalStatus.value) || 0,
  //         closeReasonId: this.getReasonId(this.contractCustomerForm.controls.cancelReasonControl.value) || 0,
  //         closeRemark: this.contractCustomerForm.controls.cancelRemarkControl.value || null,
  //         remarks: this.contractCustomerForm.controls.remarks.value || null,
  //         createdBy: parseInt(this.userId$),
  //         createdDate: this.ContractInfo?.createdDate,
  //         updatedBy: parseInt(this.userId$),
  //         updatedDate: this.normalizeDateToUTC(new Date())
  //       },
  //       "customerCategory": this.ContractList,
  //       "customerDocument": this.attchmentList,
  //     }

  //     console.log(payload1)
  //     this.regionService.AddContractCustomer(payload1).subscribe((res: any) => {
  //       debugger
  //       const formData = new FormData();
  //       this.attchmentList.forEach(item => {
  //         if (item.file) {
  //           formData.append('imageFile', item.file, item.documentName);
  //         }
  //       });
  //       this.Fs.FileUpload(formData).subscribe({
  //         next: (res) => {

  //         },
  //         error: (error) => {
  //         }
  //       });
  //       if (res) {
  //         if (this.customerContractFFSId) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Updated successfully",
  //             text: `Contract Number: ${res?.contractCustomer?.contractNumber}`,
  //             showConfirmButton: true,
  //           }).then((result) => {
  //             if (result.dismiss !== Swal.DismissReason.timer) {
  //               if (this.customerContractFFSId) {
  //                 // location.reload();
  //                 this.router.navigate(['/qms/transaction/customer-contract-list']);
  //               } else {
  //                 // let id = res?.contractCustomer?.customerContractFFSId
  //                 // this.router.navigate(['/qms/transaction/add-contract-customer', id]);
  //                 this.router.navigate(['/qms/transaction/customer-contract-list']);
  //               }

  //             }
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Added successfully",
  //             text: `Contract Number: ${res?.contractCustomer?.contractNumber}`,
  //             showConfirmButton: true,
  //           }).then((result) => {
  //             if (result.dismiss !== Swal.DismissReason.timer) {
  //               if (this.customerContractFFSId) {
  //                 // location.reload();
  //                 this.router.navigate(['/qms/transaction/customer-contract-list']);
  //               } else {
  //                 // let id = res?.contractCustomer?.customerContractFFSId
  //                 // this.router.navigate(['/qms/transaction/add-contract-customer', id]);
  //                 this.router.navigate(['/qms/transaction/customer-contract-list']);
  //               }

  //             }
  //           });
  //         }

  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops!",
  //           text: "Something went wrong",
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
  //       if(stausCode === 500){
  //         this.errorHandler.handleError(err);
  //       } else if(stausCode === 400){
  //         this.errorHandler.FourHundredErrorHandler(err);
  //       } else {
  //         this.errorHandler.commonMsg();
  //       }
  //     })
  //   }
  // }

  customerAndCountryValidation() {
    let selectedCustomerName = this.contractCustomerForm.controls.customerName.value;
    let serviceCountry = this.contractCustomerForm.controls.country.value;

    const existingContract = this.CustomerContractList.find(contract =>
      contract.customerName === selectedCustomerName &&
      contract.countryName === serviceCountry &&
      contract.customerContractFFSId !== this.ContractInfo.customerContractFFSId && 
      (contract.contractStatus === 'Draft' ||
        contract.contractStatus === 'Pending for Approval' ||
        contract.contractStatus === 'Active')
    );

    if (existingContract) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `The customer '${selectedCustomerName}' already has a contract with a 
        status of '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
        showConfirmButton: true,
      });
      this.contractCustomerForm.controls.country.reset();
      this.changeTab(0);
      return false;
    }
    return true;
  }

  
  saveAll(event: any) {
    if (event === 'Save') {
      this.triggerValidation();

      if(this.contractCustomerForm.valid){
        if (!this.customerAndCountryValidation()) {
          return;
        }
      }


      let checkDate = !this.validateDateFields();

      if (this.contractCustomerForm.invalid || this.showAddRow || checkDate) {
        this.contractCustomerForm.controls.validTo.markAllAsTouched();

        if (this.DocControl.invalid) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the mandatory fields and save the changes in attachments",
            showConfirmButton: true,
          });
          this.DocControl.markAllAsTouched();
          this.changeTab(1);
        } else {
          this.tabGroup.selectedIndex = 0;
        }


        if (this.showAddRow) {
          Swal.fire({
            icon: "info",
            title: "Save is pending",
            text: "Please save the changes in attachments",
            showConfirmButton: true,
          });
          this.changeTab(1);
        }

        if (this.contractCustomerForm.invalid) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the mandatory fields",
            showConfirmButton: true,
          });
          this.changeTab(0);

          this.contractCustomerForm.markAllAsTouched();
        }
        return;
      } else {
        this.save(event);
      }
    } else {
      this.save(event);
    }
  }

  save(event:any) {
    const statusID = this.getStatusId(this.contractCustomerForm.controls.status.value);

    if (event === 'Save') {
      if (statusID == 1) {
        this.statusId = 3;
      }
      else if (statusID == 6) {
        this.statusId = 6;
      } else if (statusID == 5) {
        this.statusId = 5;
      } else if (statusID == 3) {
        this.statusId = 3;
      } else if (statusID == 2) {
        this.statusId = 2;
      } else if (statusID == 4) {
        this.statusId = 4;
      }
    }
    else if (event === 'Draft') {
      if (statusID == 1) {
        this.statusId = 1;
      }
      this.statusId = 1;
    }

    const defaultDate = new Date('1900-01-01');
    let payload1 = {
      contractCustomer: {
        customerContractFFSId: this.customerContractFFSId ? this.customerContractFFSId : 0,
        contractNumber: this.contractCustomerForm.controls.contractNumber.value || null,
        customerId: this.getContractNumber(this.contractCustomerForm.controls.customerName.value) || null,
        contractDate: this.normalizeDateToUTC(this.contractCustomerForm.controls.date.value) || null,
        customerRefContractNo: this.contractCustomerForm.controls.customerContractNumber.value || null,
        validFrom: this.normalizeDateToUTC(this.contractCustomerForm.controls.validFrom.value || defaultDate) || null,
        validTo: this.normalizeDateToUTC(this.contractCustomerForm.controls.validTo.value || defaultDate) || null,
        addressId: this.addressId || null,
        countryId: this.getCountryId(this.contractCustomerForm.controls.country.value) || this.getUnknownId("Country"),
        currencyId: this.getCurrencyId(this.contractCustomerForm.controls.currency.value) || this.getUnknownId("Currency"),
        statusId: this.statusId || this.getStatusId(this.contractCustomerForm.controls.status.value) || null,
        approvalStatusId: this.getApprovalStatusId(this.contractCustomerForm.controls.approvalStatus.value) || null,
        closeReasonId: this.getReasonId(this.contractCustomerForm.controls.cancelReasonControl.value) || null,
        closeRemark: this.contractCustomerForm.controls.cancelRemarkControl.value || null,
        remarks: this.contractCustomerForm.controls.remarks.value || null,
        createdBy: parseInt(this.userId$),
        createdDate: this.ContractInfo?.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.normalizeDateToUTC(new Date())
      },
      "customerCategory": this.ContractList,
      "customerDocument": this.attchmentList,
    }

    console.log(payload1)
    this.regionService.AddContractCustomer(payload1).subscribe((res: any) => {
      debugger
      const formData = new FormData();
      this.attchmentList.forEach(item => {
        if (item.file) {
          formData.append('imageFile', item.file, item.documentName);
        }
      });
      this.Fs.FileUpload(formData).subscribe({
        next: (res) => {

        },
        error: (error) => {
        }
      });
      if (res) {
        if (this.customerContractFFSId) {
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: `Contract Number: ${res?.contractCustomer?.contractNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.customerContractFFSId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/customer-contract-list']);
              } else {
                // let id = res?.contractCustomer?.customerContractFFSId
                // this.router.navigate(['/qms/transaction/add-contract-customer', id]);
                this.router.navigate(['/qms/transaction/customer-contract-list']);
              }

            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: `Contract Number: ${res?.contractCustomer?.contractNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.customerContractFFSId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/customer-contract-list']);
              } else {
                // let id = res?.contractCustomer?.customerContractFFSId
                // this.router.navigate(['/qms/transaction/add-contract-customer', id]);
                this.router.navigate(['/qms/transaction/customer-contract-list']);
              }

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
        if (stausCode === 500) {
          this.errorHandler.handleError(err);
        } else if (stausCode === 400) {
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      })
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  reset() {
    location.reload();
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getContractNumber(value: any) {
    let customer = this.CustomerList.find(option => option?.customerName == value)
    return customer?.customerId;
  }
  getCountryId(value: any) {
    let customer = this.CountryList.find(option => option?.countryName == value)
    return customer?.countryId;
  }
  getCurrencyId(value: any) {
    let customer = this.CurrencyList.find(option => option?.currencyName == value)
    return customer?.currencyId;
  }
  getStatusId(value: any) {
    let customer = this.statusList.find(option => option?.contractStatus == value)
    return customer?.contractStatusId || null;
  }
  getApprovalStatusId(value: any) {
    let option = this.approvalStatusList.find(option => option?.approvalStatus == value)
    return option?.approvalStatusId;
  }
  getReasonId(value: any) {
    let option = this.CancelReasonList.find(option => option?.reasonName == value)
    return option?.reasonId;
  }
  getUnknownId(value: any) {
    let option = this.UnknownValueList.find(option => option?.name == value)
    return option?.id;
  }


  Downloads(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }
}
