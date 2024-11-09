import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { DocmentsService } from 'src/app/crm/master/document/document.service';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { environment } from 'src/environments/environment.development';
import { AddVendorContractInfoComponent } from '../add-vendor-contract-info/add-vendor-contract-info.component';
import Swal from 'sweetalert2';
import { AddCustomerInfoComponent } from '../../customer-contract/add-customer-info/add-customer-info.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { ImagePreviewComponent } from '../../customer-contract/image-preview/image-preview.component';
import * as saveAs from 'file-saver';
import { VendorService } from 'src/app/crm/master/vendor/vendor.service';
import { AddVendorContractMappingComponent } from '../add-vendor-contract-mapping/add-vendor-contract-mapping.component';
import { VendorContractDetails } from '../vendor-contract-modal';
import { DateValidatorService } from 'src/app/qms/date-validator';
import { formatDate } from '@angular/common';
import { ReasonService } from 'src/app/services/crm/reason.service';
import { CommonService } from 'src/app/services/common.service';
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
  selector: 'app-add-vendor-contract',
  templateUrl: './add-vendor-contract.component.html',
  styleUrls: ['./add-vendor-contract.component.css', '../../../qms.styles.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddVendorContractComponent {


  //Autocomplete observables
  filteredVendor: Observable<any[]>;
  filteredCountry: Observable<any[]>;
  filteredCurrency: Observable<any[]>;
  filteredStatus: Observable<any[]>;
  filteredApprovalStatus: Observable<any[]>;
  filteredcancelReasonControl: Observable<any[]>;
  filteredcopyReference: Observable<any[]>;

  DocControl = new FormControl('', [Validators.required, Validators.maxLength(250), this.DocumentNameValidator.bind(this)]);
  filteredDocName: Observable<any[]>;
  attchmentList: any[] = [];

  VendorList: any[] = [];
  addressId: any;
  CustomerList: any[] = [];
  CountryList: any[] = [];
  CurrencyList: any[] = [];
  statusList: any[] = [];
  approvalStatusList: any[] = [];
  CancelReasonList: any[] = [];
  ContractInfo: any;
  liveStatus = 1;
  documentList: any[] = [];
  documentName: any
  remark: any;
  fileToUpload: File | null = null;
  selectedItem: any = null;
  SelectedDocName: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  vendorContractFFSId: string | null;

  ContractList: any[] = [];
  pageSize = 10;
  skip = 0;
  showAddRow: boolean;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  userId$: any;
  editRow: boolean = false;
  pagePrivilege: Array<string>;
  selectedDocId: any;
  Filepath = environment.Fileretrive;
  hasViewRoute: any;
  disableStatus: boolean = true;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;

  dialogRef1: any;
  dialogRef2: any;
  mappingList: any;
  isDraft: boolean;
  VendorContractList: any[]=[];
  date = new Date;
  isEditDocument:boolean;
  isActive: boolean;
  contractId: any;
  UnknownValueList: any[]=[];
  selectedIndex = 0;

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>,
    private regionService: RegionService,private UserIdstore: Store<{ app: AppState }>, 
    public dialog: MatDialog, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private docmentsService: DocmentsService, private Fs: FileuploadService, private vendorSvc: VendorService,
    public dateValidator: DateValidatorService,private commonService: CommonService, private reasonmstSvc: ReasonService,
    private errorHandler: ApiErrorHandlerService) {
  }

  ngOnInit() {
    this.VendorGetAll();
    this.CountryGetAll();
    this.CurrencyGetAll();
    this.getAllCStatus();
    this.getAllApprovalStatus();
    this.getReasons();
    this.GetUserId();
    this.getAllVendor();
    this.getDocumentList();
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
      if (this.hasViewRoute) {
        this.vendorCustomerForm.disable();
      }
      this.vendorContractFFSId = params.get('id');
      if (this.vendorContractFFSId != '' && this.vendorContractFFSId != null) {
        this.getGetAllContractVendorById(this.vendorContractFFSId)
      } else {
        const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.vendorCustomerForm.patchValue({
          date: formattedDate
        });
        this.vendorCustomerForm.patchValue({
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

    if (this.vendorContractFFSId != '' && this.vendorContractFFSId != null) {
      this.disableStatus = false;
    }
    this.matFilters();
    if(!this.hasViewRoute && this.vendorContractFFSId == '' || this.vendorContractFFSId == null){
      this.getDocuments();
    }


  }

  getDocuments(){
    this.regionService.GetAllDocumentMappingByScreenId(17).subscribe(res => {
      if (res) {
        this.attchmentList = res.map(ele => {
          return {
            vendorContractFFSId: 0,
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




  vendorCustomerForm = new FormGroup({
    vendorName: new FormControl('', [Validators.required, this.vendorNameValidator.bind(this)]),
    date: new FormControl('', [Validators.required]),
    contractNumber: new FormControl({ value: null, disabled: true }),
    vendorContractNumber: new FormControl('', [Validators.maxLength(25)]),
    address: new FormControl({ value: '', disabled: true }),
    validFrom: new FormControl('', [Validators.required]),
    validTo: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required, this.CountryValidator.bind(this)]),
    currency: new FormControl('', [Validators.required, this.CurrencyValidator.bind(this)]),
    remarks: new FormControl('', [Validators.maxLength(500)]),
    status: new FormControl('', [Validators.required]),
    approvalStatus: new FormControl({ value: '', disabled: true }),
    cancelReasonControl: new FormControl({ disabled: true, value: '' }, [this.CancelReasonValidator.bind(this)]),
    cancelRemarkControl: new FormControl({ disabled: true, value: '' }),
    copyReference: new FormControl('')
  }, {
    validators: [
      DateValidatorService.dateRangeValidator('validFrom', 'validTo'),
      //DateValidatorService.validFromDateValidator('validFrom', 'date')
    ]
  });

  get f() {
    return this.vendorCustomerForm.controls;
  }

  get dateFilter() {
    return this.dateValidator.dateFilter;
  }

  vendorNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.VendorList?.some((option: any) => option?.vendorName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CountryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
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
  DocumentNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if (isTouched && value !== '') {
      var isValid = this.documentList?.some((option: any) => option?.documentName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  CancelReasonValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '' && value !== null) {
      var isValid = this.CancelReasonList?.some((option: any) => option?.reasonName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  //Overall Control

  triggerValidation() {
    Object.keys(this.vendorCustomerForm.controls).forEach(field => {
      const control = this.vendorCustomerForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  getAllVendor() {
    this.regionService.GetAllVendorCustomer().subscribe((res: any) => {
      this.VendorContractList = res?.result;
      this.matFilters();
    })
  }

  validatePastedValue() {
    const pastedValue = this.vendorCustomerForm.get('vendorName')?.value;
    const matchingOption = this.VendorList.find(option => option.vendorName === pastedValue);
    if (matchingOption?.vendorName) {
      this.OnVendorChangeEvent(matchingOption?.vendorName);
    }
  }

  OnVendorChangeEvent(event: any) {
    let selectedVendorName = event?.option?.value ? event?.option?.value : event;
    let serviceCountry = this.vendorCustomerForm.controls.country.value;
    if (this.VendorContractList?.length != 0) {
      let selectedVendor = this.VendorList.find(option => option.vendorName === selectedVendorName);
      if (selectedVendor) {
        const existingContract = this.VendorContractList.find(contract =>
          contract.vendorName === selectedVendorName &&
          contract.countryName === serviceCountry &&
          (contract.contractStatus === 'Draft' ||
            contract.contractStatus === 'Pending for Approval' ||
            contract.contractStatus === 'Active')
        );

        if (existingContract) {
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: `The vendor '${selectedVendorName}' already has a contract with a status of 
            '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
            showConfirmButton: true,
          });
          this.vendorCustomerForm.controls.vendorName.reset();
          this.vendorCustomerForm.controls.address.reset();
          return;
        } else {
          let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
          this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
            this.addressId = res[0]?.vAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.vendorCustomerForm.patchValue({
              address: fullAddress
            });
          })
        }
      } else {
        let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
        this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
          this.addressId = res[0]?.vAddressId;
          const addressParts = [
            res[0]?.addressLine1 || '',
            res[0]?.addressLine2 || '',
            res[0]?.cityName || '',
            res[0]?.stateName || '',
            res[0]?.countryName || ''
          ];

          const fullAddress = addressParts.filter(part => part).join(', ');

          this.vendorCustomerForm.patchValue({
            address: fullAddress
          });
        })
      }

      this.matFilters();
    }else{
      let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
          this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
            this.addressId = res[0]?.vAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.vendorCustomerForm.patchValue({
              address: fullAddress
            });
          })
    }
  }
  public showCancelFields = false;
  OnStatusChangeEvent(event: any) {
    let value = event?.option?.value ? event?.option?.value : event;

    this.showCancelFields = (value === 'InActive');

    this.vendorCustomerForm.controls.cancelReasonControl.disable();
    this.vendorCustomerForm.controls.cancelRemarkControl.disable();
    this.vendorCustomerForm.controls.cancelReasonControl.reset();
    this.vendorCustomerForm.controls.cancelRemarkControl.reset();
    this.vendorCustomerForm.controls.cancelReasonControl.clearValidators();
    if (value === 'InActive') {
      this.vendorCustomerForm.controls.cancelReasonControl.enable();
      this.vendorCustomerForm.controls.cancelRemarkControl.enable();
      this.vendorCustomerForm.controls.cancelReasonControl.setValidators([Validators.required, this.CancelReasonValidator.bind(this)]);
      this.vendorCustomerForm.controls.cancelRemarkControl.setValidators([Validators.required, Validators.maxLength(500)]);
    }
    this.vendorCustomerForm.controls.cancelReasonControl.updateValueAndValidity();
    this.vendorCustomerForm.controls.cancelRemarkControl.updateValueAndValidity();
    this.vendorCustomerForm.controls.cancelRemarkControl.updateValueAndValidity();

    this.matFilters();
  }

  // statusDisableOption(option: any) {
  //   return option?.contractStatus !== 'InActive' && option?.contractStatus !== this.ContractInfo?.contractStatus;;
  // }
  statusDisableOption(option: any) {
    if(this.ContractInfo?.contractStatus === 'Active'){
      return option?.contractStatus !== 'InActive' && option?.contractStatus !== 'Active';
    } else if(!this.vendorContractFFSId){
        return option?.contractStatus !== 'Draft'
    } else  {
      return option?.contractStatus !== this.ContractInfo?.contractStatus;
    }
    
  }

  matFilters() {
    this.filteredVendor = this.vendorCustomerForm.controls.vendorName.valueChanges.pipe(
      startWith(''),
      map(value => this._filtervendor(value || '')),
    );

    this.filteredCountry = this.vendorCustomerForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || '')),
    );

    this.filteredCurrency = this.vendorCustomerForm.controls.currency.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCurrency(value || '')),
    );

    this.filteredStatus = this.vendorCustomerForm.controls.status.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStatus(value || '')),
    );

    this.filteredApprovalStatus = this.vendorCustomerForm.controls.approvalStatus.valueChanges.pipe(
      startWith(''),
      map(value => this._filterApprovalStatus(value || '')),
    );

    this.filteredDocName = this.DocControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoc(value || '')),
    );

    this.filteredcancelReasonControl = this.vendorCustomerForm.controls.cancelReasonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcancelReasonControl(value || '')),
    );

    this.filteredcopyReference = this.vendorCustomerForm.controls.copyReference.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcopyReference(value || '')),
    );
  }

  private _filtervendor(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.VendorList.filter((option: any) => option?.vendorName.toLowerCase().includes(filterValue));
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
    return this.VendorContractList.filter((option: any) => option?.contractNumber.toLowerCase().includes(filterValue));
  }

  OnCountryEvent(event: any) {
    let selectedVendorName = this.vendorCustomerForm.controls.vendorName.value;
    let serviceCountry = event?.option?.value ? event?.option?.value : event;
    if (this.VendorContractList?.length != 0) {
      let selectedVendor = this.VendorList.find(option => option.vendorName === selectedVendorName);
      if (selectedVendor) {
        const existingContract = this.VendorContractList.find(contract =>
          contract.vendorName === selectedVendorName &&
          contract.countryName === serviceCountry &&
          (contract.contractStatus === 'Draft' ||
            contract.contractStatus === 'Pending for Approval' ||
            contract.contractStatus === 'Active')
        );

        if (existingContract) {
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: `The vendor '${selectedVendorName}' already has a contract with a status of 
            '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
            showConfirmButton: true,
          });
          this.vendorCustomerForm.controls.country.reset();
          //this.vendorCustomerForm.controls.address.reset();
          return;
        } else {
          let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
          this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
            this.addressId = res[0]?.vAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.vendorCustomerForm.patchValue({
              address: fullAddress
            });
          })
        }
      } else {
        let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
        this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
          this.addressId = res[0]?.vAddressId;
          const addressParts = [
            res[0]?.addressLine1 || '',
            res[0]?.addressLine2 || '',
            res[0]?.cityName || '',
            res[0]?.stateName || '',
            res[0]?.countryName || ''
          ];

          const fullAddress = addressParts.filter(part => part).join(', ');

          this.vendorCustomerForm.patchValue({
            address: fullAddress
          });
        })
      }

      this.matFilters();
    }else{
      let id = this.VendorList.find(option => option.vendorName === selectedVendorName);
          this.regionService.getAddressByVendorId(id?.vendorId).subscribe((res: any) => {
            this.addressId = res[0]?.vAddressId;
            const addressParts = [
              res[0]?.addressLine1 || '',
              res[0]?.addressLine2 || '',
              res[0]?.cityName || '',
              res[0]?.stateName || '',
              res[0]?.countryName || ''
            ];

            const fullAddress = addressParts.filter(part => part).join(', ');

            this.vendorCustomerForm.patchValue({
              address: fullAddress
            });
          })
    }
    this.matFilters();
  }

  OnchangeEvent(event: any) {
    this.matFilters();
  }

  //Copy from existing contract
  // validatePastedValueInCopy(){
  //   const pastedValue = this.vendorCustomerForm.get('copyReference')?.value;
  //   const matchingOption = this.VendorContractList.find(option => option.contractNumber === pastedValue);
  //   if (matchingOption?.contractNumber) {
  //     this.OnVendorChangeEvent(matchingOption?.contractNumber);
  //   }
  // }
  // OnCopyRefernceEvent(event: any){
  //   let value = event?.option?.value ? event?.option?.value : event;
  //   let selectedContract = this.VendorContractList.find(option => option.contractNumber === value);
  //   if(selectedContract){
  //     this.getFromExisting(selectedContract?.vendorContractFFSId);
  //   }
  // }

  getFromExisting(id: any) {
    this.regionService.GetAllVendorById(id).subscribe((res: any) => {
      this.ContractInfo = res?.result?.vendorCustomerGeneralModal;
      this.ContractList = res?.result?.vendorContractDetailsModal?.map((item:any) => {
        return {
          ...item,
          vendorContractFFSId: 0,
          VCFFSDetailId: 0,
          vendorContractMappingModal: item?.vendorContractMappingModal.map((mapping:any) => {
            return {
              ...mapping,
              vcffsMappingId: 0,
              vcffsDetailId: 0
            };
          })
        };
      });
      
      this.attchmentList = res?.result?.vendorContractDocumentsModal?.map((item:any) => {
        return {
          ...item,
          vendorContractFFSId: 0,
          VCFFSDocumentId: 0,
        };
      });
      

      this.ContractInfo.vendorContractFFSId = 0;

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


      this.vendorCustomerForm.patchValue({
        vendorName: this.ContractInfo.vendorName,
        date: this.ContractInfo.contractDate,
        //contractNumber: this.ContractInfo.contractNumber,
        //vendorContractNumber: this.ContractInfo.vendorRefContractNo,
        address: fullAddress,
        country: this.ContractInfo.countryName,
        currency: this.ContractInfo.currencyName,
        remarks: this.ContractInfo.remarks,
        cancelReasonControl: this.ContractInfo.reasonName,
        cancelRemarkControl: this.ContractInfo.closeRemark,
        approvalStatus: this.ContractInfo.approvalStatus ? this.ContractInfo.approvalStatus : 'NA',
      });
      if (this.hasViewRoute) {
        this.vendorCustomerForm.get('status')?.disable();
      } else {
        this.vendorCustomerForm.get('status')?.enable();
      }

      if (this.ContractInfo.contractStatus === 'InActive') {
        this.vendorCustomerForm.controls.cancelReasonControl.enable();
        this.vendorCustomerForm.controls.cancelRemarkControl.enable();
      }
      this.showCancelFields = (this.ContractInfo.contractStatus === 'InActive');

      let status = this.vendorCustomerForm.controls.status.value;
      if (status === 'Draft') {
        this.vendorCustomerForm.enable();
        this.vendorCustomerForm.controls.address.disable();
        this.vendorCustomerForm.controls.approvalStatus.disable();
      } else if(status === 'Active') {
        // this.vendorCustomerForm.disable();
        // this.vendorCustomerForm.controls.validFrom.enable()
        // this.vendorCustomerForm.controls.validTo.enable()
        // this.vendorCustomerForm.controls.status.enable()
        // this.vendorCustomerForm.controls.remarks.enable()
      } else {
        this.vendorCustomerForm.disable();

      }
      this.vendorCustomerForm.updateValueAndValidity();
      this.cdr.detectChanges();

      setTimeout(()=>{
        if(this.hasViewRoute){
          this.vendorCustomerForm.disable();
        }
      },1500)
    })

  }


  VendorGetAll() {
    this.vendorSvc.VendorGetAllActive().subscribe(result => {
      this.VendorList = result;
      this.matFilters();
      console.log(this.VendorList);
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
  getUnknownValues() {
    this.commonService.GetUnknownValuesId().subscribe((res: any) => {
      console.log(res)
      this.UnknownValueList = res;
    })
  }


  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getGetAllContractVendorById(id: any) {
    this.regionService.GetAllVendorById(id).subscribe((res: any) => {
      this.ContractInfo = res?.result?.vendorCustomerGeneralModal;
      this.ContractList = res?.result?.vendorContractDetailsModal;
      this.attchmentList = res?.result?.vendorContractDocumentsModal;

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


      this.vendorCustomerForm.patchValue({
        vendorName: this.ContractInfo.vendorName,
        date: this.ContractInfo.contractDate,
        contractNumber: this.ContractInfo.contractNumber,
        vendorContractNumber: this.ContractInfo.vendorRefContractNo,
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
        this.vendorCustomerForm.get('status')?.disable();
      } else {
        this.vendorCustomerForm.get('status')?.enable();
      }

      if (this.ContractInfo.contractStatus === 'InActive') {
        this.vendorCustomerForm.controls.cancelReasonControl.enable();
        this.vendorCustomerForm.controls.cancelRemarkControl.enable();
      }
      this.showCancelFields = (this.ContractInfo.contractStatus === 'InActive');

      if (this.ContractInfo.contractStatus === "Draft") {
        this.isDraft = true;
      } else {
        this.isDraft = false;
      }

      let status = this.vendorCustomerForm.controls.status.value;
      if (status === 'Draft') {
        this.vendorCustomerForm.enable();
        this.vendorCustomerForm.controls.address.disable();
        this.vendorCustomerForm.controls.approvalStatus.disable();
      } else if(status === 'Active') {
        this.vendorCustomerForm.disable();
        this.vendorCustomerForm.controls.validFrom.enable()
        this.vendorCustomerForm.controls.validTo.enable()
        this.vendorCustomerForm.controls.status.enable()
        this.vendorCustomerForm.controls.remarks.enable()
        this.isActive = true;
      } else {
        this.vendorCustomerForm.disable();

      }
      this.vendorCustomerForm.updateValueAndValidity();
      this.cdr.detectChanges();

      setTimeout(()=>{
        if(this.hasViewRoute){
          this.vendorCustomerForm.disable();
        }
      },1500)
    })
  }




  //Contract List
  Add() {

    let status = this.vendorCustomerForm.controls.status.value;
    if (status === 'Draft' || status === 'Active') {
      this.dialogRef1 = this.dialog.open(AddVendorContractInfoComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          vendorId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
          selectedCategory: 0,
          createdBy: parseInt(this.userId$),
          createdDate: this.ContractInfo?.createdDate
        },
      });
      this.dialogRef1.afterClosed().subscribe((result: any) => {
        if (result) {
          this.ContractList = [...this.ContractList, result];
          console.log(this.ContractList)
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

  Edit(dataItem: any, index: any) {
    console.log(dataItem)

    let status = this.vendorCustomerForm.controls.status.value;
    if (status === 'Draft' || status === 'Active') {
      let selectedCategory: any[] = this.ContractList[index];
      this.dialogRef1 = this.dialog.open(AddVendorContractInfoComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          vendorContractId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
          selectedCategoryId: dataItem?.vcffsDetailId,
          createdBy: parseInt(this.userId$),
          createdDate: this.ContractInfo?.createdDate,
          list: selectedCategory,
          row: this.generateRandomId(5),
          view: false
        },
      });
      this.dialogRef1.afterClosed().subscribe((result: any) => {
        if (result) {

          let index = this.ContractList.findIndex(item => item.rowNumber === result.rowNumber);
          if (index !== -1) {
            this.ContractList[index] = result;
            this.ContractList = [...this.ContractList]
          } else {
            this.ContractList = [...this.ContractList, result];
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

  view(obj: any, index: any) {
    let selectedCategory: any[] = this.ContractList[index];
    this.dialogRef1 = this.dialog.open(AddVendorContractInfoComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        vendorContractId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
        selectedCategory: 0,
        createdBy: parseInt(this.userId$),
        createdDate: this.ContractInfo?.createdDate,
        list: selectedCategory,
        view: true
      },
    });
  }

  // checkForDuplicates(array: any[], newItem: any): boolean {
  //   return array.some(item =>
  //     String(item.vendorContractFFSId) === String(newItem.vendorContractFFSId) &&
  //     String(item.aamroLineItemId) === String(newItem.aamroLineItemId)
  //   );
  // }

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


  Delete(id: any, index: any) {
    let status = this.vendorCustomerForm.controls.status.value;
    if (status === 'Draft') {
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


  //Mapping

  mapping(dataItem: VendorContractDetails, index: any) {
    let status = this.vendorCustomerForm.controls.status.value;
    // if(status === 'Draft'){
    if (dataItem?.vcffsDetailId != 0) {
      this.regionService.GetVendorMappingById(dataItem?.vcffsDetailId).subscribe((res: any) => {
        console.log(res)
        this.mappingList = res;
        if (this.mappingList.length != 0) {
          if (dataItem?.vendorContractMappingModal == null) {
            this.dialogRef2 = this.dialog.open(AddVendorContractMappingComponent, {
              data: {
                list: this.mappingList,
                detailId: dataItem?.vcffsDetailId,
                createdBy: parseInt(this.userId$),
                view: this.hasViewRoute || this.isActive ? true : false,
                value: dataItem?.unitValue,
                ContractList: this.ContractList
              },
              disableClose: true,
              autoFocus: false,
            });
            this.dialogRef2.afterClosed().subscribe((result: any) => {
              debugger
              if (result) {
                this.mappingList = result;
                dataItem.vendorContractMappingModal = this.mappingList;
                this.ContractList = [...this.ContractList]
              }

            });
          }

          this.dialogRef2 = this.dialog.open(AddVendorContractMappingComponent, {
            data: {
              list: dataItem.vendorContractMappingModal,
              detailId: dataItem?.vcffsDetailId,
              createdBy: parseInt(this.userId$),
              view: this.hasViewRoute || this.isActive ? true : false,
              value: dataItem?.unitValue,
              ContractList: this.ContractList
            },
            disableClose: true,
            autoFocus: false,
          });
          this.dialogRef2.afterClosed().subscribe((result: any) => {
            debugger
            if (result) {
              this.mappingList = result;
              dataItem.vendorContractMappingModal = this.mappingList;
              this.ContractList = [...this.ContractList]
            }

          });
        } else {
          this.dialogRef2 = this.dialog.open(AddVendorContractMappingComponent, {
            data: {
              list: dataItem.vendorContractMappingModal,
              detailId: dataItem?.vcffsDetailId,
              createdBy: parseInt(this.userId$),
              view: this.hasViewRoute || this.isActive ? true : false,
              value: dataItem?.unitValue,
              ContractList: this.ContractList
            },
            disableClose: true,
            autoFocus: false,
          });
          this.dialogRef2.afterClosed().subscribe((result: any) => {
            debugger
            if (result) {
              this.mappingList = result;
              dataItem.vendorContractMappingModal = this.mappingList;
              this.ContractList = [...this.ContractList]
            }
          });
        }

      })
    } else {
      this.dialogRef2 = this.dialog.open(AddVendorContractMappingComponent, {
        data: {
          list: dataItem?.vendorContractMappingModal,
          detailId: dataItem?.vcffsDetailId,
          createdBy: parseInt(this.userId$),
          value: dataItem?.unitValue,
          ContractList: this.ContractList
        },
        disableClose: true,
        autoFocus: false
      });
      this.dialogRef2.afterClosed().subscribe((result: any) => {
        if (result) {
          this.mappingList = result;
          dataItem.vendorContractMappingModal = this.mappingList;
          this.ContractList = [...this.ContractList]
        }
      });
    }
    // } else {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Warning!",
    //     text: `Can't delete or edit the line item mapping when the status is "${status}".`,
    //     showConfirmButton: true,
    //   });
    // }


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
    this.isEditDocument = false;
    let status = this.vendorCustomerForm.controls.status.value;
    if (status === 'Draft' || status === 'Active') {
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
        text: `Can't add documents when the status is "${status}".`,
        showConfirmButton: true,
      });
    }

  }

  AttachedSave(dataItem: any) {
    if (this.DocControl.invalid || (this.fileInput.nativeElement.value == '' || this.fileInput.nativeElement.value == undefined || this.fileInput.nativeElement.value == null)) {
      this.DocControl.markAllAsTouched();
    } else {
      const formData = {
        vendorContractFFSId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
        documentId: this.selectedDocId || 0,
        documentIdName: this.SelectedDocName || null,
        documentName: this.fileToUpload?.name || null,
        remarks: this.remark || null,
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
    let status = this.vendorCustomerForm.controls.status.value;
    if (status === 'Draft') {
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
    this.router.navigate(["/qms/transaction/vendor-contract-list"]);
  }


  validateDateFields(): boolean {
    const validFrom = this.vendorCustomerForm.controls.validFrom.value;
    const validTo = this.vendorCustomerForm.controls.validTo.value;

    let isValid = true;

    if (validFrom === null || validFrom === undefined || validFrom === '') {
      this.vendorCustomerForm.controls.validFrom.setErrors({ required: true });
      isValid = false;
    } else {
      this.vendorCustomerForm.controls.validFrom.setErrors(null);
    }

    if (validTo === null || validTo === undefined || validTo === '') {
      this.vendorCustomerForm.controls.validTo.setErrors({ required: true });
      isValid = false;
    } else {
      this.vendorCustomerForm.controls.validTo.setErrors(null);
    }

    return isValid;
  }

  vendorAndCountryValidation() {
    let selectedVendorName = this.vendorCustomerForm.controls.vendorName.value;
    let serviceCountry = this.vendorCustomerForm.controls.country.value;

    const existingContract = this.VendorContractList.find(contract =>
      contract.vendorName === selectedVendorName &&
      contract.countryName === serviceCountry &&
      contract.vendorContractFFSId !== this.ContractInfo.vendorContractFFSId && 
      (contract.contractStatus === 'Draft' ||
        contract.contractStatus === 'Pending for Approval' ||
        contract.contractStatus === 'Active')
    );

    if (existingContract) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: `The vendor '${selectedVendorName}' already has a contract with a status of 
        '${existingContract.contractStatus}' in the country '${serviceCountry}'.`,
        showConfirmButton: true,
      });
      this.vendorCustomerForm.controls.country.reset();
      return false;
    }
    return true;
  }


  // statusId: any;
  // checkValidation: boolean = true;
  // saveAll(event: any) {
  //   this.triggerValidation();
  //   let checkDate = !this.validateDateFields()
  //   if (this.vendorCustomerForm.invalid || checkDate || this.showAddRow) {
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
  //     if (this.vendorCustomerForm.invalid) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops!",
  //         text: "Please fill the mandatory fields",
  //         showConfirmButton: true,
  //       });
  //       this.tabGroup.selectedIndex = 0;

  //       this.vendorCustomerForm.markAllAsTouched();
  //       this.vendorCustomerForm.controls.validFrom.markAllAsTouched();
  //       this.vendorCustomerForm.controls.validTo.markAllAsTouched();
  //     }

  //   } else {

  //     this.checkValidation = true;
  //     // if (this.ContractList?.length != 0) {
  //     //   for (let index = 0; index < this.ContractList.length; index++) {
  //     //     const item = this.ContractList[index];
  //     //     if (!item.vendorContractMappingModal || item.vendorContractMappingModal.length === 0) {
  //     //       Swal.fire({
  //     //         icon: 'error',
  //     //         title: 'Validation Error',
  //     //         text: `The ${index + 1} line item has an empty Mapping!`,
  //     //       });
  //     //       this.checkValidation = false;
  //     //       break;
  //     //     }
  //     //   }
  //     // }
  //     let invalidContracts: string[] = [];

  //     if (this.ContractList?.length != 0) {
  //       this.ContractList.forEach((item) => {
  //         if (!item.vendorContractMappingModal || item.vendorContractMappingModal.length === 0) {
  //           invalidContracts.push(item.lineItemCategoryName);
  //         }
  //       });

  //       if (invalidContracts.length > 0) {
  //         Swal.fire({
  //           icon: 'info',
  //           title: 'Info',
  //           text: `Please fill the mapping for the following line item categories: ${invalidContracts.join(", ")}.`,
  //           showConfirmButton: true,
  //         });
  //         this.checkValidation = false;
  //         return;
  //       }
  //     }

  //     if (this.checkValidation) {

  //       const statusID = this.getStatusId(this.vendorCustomerForm.controls.status.value);

  //       if (event === 'Save') {
  //         if (statusID == 1) {
  //           this.statusId = 3;
  //         }
  //         else if (statusID == 6) {
  //           this.statusId = 6;
  //         } else if (statusID == 5) {
  //           this.statusId = 5;
  //         } else if (statusID == 3) {
  //           this.statusId = 3;
  //         } else if (statusID == 2) {
  //           this.statusId = 2;
  //         } else if (statusID == 4) {
  //           this.statusId = 4;
  //         }
  //       }
  //       else if (event === 'Draft') {
  //         if (statusID == 1) {
  //           this.statusId = 1;
  //         }
  //       }

  //       let payload1 = {
  //         vendorCustomerGeneralModal: {
  //           vendorContractFFSId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
  //           contractNumber: this.vendorCustomerForm.controls.contractNumber.value || null,
  //           vendorId: this.getVendorNumber(this.vendorCustomerForm.controls.vendorName.value) || 0,
  //           contractDate: this.normalizeDateToUTC(this.vendorCustomerForm.controls.date.value) || 0,
  //           vendorRefContractNo: this.vendorCustomerForm.controls.vendorContractNumber.value || null,
  //           validFrom: this.normalizeDateToUTC(this.vendorCustomerForm.controls.validFrom.value) || 0,
  //           validTo: this.normalizeDateToUTC(this.vendorCustomerForm.controls.validTo.value) || 0,
  //           addressId: this.addressId || null,
  //           countryId: this.getCountryId(this.vendorCustomerForm.controls.country.value) || 0,
  //           currencyId: this.getCurrencyId(this.vendorCustomerForm.controls.currency.value) || 0,
  //           statusId: this.statusId || this.getStatusId(this.vendorCustomerForm.controls.status.value),
  //           approvalStatusId: this.getApprovalStatusId(this.vendorCustomerForm.controls.approvalStatus.value) || 0,
  //           closeReasonId: this.getReasonId(this.vendorCustomerForm.controls.cancelReasonControl.value) || 0,
  //           closeRemark: this.vendorCustomerForm.controls.cancelRemarkControl.value || null,
  //           remarks: this.vendorCustomerForm.controls.remarks.value || null,
  //           createdBy: parseInt(this.userId$),
  //           createdDate: this.ContractInfo?.createdDate,
  //           updatedBy: parseInt(this.userId$),
  //           updatedDate: this.normalizeDateToUTC(new Date())
  //         },
  //         vendorContractDetailsModal: this.ContractList,
  //         vendorContractDocumentsModal: this.attchmentList,

  //       }

  //       console.log(payload1)
  //       this.regionService.AddVendorContract(payload1).subscribe((res: any) => {
  //         const formData = new FormData();
  //         this.attchmentList.forEach(item => {
  //           if (item.file) {
  //             formData.append('imageFile', item.file, item.documentName);
  //           }
  //         });
  //         this.Fs.FileUpload(formData).subscribe({
  //           next: (res) => {

  //           },
  //           error: (error) => {
  //           }
  //         });
  //         if (res) {
  //           if (this.vendorContractFFSId) {
  //             Swal.fire({
  //               icon: "success",
  //               title: "Updated successfully",
  //               text: `Contract Number: ${res?.vendorCustomerGeneralModal?.contractNumber}`,
  //               showConfirmButton: true,
  //             }).then((result) => {
  //               if (result.dismiss !== Swal.DismissReason.timer) {
  //                 if (this.vendorContractFFSId) {
  //                   // location.reload();
  //                   this.router.navigate(['/qms/transaction/vendor-contract-list']);
  //                 } else {
  //                   // let id = res?.vendorCustomerGeneralModal?.vendorContractFFSId
  //                   // this.router.navigate(['/qms/transaction/add-vendor-contract', id]);
  //                   this.router.navigate(['/qms/transaction/vendor-contract-list']);
  //                 }

  //               }
  //             });
  //           } else {
  //             Swal.fire({
  //               icon: "success",
  //               title: "Added successfully",
  //               text: ` Contract  Number: ${res?.vendorCustomerGeneralModal?.contractNumber}`,
  //               showConfirmButton: true,
  //             }).then((result) => {
  //               if (result.dismiss !== Swal.DismissReason.timer) {
  //                 if (this.vendorContractFFSId) {
  //                   // location.reload();
  //                   this.router.navigate(['/qms/transaction/vendor-contract-list']);
  //                 } else {
  //                   // let id = res?.vendorCustomerGeneralModal?.vendorContractFFSId
  //                   // this.router.navigate(['/qms/transaction/add-vendor-contract', id]);
  //                   this.router.navigate(['/qms/transaction/vendor-contract-list']);
  //                 }

  //               }
  //             });
  //           }

  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops!",
  //             text: "Something went wrong",
  //             showConfirmButton: false,
  //             timer: 2000,
  //           });
  //         }
  //       },
  //       (err: HttpErrorResponse) => {
  //         let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
  //         if(stausCode === 500){
  //           this.errorHandler.handleError(err);
  //         } else if(stausCode === 400){
  //           this.errorHandler.FourHundredErrorHandler(err);
  //         } else {
  //           this.errorHandler.commonMsg();
  //         }
  //       })
  //     }
  //   }


  // }

  statusId: any;
  checkValidation: boolean = true;
  saveAll(event: any) {

    if (event === 'Save') {
      this.triggerValidation();

      if(this.vendorCustomerForm.valid){
        if (!this.vendorAndCountryValidation()) {
          return;
        }
      }


      let checkDate = !this.validateDateFields();
      if (this.vendorCustomerForm.invalid || checkDate || this.showAddRow) {
        if (this.DocControl.invalid) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the mandatory fields and save the changes in attachments",
            showConfirmButton: true,
          });
          this.changeTab(1);
          this.DocControl.markAllAsTouched();
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
        if (this.vendorCustomerForm.invalid) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the mandatory fields",
            showConfirmButton: true,
          });
          this.changeTab(0);

          this.vendorCustomerForm.markAllAsTouched();
          this.vendorCustomerForm.controls.validFrom.markAllAsTouched();
          this.vendorCustomerForm.controls.validTo.markAllAsTouched();
        }

      } else {

        this.checkValidation = true;
        let invalidContracts: string[] = [];

        if (this.ContractList?.length != 0) {
          this.ContractList.forEach((item) => {
            if (!item.vendorContractMappingModal || item.vendorContractMappingModal.length === 0) {
              invalidContracts.push(item.lineItemCategoryName);
            }
          });

          if (invalidContracts.length > 0) {
            Swal.fire({
              icon: 'info',
              title: 'Info',
              text: `Please fill the mapping for the following line item categories: ${invalidContracts.join(", ")}.`,
              showConfirmButton: true,
            });
            this.checkValidation = false;
            this.changeTab(0);
            return;
          } else {
            this.save(event);
          }
        } else {
          this.save(event);
        }
      }
    } else {
      this.save(event);
    }

  }

  save(event: any) {
    if (this.checkValidation) {
      const statusID = this.getStatusId(this.vendorCustomerForm.controls.status.value);
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
    }

    const defaultDate = new Date('1900-01-01');

    let payload1 = {
      vendorCustomerGeneralModal: {
        vendorContractFFSId: this.vendorContractFFSId ? this.vendorContractFFSId : 0,
        contractNumber: this.vendorCustomerForm.controls.contractNumber.value || null,
        vendorId: this.getVendorNumber(this.vendorCustomerForm.controls.vendorName.value) || null,
        contractDate: this.normalizeDateToUTC(this.vendorCustomerForm.controls.date.value) || null,
        vendorRefContractNo: this.vendorCustomerForm.controls.vendorContractNumber.value || null,
        validFrom: this.normalizeDateToUTC(this.vendorCustomerForm.controls.validFrom.value || defaultDate) || null,
        validTo: this.normalizeDateToUTC(this.vendorCustomerForm.controls.validTo.value || defaultDate) || null,
        addressId: this.addressId || null,
        countryId: this.getCountryId(this.vendorCustomerForm.controls.country.value) || this.getUnknownId("Country"),
        currencyId: this.getCurrencyId(this.vendorCustomerForm.controls.currency.value) || this.getUnknownId("Currency"),
        statusId: this.statusId || this.getStatusId(this.vendorCustomerForm.controls.status.value),
        approvalStatusId: this.getApprovalStatusId(this.vendorCustomerForm.controls.approvalStatus.value) || null,
        closeReasonId: this.getReasonId(this.vendorCustomerForm.controls.cancelReasonControl.value) || null,
        closeRemark: this.vendorCustomerForm.controls.cancelRemarkControl.value || null,
        remarks: this.vendorCustomerForm.controls.remarks.value || null,
        createdBy: parseInt(this.userId$),
        createdDate: this.ContractInfo?.createdDate,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.normalizeDateToUTC(new Date())
      },
      vendorContractDetailsModal: this.ContractList,
      vendorContractDocumentsModal: this.attchmentList,

    }

    console.log(payload1)
    this.regionService.AddVendorContract(payload1).subscribe((res: any) => {
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
        if (this.vendorContractFFSId) {
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: `Contract Number: ${res?.vendorCustomerGeneralModal?.contractNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.vendorContractFFSId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/vendor-contract-list']);
              } else {
                // let id = res?.vendorCustomerGeneralModal?.vendorContractFFSId
                // this.router.navigate(['/qms/transaction/add-vendor-contract', id]);
                this.router.navigate(['/qms/transaction/vendor-contract-list']);
              }

            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: ` Contract  Number: ${res?.vendorCustomerGeneralModal?.contractNumber}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (this.vendorContractFFSId) {
                // location.reload();
                this.router.navigate(['/qms/transaction/vendor-contract-list']);
              } else {
                // let id = res?.vendorCustomerGeneralModal?.vendorContractFFSId
                // this.router.navigate(['/qms/transaction/add-vendor-contract', id]);
                this.router.navigate(['/qms/transaction/vendor-contract-list']);
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
  reset() {
    location.reload();
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

  getVendorNumber(value: any) {
    let vendor = this.VendorList.find(option => option?.vendorName == value)
    return vendor?.vendorId;
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



}
