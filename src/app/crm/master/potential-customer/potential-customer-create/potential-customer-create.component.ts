import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CurrenciesService } from 'src/app/ums/masters/currencies/currencies.service';
import { Currency } from 'src/app/ums/masters/currencies/currency.model';
import { Employee } from 'src/app/ums/masters/employee/employee.model';
import { CustomerrankingService } from '../../customerranking/customerranking.service';
import { CustomerRanking } from '../../customerranking/customerranking.model';
import { PotentialCustomerService } from '../potential-customer.service';
import { ApprovalStatusModel, BillingCurrencys, Intrestlevel, ModeofFollowUp, StatusTypeInPC } from 'src/app/Models/crm/master/Dropdowns';
import { InfosourceService } from '../../infosource/infosource.service';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { PotentialCustomer, PotentialCustomerAddress, PotentialCustomerContact, PotentialCustomerContainer, PotentialCustomerDocument, pcLineItemCategory } from '../potential-customer.model';
import { MatDialog } from '@angular/material/dialog';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';
import Swal from 'sweetalert2';
import { DocmentsService } from '../../document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { StatusTypeInJobTypes } from '../../jobtype/jobtypemodel.model';
import { EmployeeService } from 'src/app/ums/masters/employee/employee.service';
import { Industry } from 'src/app/Models/crm/master/Industry';
import { IndustryServiceService } from '../../industry-type/industry-type-service.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { ServiceTypeServiceService } from '../../servicetype/service-type-service.service';
import { ServiceType } from 'src/app/Models/crm/master/ServiceType';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileuploadService } from 'src/app/services/FileUpload/fileupload.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.development';
import { LineitemService } from '../../lineitemcategory/lineitem.service';
import { lineitem } from 'src/app/Models/crm/master/linitem';
import { NofificationconfigurationService } from 'src/app/services/ums/nofificationconfiguration.service';
import { DocumentMappingService } from '../../document-mapping/document-mapping.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
@Component({
  selector: 'app-potential-customer-create',
  templateUrl: './potential-customer-create.component.html',
  styleUrls: ['./potential-customer-create.component.css', '../../../../ums/ums.styles.css']
})
export class PotentialCustomerCreateComponent {
  PotentialCustomerForm: FormGroup;
  viewMode: boolean = false;
  liveStatus = 1;
  currencyList: Currency[] = [];
  billingCurrencyList: BillingCurrencys[] = [];
  customerRankingList: CustomerRanking[] = [];
  industryList: Industry[] = [];
  salesOwnerList: Employee[] = [];
  salesExecutiveList: Employee[] = [];
  CommunicationList: ModeofFollowUp[] = [];
  serviceInterestList: Intrestlevel[] = [];
  statusList: StatusTypeInPC[] = [];
  infosourceList: Infosource[] = [];

  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  filteredCurrencyListOptions$: Observable<any[]>;
  filteredbillingCurrencyListOptions$: Observable<any[]>;
  filteredsalesOwnerOptions$: Observable<any[]>;
  filteredsalesExecutiveOptions$: Observable<any[]>;
  filteredindustryOptions$: Observable<any[]>;
  filteredcustomerRankingOptions$: Observable<any[]>;
  filteredStatusOptions$: Observable<any[]>;
  filteredserviceInterestOptions$: Observable<any[]>;
  filteredcommunicationOptions$: Observable<any[]>;
  filteredinfosourceOptions$: Observable<any[]>;


  customerCurrencyId: any;
  billingCurrencyId: any;
  salesOwnerId: number;
  salesExecutiveId: any;
  industryId: any;
  customerRankingId: any;
  pcStatusId: any;
  modeofFollowUpId: any;
  interestlevelId: any;
  informationSourceId: any;

  processTitle = 'Add';
  gereralEdit: boolean;

  potentialCustomerContainer: PotentialCustomerContainer;
  potentialCustomer: PotentialCustomer = new PotentialCustomer();
  potentialCustomerContacts: PotentialCustomerContact[] = [];
  potentialCustomerAddress: PotentialCustomerAddress[] = [];
  potentialCustomerDocuments: PotentialCustomerDocument[] = [];

  pcContactArray: PotentialCustomerContact[] = [];
  pcAddressArray: PotentialCustomerAddress[] = [];
  pcDocumentArray: PotentialCustomerDocument[] = [];

  Showform: boolean | undefined;
  documentModel: PotentialCustomerDocument[] = [];
  date = new Date;
  showAddRowDoc: boolean;
  remarks: any;
  documentId: any;
  onSelectDoc: boolean;
  documents: Documents[] = [];
  statusTypeInJobTypes: StatusTypeInJobTypes[] = [];
  keywordDoc = 'documentName'
  documentName: any
  filteredAddressOptions$: Observable<any[]>;
  potentialCustomerId: number;
  existStatus: boolean = false;
  editedContact: any;
  rowIndexContact: number;
  existaddress: boolean;
  filePath: string;
  disablefields: boolean;
  existDoc: boolean;
  rowIndexforDoc: any;
  editDocumet: any;
  removeDoc: PotentialCustomerDocument[];
  rowIndexAddress: number;
  editedAddress: any;
  fileType: boolean;
  fileInput: any;
  file: any;
  fileName: any = '';
  serviceTypeList: ServiceType[];
  filteredServiceTypeListOptions$: any;
  serviceTypeId: any;
  userId$: string;
  pcres: any
  documentTypeName: any;
  selectedCustomerId: any;
  pagePrivilege: Array<string>;
  informationSourceName: any;
  reference: boolean;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  ImageDetailsArray: any[] = [];
  Filepath = environment.Fileretrive;
  @ViewChild('ImagePreview') imagePreview = {} as TemplateRef<any>;
  LineItemCategoryList: lineitem[];
  lineItemCategoryId: any;
  IncoForm: FormGroup;
  pcLineItemCategory: pcLineItemCategory[] = [];
  approvalStatusList: ApprovalStatusModel[];
  approvalStatusId: any;
  filteredApprovalStatusOptions$: Observable<any[]>;
  selectedIndex = 0;
  isEditDocument: boolean;
  isDraft: boolean = true;


  constructor(
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private lineitemService: LineitemService,
    private commonService: CommonService,
    private customerrankingService: CustomerrankingService,
    private IndustryTypeService: IndustryServiceService,
    private potentialCustomerService: PotentialCustomerService,
    private infosourceService: InfosourceService,
    private docmentsService: DocmentsService,
    private employeeService: EmployeeService,
    private serviceTypeService: ServiceTypeServiceService,
    private ErrorHandling: ErrorhandlingService,
    private currenciesService: CurrenciesService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>,
    private Fs: FileuploadService,
    private Ns: NofificationconfigurationService,
    private documentMappingService: DocumentMappingService,
    private errorHandler: ApiErrorHandlerService
  ) { }



  ngOnInit() {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges["/crm/master/potentialcustomerlist".substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
    this.iniForm();
    this.getCurrencyList();
    this.GetAlllineItem();
    this.getbillingCurrencyList();
    this.getEmployeeList();
    this.getIndustryList();
    this.getCustomerRankingList();
    this.getAllStatus();
    this.GetAllServiceType();
    this.getAllInfosource();
    this.getAllCommunication();
    this.getAllServiceInterest();
    this.getDocumentList();
    // this.GetAllApprovalStatus();

    if (!this.potentialCustomerService.movetoCustomer && !this.potentialCustomerService.isEdit && !this.potentialCustomerService.isView) {
      //document check list binding 
      this.potentialCustomerService.GetAllDocumentMappingByScreenId(8).subscribe(res => {
        if (res) {
          this.potentialCustomerDocuments = res.map(ele => {
            return {
              pcDocumentId: 0,
              potentialCustomerId: 0,
              documentId: ele.documentId,
              remarks: '',
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              documentName: '',
              documentTypeName: ele.documentName,
              IseditDoc: false,
              newDoc: true,
              files: ''
            };
          });
          this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
          this.pcDocumentArray = [...this.potentialCustomerDocuments];
        }
        console.log(this.potentialCustomerDocuments)
      });
    }

    if (this.potentialCustomerService.itemId && this.potentialCustomerService.isEdit) {
      this.processTitle = 'Edit';
      this.gereralEdit = true;
      this.disablefields = false;
      this.reference = true;
      const id = this.potentialCustomerService.itemId;
      this.getAllbyId(id);
    } else if (this.potentialCustomerService.itemId && this.potentialCustomerService.isView) {
      const id = this.potentialCustomerService.itemId;
      this.processTitle = 'View';
      this.gereralEdit = false;
      this.disablefields = true;
      this.viewMode = true;
      this.getAllbyId(id);
      this.isDraft = true;
    }
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }
  returnToList() {
    this.router.navigate(["/crm/master/potentialcustomerlist"]);
  }
  //dropdown loading for all  

  //#region customer currency
  getCurrencyList() {
    this.commonService.getCurrencies(this.liveStatus).subscribe(result => {
      this.currencyList = result;
      this.CurrencyFun();
    });
  }
  CurrencyFun() {
    this.filteredCurrencyListOptions$ = this.PotentialCustomerForm.controls['customerCurrencyId'].valueChanges.pipe(
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
    this.PotentialCustomerForm.controls['customerCurrencyId'].setValue('');
    return this.currencyList;
  }
  displayCurrencyListLabelFn(data: any): string {
    console.log(data);

    return data && data.currencyName ? data.currencyName : '';
  }
  CurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.customerCurrencyId = selectedValue.currencyId;
  }

  CurrencyEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.customerCurrencyId = null;
    }
  }

  //#endregion

  //#region billing currency
  getbillingCurrencyList() {
    this.commonService.getBillingCurrencies(this.liveStatus).subscribe(result => {
      this.billingCurrencyList = result;
      this.billingCurrencyFun();
    });
  }
  billingCurrencyFun() {
    this.filteredbillingCurrencyListOptions$ = this.PotentialCustomerForm.controls['billingCurrencyId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.billingCurrency)),
      map((name: any) => (name ? this.filteredbillingCurrencyListOptions(name) : this.billingCurrencyList?.slice()))
    );
  }
  private filteredbillingCurrencyListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.billingCurrencyList.filter((option: any) => option.billingCurrency.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataBillCurrency1();
  }
  NoDataBillCurrency1(): any {
    this.PotentialCustomerForm.controls['billingCurrencyId'].setValue('');
    return this.billingCurrencyList;
  }
  displayBillCurrencyListLabelFn(data: any): string {
    return data && data.billingCurrency ? data.billingCurrency : '';
  }
  billCurrencyListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.billingCurrencyId = selectedValue.billingCurrencyId;
  }

  BillingCurrencyEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.billingCurrencyId = null;
    }
  }

  //#endregion

  //#region Employee
  getEmployeeList() {
    this.commonService.getEmployees(this.liveStatus).subscribe(result => {
      this.salesOwnerList = result;
      this.salesExecutiveList = result;
      this.salesOwnerFun();
      this.salesExecutivefun();

      this.salesOwnerList.forEach(ele => {
        if (ele.employeeId == parseInt(this.userId$)) {
          this.PotentialCustomerForm.controls['salesOwnerId'].setValue(ele);
          this.PotentialCustomerForm.controls['salesExecutiveId'].setValue(ele);
          this.salesExecutiveId = ele.employeeId;
          this.salesOwnerId = ele.employeeId;
        }
      })
    });
  }
  salesOwnerFun() {
    this.filteredsalesOwnerOptions$ = this.PotentialCustomerForm.controls['salesOwnerId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this.filteredsalesOwnerOptions(name) : this.salesOwnerList?.slice()))
    );
  }
  private filteredsalesOwnerOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.salesOwnerList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatasalesOwner();
  }
  NoDatasalesOwner(): any {
    this.PotentialCustomerForm.controls['salesOwnerId'].setValue('');
    return this.salesOwnerList;
  }
  displaysalesOwnerListLabelFn(data: any): string {
    return data && data.employeeName ? data.employeeName : '';
  }
  salesOwnerListSelectedoption(data: any) {
    debugger
    let selectedValue = data.option.value;
    this.salesOwnerId = selectedValue.employeeId;
    this.PotentialCustomerForm.controls['salesExecutiveId'].setValue(data.option.value);
    this.salesExecutiveId = this.salesOwnerId;
  }
  //#endregion 

  //#region 
  salesExecutivefun() {
    this.filteredsalesExecutiveOptions$ = this.PotentialCustomerForm.controls['salesExecutiveId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.employeeName)),
      map((name: any) => (name ? this.filteredsalesExecutiveOptions(name) : this.salesExecutiveList?.slice()))
    );
  }
  private filteredsalesExecutiveOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.salesExecutiveList.filter((option: any) => option.employeeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatasalesExecutive();
  }
  NoDatasalesExecutive(): any {
    this.PotentialCustomerForm.controls['salesExecutiveId'].setValue('');
    return this.salesExecutiveList;
  }
  displaysalesExecutiveListLabelFn(data: any): string {
    return data && data.employeeName ? data.employeeName : '';
  }
  salesExecutiveListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.salesExecutiveId = selectedValue.employeeId;
  }

  ExecutiveEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.salesExecutiveId = null;
    }
  }

  //#endregion

  //#region industry
  getIndustryList() {
    this.IndustryTypeService.GetAllIndustry(this.liveStatus).subscribe(result => {
      this.industryList = result;
      this.industryFun();
    });
  }
  industryFun() {
    this.filteredindustryOptions$ = this.PotentialCustomerForm.controls['industryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.industryName)),
      map((name: any) => (name ? this.filteredindustryOptions(name) : this.industryList?.slice()))
    );
  }
  private filteredindustryOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.industryList.filter((option: any) => option.industryName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataindustry();
  }
  NoDataindustry(): any {
    this.PotentialCustomerForm.controls['industryId'].setValue('');
    return this.industryList;
  }
  displayindustryListLabelFn(data: any): string {
    return data && data.industryName ? data.industryName : '';
  }
  industryListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.industryId = selectedValue.industryId;
  }

  IndustryEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.industryId = null;
    }
  }

  //#endregion

  //#region customer ranking
  getCustomerRankingList() {
    this.customerrankingService.GetAllActiveCustomerRanking().subscribe(result => {
      this.customerRankingList = result;
      this.customerRankingFun();
    })
  }
  customerRankingFun() {
    this.filteredcustomerRankingOptions$ = this.PotentialCustomerForm.controls['customerRankingId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.rankName)),
      map((name: any) => (name ? this.filteredcustomerRankingOptions(name) : this.customerRankingList?.slice()))
    );
  }
  private filteredcustomerRankingOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.customerRankingList.filter((option: any) => option.rankName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatacustomerRanking();
  }
  NoDatacustomerRanking(): any {
    this.PotentialCustomerForm.controls['customerRankingId'].setValue('');
    return this.customerRankingList;
  }
  displaycustomerRankingListLabelFn(data: any): string {
    return data && data.rankName ? data.rankName : '';
  }
  customerRankingListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.customerRankingId = selectedValue.customerRankingId;
  }

  RankingEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.customerRankingId = null;
    }
  }

  //#endregion

  //#region Status
  getAllStatus() {
    this.commonService.getAllStatus().subscribe(result => {
      this.statusList = result;
      const value = this.statusList.find(obj => obj.pcStatus == 'Draft')
      this.PotentialCustomerForm.controls['pcStatusId'].setValue(value);
      this.pcStatusId = value?.pcStatusId;
      this.statusFun();
    });
  }
  statusFun() {
    this.filteredStatusOptions$ = this.PotentialCustomerForm.controls['pcStatusId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.pcStatus)),
      map((name: any) => (name ? this.filteredStatusOptions(name) : this.statusList?.slice()))
    );
  }
  private filteredStatusOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.statusList.filter((option: any) => option.pcStatus.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataStatus();
  }
  NoDataStatus(): any {
    this.PotentialCustomerForm.controls['pcStatusId'].setValue('');
    return this.statusList;
  }
  displayStausListLabelFn(data: any): string {
    return data && data.pcStatus ? data.pcStatus : '';
  }
  StatusListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.pcStatusId = selectedValue.pcStatusId;
  }
  isOptionDisabled(option: any): any {
    if (this.pcStatusId == 1) {
      this.isDraft = false;
      return !(option.pcStatusId === 1 || option.pcStatusId === 2);
    } else if (this.pcStatusId == 2) {
      this.isDraft = false;
      return !(option.pcStatusId === 1 || option.pcStatusId === 2);
    }
    else if (this.pcStatusId == 3) {
      return !(option.pcStatusId === 3);
    }
    else if (this.pcStatusId == 4) {
      this.isDraft = true;
      return !(option.pcStatusId === 4);
    }
  }
  //#endregion 

  //#region approval status
  // GetAllApprovalStatus() {
  //   this.commonService.GetAllApprovalStatus().subscribe(result => {
  //     this.approvalStatusList = result;
  //     const value = this.approvalStatusList.find(obj => obj.approvalStatusId == 1)
  //     this.PotentialCustomerForm.controls['approvalStatusId'].setValue(value);
  //     this.approvalStatusId = 1;
  //     this.ApprovalStatusFun();
  //   })
  // }
  // ApprovalStatusFun() {
  //   this.filteredApprovalStatusOptions$ = this.PotentialCustomerForm.controls['approvalStatusId'].valueChanges.pipe(
  //     startWith(''),
  //     map((value: any) => (typeof value === 'string' ? value : value?.approvalStatus)),
  //     map((name: any) => (name ? this.filteredApprovalStatusOptions(name) : this.approvalStatusList?.slice()))
  //   );
  // }
  // private filteredApprovalStatusOptions(name: string): any[] {
  //   const filterValue = name.toLowerCase();
  //   const results = this.approvalStatusList.filter((option: any) => option.approvalStatus.toLowerCase().includes(filterValue));
  //   return results.length ? results : this.NoDataApprovalStatus();
  // }
  // NoDataApprovalStatus(): any {
  //   this.PotentialCustomerForm.controls['approvalStatusId'].setValue('');
  //   return this.approvalStatusList;
  // }
  // displayApprovalStatusLabelFn(data: any): string {
  //   return data && data.approvalStatus ? data.approvalStatus : '';
  // }
  // selectApprovalStatus(data: any) {
  //   let selectedValue = data.option.value;
  //   this.approvalStatusId = selectedValue.approvalStatusId;
  // }

  //#endregion
  //#region communication
  getAllCommunication() {
    this.commonService.getAllCommunication().subscribe(result => {
      this.CommunicationList = result;
      this.communicationFun();
    });
  }
  communicationFun() {
    this.filteredcommunicationOptions$ = this.PotentialCustomerForm.controls['modeofFollowUpId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofFollowUp)),
      map((name: any) => (name ? this.filteredcommunicationOptions(name) : this.CommunicationList?.slice()))
    );
  }
  private filteredcommunicationOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.CommunicationList.filter((option: any) => option.modeofFollowUp.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatacommunication();
  }
  NoDatacommunication(): any {
    this.PotentialCustomerForm.controls['modeofFollowUpId'].setValue('');
    return this.CommunicationList;
  }
  displaycommunicationListLabelFn(data: any): string {
    return data && data.modeofFollowUp ? data.modeofFollowUp : '';
  }
  communicationListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.modeofFollowUpId = selectedValue.modeofFollowUpId;
  }

  PreferenceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.modeofFollowUpId = null;
    }
  }

  //#endregion

  //#region 
  getAllServiceInterest() {
    this.commonService.getAllInterest().subscribe(result => {
      this.serviceInterestList = result;
      this.serviceInterestFun()
    });
  }
  serviceInterestFun() {
    this.filteredserviceInterestOptions$ = this.PotentialCustomerForm.controls['interestlevelId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.interestlevel)),
      map((name: any) => (name ? this.filteredserviceInterestOptions(name) : this.serviceInterestList?.slice()))
    );
  }
  private filteredserviceInterestOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceInterestList.filter((option: any) => option.interestlevel.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataserviceInterest();
  }
  NoDataserviceInterest(): any {
    this.PotentialCustomerForm.controls['interestlevelId'].setValue('');
    return this.serviceInterestList;
  }
  displayInterestListLabelFn(data: any): string {
    return data && data.interestlevel ? data.interestlevel : '';
  }
  interestListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.interestlevelId = selectedValue.interestlevelId;
  }

  LevelEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.interestlevelId = null;
    }
  }

  //#endregion

  //#region information
  getAllInfosource() {
    this.infosourceService.getInfosource(this.liveStatus).subscribe(result => {
      this.infosourceList = result;
      this.infosourceFun();
    });
  }
  infosourceFun() {
    this.filteredinfosourceOptions$ = this.PotentialCustomerForm.controls['informationSourceId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.informationSourceName)),
      map((name: any) => (name ? this.filteredinfosourceOptions(name) : this.infosourceList?.slice()))
    );
  }
  private filteredinfosourceOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.infosourceList.filter((option: any) => option.informationSourceName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatainfosource();
  }
  NoDatainfosource(): any {
    this.PotentialCustomerForm.controls['informationSourceId'].setValue('');
    return this.infosourceList;
  }
  displayinfosourceListLabelFn(data: any): string {
    return data && data.informationSourceName ? data.informationSourceName : '';
  }
  infosourceSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.informationSourceId = selectedValue.informationSourceId;
    this.informationSourceName = selectedValue.informationSourceName.toLowerCase();
    if (this.informationSourceName == 'by reference') {
      this.reference = true;
      this.UpdateValidity();
    } else {
      this.reference = false;
      this.PotentialCustomerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidity();
    }
  }

  SourceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.informationSourceId = null;
      this.reference = false;
      this.PotentialCustomerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidity();
    }
  }

  UpdateValidity() {
    if (this.reference) {
      this.PotentialCustomerForm.get('referenceDetails')?.setValidators([Validators.required]);
    }
    else {
      this.PotentialCustomerForm.controls['referenceDetails']?.setValidators([Validators.nullValidator]);
    }
    this.PotentialCustomerForm.controls['referenceDetails']?.updateValueAndValidity();
  }
  //#endregion
  //#region service
  GetAllServiceType() {
    this.serviceTypeService.GetAllServiceType(this.liveStatus).subscribe(res => {
      this.serviceTypeList = res;
      this.ServiceTypeFun();
    })
  }
  ServiceTypeFun() {
    this.filteredServiceTypeListOptions$ = this.PotentialCustomerForm.controls['serviceType'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.serviceTypeName)),
      map((name: any) => (name ? this.filteredServiceTypeListOptions(name) : this.serviceTypeList?.slice()))
    );
  }
  private filteredServiceTypeListOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.serviceTypeList.filter((option: any) => option.serviceTypeName.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataServiceType();
  }
  NoDataServiceType(): any {
    this.PotentialCustomerForm.controls['serviceType'].setValue('');
    return this.serviceTypeList;
  }
  displayServiceTypeListLabelFn(data: any): string {
    return data && data.serviceTypeName ? data.serviceTypeName : '';
  }
  ServiceTypeListSelectedoption(data: any) {
    let selectedValue = data.option.value;
    this.serviceTypeId = selectedValue.serviceTypeId;
  }

  ServiceEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.serviceTypeId = null;
    }
  }

  //#endregion
  //#region inco terms autocomplete
  GetAlllineItem() {
    this.lineitemService.GetAlllineItem(this.liveStatus).subscribe(res => {
      this.LineItemCategoryList = res;
    });
  }

  LineItemCategorySelectedoption(data: any) {
    let selectedIncoterm = data.option.value;
    this.lineItemCategoryId = selectedIncoterm.lineItemCategoryId;
  }
  //#endregion

  // #region Line Item Category


  onSelectLineIC() {
    const selectedIncos = this.PotentialCustomerForm.controls['lineItemCategoryId'].value;
    const uniqueSelectedInco = selectedIncos.filter(
      (selectedInco: any) =>
        !this.pcLineItemCategory.some(
          (existingInco: any) => existingInco.lineItemCategoryId === selectedInco
        )
    );
    uniqueSelectedInco.forEach((selectedInco: any) => {
      this.IncoForm = this.fb.group({
        pcLineItemCategoryId: [0],
        potentialCustomerId: [0],
        lineItemCategoryId: [selectedInco],
        createdBy: [parseInt(this.userId$)],
        createdDate: [this.date],
        updatedBy: [parseInt(this.userId$)],
        updatedDate: [this.date]
      });
      this.pcLineItemCategory.push(this.IncoForm.value);
    });
    const uncheckedIncos = this.pcLineItemCategory.filter(
      (existingInco: any) =>
        !selectedIncos.includes(existingInco.lineItemCategoryId)
    );
    uncheckedIncos.forEach((uncheckedInco: any) => {
      const index = this.pcLineItemCategory.findIndex(
        (existingInco: any) =>
          existingInco.lineItemCategoryId === uncheckedInco.lineItemCategoryId
      );
      if (index !== -1) {
        this.pcLineItemCategory.splice(index, 1);
      }
    });
  }

  //getAll by potential customer Id 
  getAllbyId(id: number) {
    this.potentialCustomerService.getAllPotentialCustomerById(id).subscribe(result => {
      this.potentialCustomerContainer = result;
      this.potentialCustomer = result.potentialCustomer;
      this.potentialCustomerContacts = result.potentialCustomerContacts;
      this.potentialCustomerAddress = result.potentialCustomerAddresses;
      this.potentialCustomerDocuments = result.potentialCustomerDocuments;

      this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];

      this.pcContactArray = result.potentialCustomerContacts;
      this.pcAddressArray = result.potentialCustomerAddresses;
      this.pcDocumentArray = result.potentialCustomerDocuments;
      this.pcLineItemCategory = result.pcLineItemCategory;
      if (this.pcLineItemCategory != null) {
        const selectedCommodity = this.pcLineItemCategory.map(val => val.lineItemCategoryId);
        this.PotentialCustomerForm.controls['lineItemCategoryId'].setValue(selectedCommodity);
      }

      this.setValues();
    });
  }
  setName() {
    const aliasName = this.PotentialCustomerForm.controls['aliasName'].value
    if (aliasName == null) {
      const name = this.PotentialCustomerForm.controls['customerName'].value
      this.PotentialCustomerForm.controls['aliasName'].setValue(name);
    }
  }

  setValues() {
    this.PotentialCustomerForm.patchValue(this.potentialCustomer);
    this.potentialCustomerId = this.potentialCustomer.potentialCustomerId;
    this.customerCurrencyId = this.potentialCustomer.customerCurrencyId;
    this.billingCurrencyId = this.potentialCustomer.billingCurrencyId;
    this.salesOwnerId = this.potentialCustomer.salesOwnerId;
    this.salesExecutiveId = this.potentialCustomer.salesExecutiveId;
    this.informationSourceId = this.potentialCustomer.informationSourceId;
    this.pcStatusId = this.potentialCustomer.pcStatusId;
    if (this.pcStatusId == 4) {
      this.isDraft = true;
    }
    //this.approvalStatusId = this.potentialCustomer.approvalStatusId;
    this.interestlevelId = this.potentialCustomer.interestlevelId;
    this.industryId = this.potentialCustomer.industryId;
    this.modeofFollowUpId = this.potentialCustomer.modeofFollowUpId;
    this.customerRankingId = this.potentialCustomer.customerRankingId;
    this.serviceTypeId = this.potentialCustomer.serviceId;

    const referenceDetails = this.potentialCustomer.referenceDetails;
    if (referenceDetails != null) {
      this.reference = true;
      this.UpdateValidity();
    } else {
      this.reference = false;
      this.PotentialCustomerForm.controls['referenceDetails'].setValue(null);
      this.UpdateValidity();
    }

    this.PotentialCustomerForm.controls['potentialCustomerId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['customerCurrencyId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['billingCurrencyId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['customerRankingId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['informationSourceId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['pcStatusId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['industryId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['interestlevelId'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['serviceType'].setValue(this.potentialCustomer);
    this.PotentialCustomerForm.controls['modeofFollowUpId'].setValue(this.potentialCustomer);
    //this.PotentialCustomerForm.controls['approvalStatusId'].setValue(this.potentialCustomer);

    this.salesOwnerget();
    this.salesExecutiveget();
  }
  salesOwnerget() {
    this.employeeService.getEmployee(this.potentialCustomer.salesOwnerId).subscribe(res => {
      this.PotentialCustomerForm.controls['salesOwnerId'].setValue(res);
    });
  }
  salesExecutiveget() {
    this.employeeService.getEmployee(this.potentialCustomer.salesExecutiveId).subscribe(res => {
      this.PotentialCustomerForm.controls['salesExecutiveId'].setValue(res);
    });
  }
  //---------------------------General--------------------------------------
  restrictInput(event: KeyboardEvent): void {
    const allowedChars = /[0-9()+-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  iniForm() {
    this.PotentialCustomerForm = this.fb.group({
      potentialCustomerId: [0],
      potentialCustomerCode: [{ value: null, disabled: true }],
      customerName: [null, Validators.required],
      aliasName: [null, Validators.required],
      customerEmail: [null, Validators.email],
      customerPhone: [null],
      companyWebsite: [null],
      billingCurrencyId: [null],
      customerCurrencyId: [null],
      industryId: [null],
      salesOwnerId: ['', Validators.required],
      salesExecutiveId: [null],
      customerRankingId: [null],
      informationSourceId: [null],
      referenceDetails: [null],
      lineItemCategoryId: [[]],
      serviceType: [null],
      pcStatusId: [null, Validators.required],
      //approvalStatusId:[null],
      interestlevelId: [null],
      modeofFollowUpId: [null],
      customerRemarks: [null],
      tags: [null],
      liveStatus: [true],
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });

  }
  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.PotentialCustomerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.capitalizeWords(this.toUpperCaseAndTrimId(name)));
      }
    }
    return invalidControls;
  }

  toUpperCaseAndTrimId(name: string): string {
    if (name.endsWith('Id')) {
      name = name.slice(0, -2);
    }
    return name;
  }
  capitalizeWords(name: string): string {
    const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }


  onSaveGeneral(value: any) {
    console.log('pcLineItemCategory', this.pcLineItemCategory);

    if (!this.PotentialCustomerForm.controls['customerEmail'].valid) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 2000,
      });
      this.PotentialCustomerForm.controls['customerEmail'].markAllAsTouched();
      return
    }
    if (this.showAddRowDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Add or remove details in Document Detail tab",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(3);
      return;
    }
    //Status Update 
    if (value === 'Save') {
      if (this.pcStatusId == 1) {
        this.pcStatusId = 1;
      } else if (this.pcStatusId == 2) {
        this.pcStatusId = 2;
      }
      else if (this.pcStatusId == 3) {
        this.pcStatusId = 3;
      } if (this.pcStatusId == 4) {
        this.pcStatusId = 1;
      }
    }
    else if (value === 'Draft') {
      if (this.pcStatusId == 4) {
        this.pcStatusId = 4;
      }
    }

    if (this.PotentialCustomerForm.valid) {
      this.potentialCustomer = this.PotentialCustomerForm.value;
      this.potentialCustomer.potentialCustomerCode = this.PotentialCustomerForm.controls['potentialCustomerCode'].value;
      this.potentialCustomer.potentialCustomerId = this.PotentialCustomerForm.controls['potentialCustomerId'].value;
      this.potentialCustomer.aliasName = this.PotentialCustomerForm.controls['aliasName'].value;
      this.potentialCustomer.customerEmail = this.PotentialCustomerForm.controls['customerEmail'].value;
      this.potentialCustomer.customerPhone = this.PotentialCustomerForm.controls['customerPhone'].value;
      this.potentialCustomer.companyWebsite = this.PotentialCustomerForm.controls['companyWebsite'].value;
      this.potentialCustomer.referenceDetails = this.PotentialCustomerForm.controls['referenceDetails'].value;
      this.potentialCustomer.tags = this.PotentialCustomerForm.controls['tags'].value;
      this.potentialCustomer.customerRemarks = this.PotentialCustomerForm.controls['customerRemarks'].value;
      this.potentialCustomer.potentialCustomerId = this.potentialCustomerId
      this.potentialCustomer.customerCurrencyId = this.customerCurrencyId;
      this.potentialCustomer.billingCurrencyId = this.billingCurrencyId;
      this.potentialCustomer.salesOwnerId = this.salesOwnerId;
      this.potentialCustomer.salesExecutiveId = this.salesExecutiveId;
      this.potentialCustomer.informationSourceId = this.informationSourceId;
      this.potentialCustomer.pcStatusId = this.pcStatusId;
      // this.potentialCustomer.approvalStatusId = this.approvalStatusId;
      this.potentialCustomer.interestlevelId = this.interestlevelId;
      this.potentialCustomer.industryId = this.industryId;
      this.potentialCustomer.modeofFollowUpId = this.modeofFollowUpId;
      this.potentialCustomer.serviceId = this.serviceTypeId;
      this.potentialCustomer.customerRankingId = this.customerRankingId;
      this.potentialCustomer.updatedBy = parseInt(this.userId$);

      const ModelContainer: PotentialCustomerContainer = {
        potentialCustomer: this.potentialCustomer,
        potentialCustomerContacts: this.potentialCustomerContacts,
        potentialCustomerAddresses: this.potentialCustomerAddress,
        potentialCustomerDocuments: this.potentialCustomerDocuments,
        pcLineItemCategory: this.pcLineItemCategory
      }
      if (this.potentialCustomerContacts.length == 0 && this.pcStatusId != 4) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary contact details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(1);
        return
      }
      if (this.potentialCustomerAddress.length == 0 && this.pcStatusId != 4) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please fill the one primary address details.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.changeTab(2);
        return
      }

      if (this.potentialCustomerContacts.length) {
        let contact = this.potentialCustomerContacts.find((element) => element.primaryContact == true);

        if (contact?.primaryContact == false || contact == undefined) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the one primary contact details.",
            showConfirmButton: false,
            timer: 2000,
          });
          return;
        }
      }
      if (this.potentialCustomerAddress.length) {
        let address = this.potentialCustomerAddress.find((element) => element.primaryAddress == true);
        if (address?.primaryAddress == false || address == undefined) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill the one primary address details.",
            showConfirmButton: false,
            timer: 2000,
          });
          return;
        }
      }


      if (ModelContainer.potentialCustomer.potentialCustomerId == 0 || ModelContainer.potentialCustomer.potentialCustomerId == undefined) {
        this.potentialCustomerService.PotentialCustomerSave(ModelContainer).subscribe({
          next: (res) => {
            console.log(this.ImageDetailsArray)
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {

              },
              error: (error) => {
              }
            });
            this.pcres = res.potentialCustomer.potentialCustomerId
            const id = this.pcres
            const parms = {
              MenuId: 25,
              currentUser: this.userId$,
              activityName: "Creation",
              id: res.potentialCustomer.potentialCustomerId,
              code: res.potentialCustomer.potentialCustomerCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {

            }));
            Swal.fire({
              icon: 'success',
              title: 'Added Sucessfully',
              text: "Do you need to create Sales opportunity for " + ModelContainer.potentialCustomer.customerName + " ?",
              showCancelButton: true,
              cancelButtonText: 'No',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes',
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.pagePrivilege.includes('edit')) {
                  this.potentialCustomerService.isEdit = true;
                }
                if (this.pagePrivilege.includes('view')) {
                  this.potentialCustomerService.isView = true;
                }
                if (this.pagePrivilege.includes('create')) {
                  this.potentialCustomerService.isAdd = true;
                }
                this.potentialCustomerService.salesOppourtunity = true;
                this.potentialCustomerService.setItemId(id);

                // Set the selected customer ID to a variable
                this.selectedCustomerId = id;

                // Pass the id as a parameter when navigating
                this.router.navigate(['/crm/transaction/salesopportunity/create']);
              }
            })
            this.returnToList();
          }, error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if (stausCode === 500) {
              this.errorHandler.handleError(err);
            } else if (stausCode === 400) {
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
      }
      else {
        this.potentialCustomerService.PotentialCustomerSave(ModelContainer).subscribe({
          next: (res) => {
            console.log(this.ImageDetailsArray)
            const formData = new FormData();
            this.ImageDetailsArray.forEach((file) => formData.append('imageFile', file));
            this.Fs.FileUpload(formData).subscribe({
              next: (res) => {

              },
              error: (error) => {
              }
            });
            const parms = {
              MenuId: 25,
              currentUser: this.userId$,
              activityName: "Updation",
              id: res.potentialCustomer.potentialCustomerId,
              code: res.potentialCustomer.potentialCustomerCode
            }
            this.Ns.TriggerNotification(parms).subscribe((res => {

            }));
            this.commonService.displayToaster(
              "success",
              "Success",
              "Updated Sucessfully"
            );
            this.returnToList();
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if (stausCode === 500) {
              this.errorHandler.handleError(err);
            } else if (stausCode === 400) {
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
      }
    }
    else {
      this.changeTab(0);
      const invalidControls = this.findInvalidControls();

      this.PotentialCustomerForm.markAllAsTouched();
      this.validateall(this.PotentialCustomerForm);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
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

  resetGeneral() {
    this.showAddRowDoc = false;
    if (this.gereralEdit) {
      this.getAllbyId(this.potentialCustomerService.itemId);
    }
    this.PotentialCustomerForm.reset();
    this.potentialCustomer = new PotentialCustomer();
    this.potentialCustomerContacts = [];
    this.potentialCustomerAddress = [];
    this.potentialCustomerDocuments = [];

    this.pcContactArray = [];
    this.pcAddressArray = [];
    this.pcDocumentArray = [];
    this.ngOnInit();
  }
  //---------------------------contacts--------------------------------------

  onEditContact(Data: any) {
    this.rowIndexContact = this.potentialCustomerContacts.indexOf(Data);
    this.editedContact = { ...Data }
    this.potentialCustomerContacts.splice(this.rowIndexContact, 1);
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: {
        contactData: Data,
        list: this.potentialCustomerContacts,
        mode: 'Edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialCustomerContacts.splice(this.rowIndexContact, 0, result);
        this.potentialCustomerContacts = [...this.potentialCustomerContacts];
      }
      else {
        this.potentialCustomerContacts.splice(this.rowIndexContact, 0, this.editedContact);
        this.potentialCustomerContacts = [...this.potentialCustomerContacts];
      }
    });
  }
  onDeleteContact(data: any) {
    const rowIndex = this.potentialCustomerContacts.indexOf(data);
    this.potentialCustomerContacts.splice(rowIndex, 1);
    this.potentialCustomerContacts = [...this.potentialCustomerContacts];
  }
  onviewContact(Data: any) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: {
        contactData: Data,
        mode: 'View',
      }
    });

  }
  openDialog() {
    debugger
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: {
        list: this.potentialCustomerContacts
      }, disableClose: true, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialCustomerContacts.splice(0, 0, result);
        this.potentialCustomerContacts = [...this.potentialCustomerContacts];
      }
    });
  }


  //---------------------------address--------------------------------------

  onEditAddress(Data: any) {
    debugger
    this.rowIndexAddress = this.potentialCustomerAddress.indexOf(Data);
    this.editedAddress = { ...Data }
    this.potentialCustomerAddress.splice(this.rowIndexAddress, 1);
    const dialogRef = this.dialog.open(AddressDialogComponent, { data: { addressDate: Data, list: this.potentialCustomerAddress, mode: 'Edit', index: this.rowIndexAddress }, disableClose: true, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialCustomerAddress.splice(this.rowIndexAddress, 0, result);
        this.potentialCustomerAddress = [...this.potentialCustomerAddress];
      }
      else {
        this.potentialCustomerAddress.splice(this.rowIndexAddress, 0, this.editedAddress);
        this.potentialCustomerAddress = [...this.potentialCustomerAddress];
      }
    });
  }
  onDeleteAddress(data: any) {
    const rowIndex = this.potentialCustomerAddress.indexOf(data);
    this.potentialCustomerAddress.splice(rowIndex, 1);
    this.potentialCustomerAddress = [...this.potentialCustomerAddress];
  }
  onviewAddress(Data: any) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      data: {
        addressDate: Data,
        mode: 'View',
      }
    });
  }
  AddressDialog() {
    const dialogRef = this.dialog.open(AddressDialogComponent, { data: { list: this.potentialCustomerAddress } });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.potentialCustomerAddress.splice(0, 0, result)
        this.potentialCustomerAddress = [...this.potentialCustomerAddress];
      }
    });
  }


  //---------------------------attachments--------------------------------------

  getDocumentList() {
    this.docmentsService.getDocuments(this.liveStatus).subscribe(res => {
      this.documents = res;
    });
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({ skip: skip, take: take });
    this.isEditDocument = false;
    if (!this.showAddRowDoc) {
      const newRow: PotentialCustomerDocument = {
        pcDocumentId: 0,
        potentialCustomerId: 0,
        documentId: 0,
        remarks: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        documentName: '',
        documentTypeName: '',
        IseditDoc: true,
        newDoc: true,
        files: ''
      };
      this.remarks = '';
      this.potentialCustomerDocuments = [newRow, ...this.potentialCustomerDocuments];
      this.showAddRowDoc = true;
    }
  }
  onInputChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.documents.some(doc => doc.documentName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.documentTypeName = '';
    }
  }
  SaveDoc(data: PotentialCustomerDocument) {
    debugger

    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    this.pcDocumentArray.forEach(element => {
      if (element.documentTypeName === data.documentTypeName) {
        this.existDoc = true
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      this.pcDocumentArray.splice(0, 0, data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc = false;
    this.fileName = '';
  }

  UpdateDoc(data: PotentialCustomerDocument) {
    debugger
    if (data.documentTypeName == "" || this.fileName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.files = this.file;
    data.documentTypeName = this.documentTypeName
    data.documentName = this.fileName;
    data.documentId = this.documentId;
    data.remarks = this.remarks;
    if (this.onSelectDoc) {
      data.documentName = this.fileName;
      data.remarks = this.remarks;
      data.documentTypeName = this.documentTypeName;
      data.documentId = this.documentId;
    }
    this.pcDocumentArray.forEach(element => {
      if (element.documentName === data.documentName) {
        this.existDoc = true;
      }
    });
    if (this.existDoc) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      this.showAddRowDoc = true;
      data.IseditDoc = true;
      this.existDoc = false;
      return;
    }
    else {
      this.pcDocumentArray.splice(this.rowIndexforDoc, 0, data);
      //this.pcDocumentArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }

  EditDoc(data: PotentialCustomerDocument) {
    debugger
    this.isEditDocument = true;
    data.IseditDoc = true;
    this.documentTypeName = data.documentTypeName;
    this.documentId = data.documentId;
    this.remarks = data.remarks;
    this.fileName = data.documentName;
    const rowIndex = this.pcDocumentArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDocumet = { ...data };
    this.removeDoc = this.pcDocumentArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  Deletedoc(data: PotentialCustomerDocument) {
    debugger
    const rowIndex = this.pcDocumentArray.indexOf(data);
    this.pcDocumentArray.splice(rowIndex, 1);
    this.potentialCustomerDocuments.splice(rowIndex, 1);
    this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
    data.IseditDoc = false;
    this.showAddRowDoc = false;
  }
  oncancelDoc(data: any) {
    debugger
    const rowIndex = this.potentialCustomerDocuments.indexOf(data);

    if (data?.documentTypeName !== "") {
      data.IseditDoc = false;
      this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }

    if (data.newDoc) {
      this.potentialCustomerDocuments.splice(rowIndex, 1);
      //this.pcDocumentArray.splice(rowIndex,1);
      this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      this.fileName = '';
      return;
    }
    if (data.IseditDoc) {
      this.potentialCustomerDocuments.splice(rowIndex, 1);
      this.potentialCustomerDocuments.splice(rowIndex, 0, this.editDocumet);
      this.pcDocumentArray.splice(rowIndex, 0, this.editDocumet);
      this.potentialCustomerDocuments = [...this.potentialCustomerDocuments];
      this.showAddRowDoc = false;
      this.editDocumet.IseditDoc = false;
      data.newDoc = false;
      this.fileName = '';
    }

  }


  File(event: any): void {

    if (event?.target?.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.fileName = file.name;
        const fileName = file.name.toLowerCase();
        const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
        const supportedFileTypes = [
          'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'pdf',
          'doc', 'docx', 'xls', 'xlsx'
        ];

        // Check if the file type is allowed (jpg or png)
        if (supportedFileTypes.includes(fileType)) {
          // Check if the image already exists, then update it
          const existingIndex = this.potentialCustomerDocuments.findIndex(img => img.documentName.toLowerCase() === fileName);
          if (existingIndex !== -1) {
            // If the image already exists, update it
            this.ImageDetailsArray[existingIndex] = file;

          } else {
            // If the image doesn't exist, add it to the array
            this.ImageDetailsArray.push(file);
            console.log(this.ImageDetailsArray)
          }
        } else {
          // Handle unsupported file types
          this.commonService.displayToaster(
            "error",
            "error",
            "Please Choose a JPG, JPEG, PNG, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX, XLS, or XLSX File."
          );
          this.documentName = ''
        }
      }
    }
  }


  selectDocevent(item: any) {
    debugger
    this.onSelectDoc = true;
    this.documentId = item.documentId;
    this.documentTypeName = item.documentName;
    //this.remarks = item.remarks
  }

  ValidateFieldDoc(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }
  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowDoc ? this.SaveDoc(dataItem) : this.UpdateDoc(dataItem);
    }
  }
  /// to reach submit button
  handleChangeDoc(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeDoc(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressDoc(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelDoc(dataItem)
    }
  }
  //#endregion
  Downloads(file: any) {
    this.Fs.DownloadFile(file).subscribe((blob: Blob) => {
      saveAs(blob, file);
    });
  }

  show(event: any): void {
    var filePath = this.Filepath + event
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
      this.dialog.open(this.imagePreview, { data: filePath });
    } else {
      window.open(filePath, '_blank');
    }
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }
}
