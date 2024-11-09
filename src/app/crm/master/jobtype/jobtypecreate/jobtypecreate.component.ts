import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncoTermService } from '../../incoterm/incoterm.service';
import { InvoicingFlags, JTModeofTransport, JobCategory, JobTypeDocument, JobTypeGeneral, JobTypeLineItem, JobTypeModelContainer, JobTypeStatus, StatusTypeInJobTypes } from '../jobtypemodel.model';
import { LineitemmasterService } from '../../LineItemMaster/line-item-master/lineitemmaster.service';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { Observable, map, startWith } from 'rxjs';
import { JobtypeserviceService } from '../jobtypeservice.service';
import { DocmentsService } from '../../document/document.service';
import { Documents } from 'src/app/Models/crm/master/documents';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import Swal from 'sweetalert2';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { CommonService } from 'src/app/services/common.service';
import { ModeofTransports } from 'src/app/Models/crm/master/Dropdowns';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-jobtypecreate',
  templateUrl: './jobtypecreate.component.html',
  styleUrls: ['./jobtypecreate.component.css', '../../../../ums/ums.styles.css']
})
export class JobtypecreateComponent {
  showAddRowStatus: boolean;
  keywordStatus = 'jobStageStatus'
  keywordDoc = 'documentName'
  keywordLine = 'lineItemName'
  keywordInvoice = 'invoicingFlag'
  content = new FormControl();
  jobTypeGeneralmodel: JobTypeGeneral = new JobTypeGeneral();

  jobTypeModelContainer: JobTypeModelContainer;
  jobTypeGeneral: JobTypeGeneral = new JobTypeGeneral();
  jobTypeLineItems: JobTypeLineItem[] = [];
  jobTypeStatuses: JobTypeStatus[] = [];
  jobTypeDocuments: JobTypeDocument[] = [];

  jobTypeLineItemArray: JobTypeLineItem[] = [];
  jobTypeStatusArray: JobTypeStatus[] = [];
  jobTypeDocArray: JobTypeDocument[] = [];

  lineItemDatalist: LineItemMaster[];
  invoicingFlagList: InvoicingFlags[];
  modeofTransportList: ModeofTransports[];
  incotermList: Incoterm[];
  jobStageStatusList: StatusTypeInJobTypes[];


  LiveStatus: number = 1;

  filteredLineItemOptions$: Observable<any[]>;
  filteredTransportOptions$: Observable<any[]>;
  filteredincotermOptions$: Observable<any[]>;
  filteredInvoiceOptions$: Observable<any[]>;
  LineItemIdValue: number;
  lineitemCategory: string;

  jobTypeGeneralform: FormGroup;
  viewMode: boolean = false;
  showAddRowLineItem: boolean;
  date = new Date();
  jobTypeId: number
  jobStageStatusId: number;
  documentId: number;

  documents: Documents[] = [];
  showAddRowDoc: boolean;
  transportModeId: any;
  incoTermId: any;
  invoicingFlagId: number;
  processTitle = 'Add';
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  statusName: string;
  documentCode: string;
  remarks: string;
  documentName: string;
  existStatus: boolean;
  lineItemName: string;
  lineItemCode: string;
  lineItemId: number;
  lineItemCategoryName: string;
  invoicingFlag: string;
  existLineItem: boolean = false;
  existDoc: boolean;
  editLineItem: any;
  gereralEdit: boolean;
  RMLineItem: any;
  rowIndexforLineitem: number;
  onSelect: boolean;
  onSelectInvoice: boolean;
  editStstus: any;
  rowIndexforStatus: number;
  removeStatus: JobTypeStatus[];
  SelectStatus: boolean;
  rowIndexforDoc: number;
  editDoc: any;
  removeDoc: JobTypeDocument[];
  onSelectDoc: boolean;
  jobCategoryList: JobCategory[] = [];
  filteredjobCategoryOptions$: Observable<any[]>;
  jobCategoryId: any;
  disablefields: boolean = false;
  userId$: string;
  jtModeofTransport: JTModeofTransport[] = []
  transportform: FormGroup;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip=0;
  minInvoicingFlagObject: InvoicingFlags | undefined;
  selectedIndex = 0;
  isEditDocument: boolean;

  constructor(private router: Router, private fb: FormBuilder,
    private incoTermService: IncoTermService,
    private lineIetmService: LineitemmasterService,
    private jobtypeService: JobtypeserviceService,
    private docmentsService: DocmentsService,
    private commonService: CommonService,
    private ErrorHandling: ErrorhandlingService,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
  ) {
  }

  ngOnInit() {
    this.GetUserId();
    this.iniForm();
    this.getAllStatusType();
    this.getLineItem();
    this.getDocumentList();
    this.getTransportList();
    this.getIncotermList();
    this.getInvoice();
    this.getjobCategoryList();
    this.GetJTPredefinedStage();
    this.matFilter();

    if (!this.jobtypeService.itemId && !this.jobtypeService.isEdit) {
      //document check list binding 
      this.jobtypeService.GetAllDocumentMappingByScreenId(10).subscribe(res => {
        if (res) {
          this.jobTypeDocuments = res.map(ele => {
            return {
              jtypeDocumentId: 0,
              jobTypeId: 0,
              documentId: ele.documentId,
              mandatory: ele.mandatory,
              createdBy: parseInt(this.userId$),
              createdDate: this.date,
              updatedBy: parseInt(this.userId$),
              updatedDate: this.date,
              IseditDoc: false,
              documentName: ele.documentName,
              documentCode: this.getDocCode(ele.documentName),
              remarks: '',
              newDoc: true
            };
          });
          this.jobTypeDocuments = [...this.jobTypeDocuments];
          this.jobTypeDocArray = [...this.jobTypeDocuments];
        }
        console.log(this.jobTypeDocuments)
      });
    }


    if (this.jobtypeService.itemId && this.jobtypeService.isEdit) {
      this.processTitle = 'Edit';
      this.gereralEdit = true;
      this.disablefields = false;
      this.getAllJopTypeById(this.jobtypeService.itemId);
    } else if (this.jobtypeService.itemId && this.jobtypeService.isView) {
      this.processTitle = 'View';
      this.gereralEdit = false;
      this.disablefields = true;
      this.viewMode = true;
      this.jobTypeGeneralform.controls['livestatus'].disable();
      this.jobTypeGeneralform.controls['partDetails'].disable();
      this.jobTypeGeneralform.controls['packageDetails'].disable();
      this.content.disable();
      this.getAllJopTypeById(this.jobtypeService.itemId);
    }

  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  iniForm() {
    this.jobTypeGeneralform = this.fb.group({
      jobTypeId: 0,
      jobTypeCode: ['', Validators.required],
      jobTypeName: ['', Validators.required],
      jobCategoryId: ['', Validators.required],
      transportModeId: [{ value: '', disabled: true }],
      incoTermId: [null],
      partDetails: [''],
      packageDetails: [false],
      remarks: [''],
      livestatus: true,
      createdBy: [parseInt(this.userId$)],
      createdDate: [this.date],
      updatedBy: [parseInt(this.userId$)],
      updatedDate: [this.date]
    });
  }
  //Get by Id
  getAllJopTypeById(id: number) {
    this.jobtypeService.getAllJopTypeById(id).subscribe(result => {
      this.jobTypeLineItems = result.jobTypeLineItems;
      this.jobTypeGeneral = result.jobTypeGeneral;
      this.jobTypeStatuses = result.jobTypeStatuses;
      this.jobTypeDocuments = result.jobTypeDocuments;
      this.jtModeofTransport = result.jtModeofTransport;
      this.jobTypeModelContainer = result;

      this.jobTypeLineItems = [...this.jobTypeLineItems];
      this.jobTypeDocuments = [...this.jobTypeDocuments];
      this.jobTypeStatuses = [...this.jobTypeStatuses];

      this.jobTypeDocArray = result.jobTypeDocuments;
      this.jobTypeStatusArray = result.jobTypeStatuses;
      this.jobTypeLineItemArray = result.jobTypeLineItems;
      this.showAddRowLineItem = false;
      this.jobTypeGeneralform.patchValue(this.jobTypeGeneral)
      this.UpdateValidity();
      this.setVales()
      this.UpdateValidity();
    });
  }
  setVales() {
    debugger
    this.incoTermId = this.jobTypeGeneral.incoTermId;
    // this.transportModeId = this.jobTypeGeneral.transportModeId;
    this.jobCategoryId = this.jobTypeGeneral.jobCategoryId;
    this.jobTypeGeneralform.controls['incoTermId'].setValue(this.jobTypeGeneral);
    const selectedmodeofTreansport = this.jtModeofTransport.map(val => val.modeofTransportId);
    this.jobTypeGeneralform.controls['transportModeId'].setValue(selectedmodeofTreansport);
    this.jobTypeGeneralform.controls['jobCategoryId'].setValue(this.jobTypeGeneral);

    if (this.jobTypeGeneral.jobCategoryId == 1 || this.jobTypeGeneral.jobCategoryId == 3) {
      this.jobTypeGeneralform.controls['transportModeId'].enable();
    }
    this.content.setValue(this.jobTypeGeneral.termsandConditions)
  }

  transportValidation(id: any) {

    if (id == 1 || id == 3) {
      this.jobTypeGeneralform.controls['transportModeId'].enable();
    } else {
      this.jtModeofTransport = [];
      this.transportModeId = null;
      this.getTransportList();
      this.jobTypeGeneralform.controls['transportModeId'].reset();
      this.jobTypeGeneralform.controls['transportModeId'].disable();
    }
  }
  isFieldEnabled(): boolean {
    return !this.jobTypeGeneralform.controls['transportModeId'].disabled;
  }

  // Example method to toggle the control's enabled/disabled state
  toggleField(): void {
    if (this.jobTypeGeneralform.controls['transportModeId'].disabled) {
      this.jobTypeGeneralform.controls['transportModeId'].enable();
    } else {
      this.jobTypeGeneralform.controls['transportModeId'].disable();
    }
  }
  //#region modeofTransport autocomplete
  getTransportList() {
    this.commonService.getAllModeofTransport().subscribe((res: any) => {
      this.modeofTransportList = res;
      this.modeofTransportTypeFun();
      console.log(this.modeofTransportList)
    });
  }
  modeofTransportTypeFun() {
    this.filteredTransportOptions$ = this.jobTypeGeneralform.controls['transportModeId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this.filteredtransportOptions(name) : this.modeofTransportList?.slice()))
    );
  }
  private filteredtransportOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.modeofTransportList.filter((option: any) => option.modeofTransport.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataTransport();
  }
  NoDataTransport(): any {
    this.jobTypeGeneralform.controls['transportModeId'].setValue('');
    return this.modeofTransportList;
  }
  displayTransportLabelFn(transportdata: any): string {
    return transportdata && transportdata.modeofTransport ? transportdata.modeofTransport : '';
  }
  //#endregion

  transportSelectedoption(event: any) {
    debugger
    const selectedTransports = this.jobTypeGeneralform.controls['transportModeId'].value;
    selectedTransports.forEach((mode: number) => {
      if (mode === 1 && selectedTransports.includes(2)) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Can't select both Air and Sea simultaneously.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.jobTypeGeneralform.controls['transportModeId'].reset();
        return;
      }
    });
    selectedTransports.forEach((mode: number) => {
      if (mode === 4 && (selectedTransports.includes(1) || selectedTransports.includes(2) || selectedTransports.includes(3))) {
        Swal.fire({
          icon: "info",
          title: "Oops!",
          text: "Courier can't be combined with any other mode.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.jobTypeGeneralform.controls['transportModeId'].reset();
        return;
      }
    });
    const uniqueSelectedTransport = selectedTransports.filter(
      (selectedTreansport: any) =>
        !this.jtModeofTransport.some(
          (existingTreansport: any) => existingTreansport.modeofTransportId === selectedTreansport
        )
    );
    // Add new services to the array
    uniqueSelectedTransport.forEach((selectedTransport: any) => {
      this.transportform = this.fb.group({
        jtModeofTransportId: 0,
        jobTypeId: 0,
        modeofTransportId: selectedTransport,
        createdBy: parseInt(this.userId$),
        createdDate: new Date(),
        updatedBy: parseInt(this.userId$),
        updatedDate: new Date()
      });
      this.jtModeofTransport.push(this.transportform.value);
    });
    const uncheckedTransport = this.jtModeofTransport.filter(
      (existingTreansport: any) =>
        !selectedTransports.includes(existingTreansport.modeofTransportId)
    );
    uncheckedTransport.forEach((uncheckedService: any) => {
      const index = this.jtModeofTransport.findIndex(
        (existingTreansport: any) =>
          existingTreansport.modeofTransportId === uncheckedService.modeofTransportId
      );
      if (index !== -1) {
        this.jtModeofTransport.splice(index, 1);
      }
    });
    console.log(this.jtModeofTransport)
  }

  UpdateValidity() {
    if (this.jobCategoryId === 1) {
      this.jobTypeGeneralform.get('transportModeId')?.setValidators([Validators.required]);
    }
    else {
      this.jobTypeGeneralform.get('transportModeId')?.setValidators([Validators.nullValidator]);
    }
    this.jobTypeGeneralform.get('transportModeId')?.updateValueAndValidity();
    // this.jobTypeGeneralform.markAllAsTouched();
    // this.validateall(this.jobTypeGeneralform);
  }

  //#region inco terms autocomplete
  getIncotermList() {
    this.incoTermService.getIncoterms(this.LiveStatus).subscribe(res => {
      this.incotermList = res;
      this.incotermTypeFun()
      console.log(this.incotermList);
    });
  }
  incotermTypeFun() {
    this.filteredincotermOptions$ = this.jobTypeGeneralform.controls['incoTermId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.incoTermCode)),
      map((name: any) => (name ? this.filteredincotermOptions(name) : this.incotermList?.slice()))
    );
  }
  private filteredincotermOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.incotermList.filter((option: any) => option.incoTermCode.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDataIncoterm();
  }
  NoDataIncoterm(): any {
    this.jobTypeGeneralform.controls['incoTermId'].setValue('');
    return this.incotermList;
  }
  displayIncotermLabelFn(incodata: any): string {
    return incodata && incodata.incoTermCode ? incodata.incoTermCode : '';
  }
  incotermSelectedoption(incodata: any) {
    let selectedIncoterm = incodata.option.value;

    this.incoTermId = selectedIncoterm.incoTermId;
  }
  incoTermEmpty(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.incoTermId = null;
    }
    }
  //#endregion
  //#region JobCategory  autocomplete
  getjobCategoryList() {
    this.jobtypeService.GetAllJobCategory().subscribe(res => {
      this.jobCategoryList = res;
      this.jobCategoryListFun()
    });
  }
  jobCategoryListFun() {
    this.filteredjobCategoryOptions$ = this.jobTypeGeneralform.controls['jobCategoryId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobCategory)),
      map((name: any) => (name ? this.filteredjobCategoryOptions(name) : this.jobCategoryList?.slice()))
    );
  }
  private filteredjobCategoryOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.jobCategoryList.filter((option: any) => option.jobCategory.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatajobcategory();
  }
  NoDatajobcategory(): any {
    this.jobTypeGeneralform.controls['jobCategoryId'].setValue('');
    return this.jobCategoryList;
  }
  displayjobCategoryLabelFn(data: any): string {
    return data && data.jobCategory ? data.jobCategory : '';
  }
  jobCategorySelectedoption(data: any) {
    debugger
    let selectedIncoterm = data.option.value;
    this.jobCategoryId = selectedIncoterm.jobCategoryId;
    this.transportValidation(this.jobCategoryId);
    this.UpdateValidity();
  }
  //#endregion

  ///-------------------------------jog type general--------------------------------------------
  //// finding In valid field
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.jobTypeGeneralform.controls;
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

  onSaveGeneral() {

    if (this.showAddRowLineItem) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Add or remove details in Line Item Detail tab",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(1);
      return;
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
    if (this.showAddRowStatus) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Add or remove details in Job Status Detail tab",
        showConfirmButton: false,
        timer: 2000,
      });
      this.changeTab(2);
      return;
    }
    if (this.jobTypeGeneralform.valid) {
      this.jobTypeGeneralmodel.jobTypeId = this.jobTypeGeneralform.controls['jobTypeId'].value
      this.jobTypeGeneralmodel.jobTypeCode = this.jobTypeGeneralform.controls['jobTypeCode'].value
      this.jobTypeGeneralmodel.jobTypeName = this.jobTypeGeneralform.controls['jobTypeName'].value
      this.jobTypeGeneralmodel.jobCategoryId = this.jobCategoryId;
      //this.jobTypeGeneralmodel.transportModeId = this.transportModeId
      this.jobTypeGeneralmodel.incoTermId = this.incoTermId
      this.jobTypeGeneralmodel.termsandConditions = this.content.value;
      this.jobTypeGeneralmodel.partDetails = this.jobTypeGeneralform.controls['partDetails'].value ? true : false;
      this.jobTypeGeneralmodel.packageDetails = this.jobTypeGeneralform.controls['packageDetails'].value ? true : false;
      this.jobTypeGeneralmodel.remarks = this.jobTypeGeneralform.controls['remarks'].value
      this.jobTypeGeneralmodel.livestatus = this.jobTypeGeneralform.controls['livestatus'].value ? true : false;
      this.jobTypeGeneralmodel.createdBy = parseInt(this.userId$);
      this.jobTypeGeneralmodel.createdDate = new Date();
      this.jobTypeGeneralmodel.updatedBy = parseInt(this.userId$);
      this.jobTypeGeneralmodel.updatedDate = new Date()

      //preference Order value change
      const sortedStatuses = this.jobTypeStatuses.slice().sort((a, b) => {
        return parseInt(a.preferenceOrder) - parseInt(b.preferenceOrder);
      });

      let value = 10;
      for (const status of sortedStatuses) {
        status.preferenceOrder = value.toString();
        value += 10;
      }
      //console.log(sortedStatuses)
      debugger
      const ModelContainer: JobTypeModelContainer = {
        jobTypeGeneral: this.jobTypeGeneralmodel,
        jtModeofTransport: this.jtModeofTransport,
        jobTypeLineItems: this.jobTypeLineItems,
        jobTypeStatuses: sortedStatuses,
        jobTypeDocuments: this.jobTypeDocuments,
      }
      if (ModelContainer.jobTypeGeneral.jobTypeId == 0) {
        this.jobtypeService.GeneralSave(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Added Sucessfully"
            );
            this.returnToList();
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
      }
      else {
        this.jobtypeService.GeneralSave(ModelContainer).subscribe({
          next: (res) => {
            this.commonService.displayToaster(
              "success",
              "Success",
              "Updated Sucessfully"
            );
            this.returnToList();
          },
          error: (err: HttpErrorResponse) => {
            let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
            if(stausCode === 500){
              this.errorHandler.handleError(err);
            } else if(stausCode === 400){
              this.errorHandler.FourHundredErrorHandler(err);
            } else {
              this.errorHandler.commonMsg();
            }
          },
        });
      }
    }

    else {
      const invalidControls = this.findInvalidControls();
      this.jobTypeGeneralform.markAllAsTouched();
      this.validateall(this.jobTypeGeneralform);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields: " + invalidControls.join(", ") + ".",
        showConfirmButton: true,
      });
      this.changeTab(0);
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

  // transportSelectedoption() {

  //   const selectedModes = this.jobTypeGeneralform.controls['modeofTransportId'].value;
  //   selectedModes.forEach((mode: number) => {
  //     if (mode === 1 && selectedModes.includes(2)) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Oops!",
  //         text: "Can't select both Air and Sea simultaneously",
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });


  //     }
  //   });
  //   selectedModes.forEach((mode: number) => {
  //     if (mode === 4 && (selectedModes.includes(1) || selectedModes.includes(2) || selectedModes.includes(3))) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Oops!",
  //         text: "Courier can't be combined with any other mode",
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });

  //     }
  //   });
  // }
  resetGeneral() {
    debugger
    this.showAddRowLineItem = false;
    this.showAddRowDoc = false;
    this.showAddRowStatus = false;
    if (this.gereralEdit) {
      this.getAllJopTypeById(this.jobtypeService.itemId);
      this.UpdateValidity();
    }
    this.jobTypeGeneralform.reset();
    this.jobTypeGeneralform.controls['livestatus'].setValue(true)
    this.jobTypeGeneralform.get('transportModeId')?.setValidators([Validators.nullValidator]);
    this.jobTypeLineItems = [];
    this.jobTypeStatuses = [];
    this.jobTypeDocuments = [];
    // this.jobTypeTermsAndConditions = new JobTypeTermsAndConditions();
    this.jobTypeModelContainer = new JobTypeModelContainer();
    this.jobTypeDocArray = [];
    this.jobTypeStatusArray = [];
    this.jobTypeLineItemArray = [];
  }
  returnToList() {
    this.router.navigate(['/crm/master/jobtypelist']);
  }

  //----------------------------------Line Item--------------------------------------
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  AddLineItem() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRowLineItem) {

      if(this.invoicingFlagList?.length > 0){
        const minInvoicingFlagId = Math.min(...this.invoicingFlagList.map(item => item.invoicingFlagId));
        this.minInvoicingFlagObject = this.invoicingFlagList.find(item => item.invoicingFlagId === minInvoicingFlagId);
      }

      const newRow: JobTypeLineItem = {
        jtypeLineItemId: 0,
        jobTypeId: 0,
        lineItemId: 0,
        invoicingFlagId: this.minInvoicingFlagObject?.invoicingFlagId || 0,
        lineItemCategoryId: 0,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        lineItemName: '',
        invoicingFlag: this.minInvoicingFlagObject?.invoicingFlag || '',
        lineItemCode: '',
        lineItemCategoryName: '',
        IseditLineItem: true,
        newLineItem: true
      };
      this.existLineItem = false;
      this.lineItemCode = '';
      this.lineItemCategoryName = '';
      this.invoicingFlag = '';
      this.jobTypeLineItems = [newRow, ...this.jobTypeLineItems];
      this.showAddRowLineItem = true;



    }
  }
  onInputChangeLineItem(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.lineItemDatalist.some(x => x.lineItemName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.lineItemName = '';

    }
  }
  preferenceOrder(event: any, dataItem: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    input.value = value;
    dataItem.preferenceOrder = value;
  }
  // select Line Item region
  getLineItem() {
    this.lineIetmService.GetAllLineItemMaster(this.LiveStatus).subscribe(result => {
      this.lineItemDatalist = result;
    });
  }
  // select Line Item region
  getInvoice() {
    this.jobtypeService.getAllInvoice().subscribe(res => {
      this.invoicingFlagList = res;
    });
  }
  onInputChangeinvoicingFlag(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.invoicingFlagList.some(x => x.invoicingFlag.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.invoicingFlag = '';

    }
  }
  SaveLineItem(dataItem: any) {
    debugger
    if (dataItem.lineItemName == "" || dataItem.invoicingFlag == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    dataItem.lineItemName = this.lineItemName;
    dataItem.lineItemId = this.lineItemId;
    dataItem.lineItemCode = this.lineItemCode;
    dataItem.lineItemCategoryName = this.lineItemCategoryName;
    dataItem.invoicingFlag = this.invoicingFlag ? this.invoicingFlag : this.minInvoicingFlagObject?.invoicingFlag;
    dataItem.invoicingFlagId = this.invoicingFlagId ? this.invoicingFlagId : this.minInvoicingFlagObject?.invoicingFlagId;
    this.jobTypeLineItemArray.forEach(x => {
      if (x.lineItemName === dataItem.lineItemName || x.lineItemCode === dataItem.lineItemCode) {
        this.existLineItem = true;
      }
    });
    if (this.existLineItem) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      dataItem.IseditLineItem = true;
      this.showAddRowLineItem = true;
      this.existLineItem = false;
      return
    }
    else {
      this.jobTypeLineItemArray.splice(0, 0, dataItem);
      //this.jobTypeLineItemArray.push(dataItem);
      dataItem.IseditLineItem = false;
      this.showAddRowLineItem = false;
      dataItem.newLineItem = false;
      this.existLineItem = false;
    }
    this.onSelectInvoice = false;
    this.onSelect = false;
  }

  UpdateLineItem(dataItem: any) {
    debugger
    if (dataItem.lineItemName == "" || dataItem.invoicingFlag == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    dataItem.updatedBy = parseInt(this.userId$);
    this.lineItemCode = dataItem.lineItemCode;
    this.lineItemCategoryName = dataItem.lineItemCategoryName;
    if (this.onSelect) {
      dataItem.lineItemName = this.lineItemName;
      dataItem.lineItemId = this.lineItemId;
      dataItem.lineItemCode = this.lineItemCode;
      dataItem.lineItemCategoryName = this.lineItemCategoryName;
    }
    if (this.onSelectInvoice) {
      dataItem.invoicingFlag = this.invoicingFlag ? this.invoicingFlag : this.minInvoicingFlagObject?.invoicingFlag;;
      dataItem.invoicingFlagId = this.invoicingFlagId ? this.invoicingFlagId : this.minInvoicingFlagObject?.invoicingFlagId;;
    }
    this.jobTypeLineItemArray.forEach(x => {
      if (x.lineItemName === dataItem.lineItemName || x.lineItemCode === dataItem.lineItemCode) {
        this.existLineItem = true;
      }

    });
    if (this.existLineItem) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      dataItem.IseditLineItem = true;
      this.showAddRowLineItem = true;
      this.existLineItem = false;
      return;
    }
    else {
      this.jobTypeLineItemArray.splice(this.rowIndexforLineitem, 0, dataItem);
      //this.jobTypeLineItemArray.push(dataItem);
      dataItem.IseditLineItem = false;
      this.showAddRowLineItem = false;
      this.existLineItem = false;
    }
  }

  EditLineItem(dataItem: any) {
    debugger
    dataItem.IseditLineItem = true;
    this.lineItemName = '';
    this.invoicingFlag = '';
    this.lineItemCode = '';
    this.lineItemCategoryName = '';
    this.invoicingFlagId = 0;
    this.lineItemId = 0;

    this.lineItemCode = dataItem.lineItemCode;
    this.lineItemCategoryName = dataItem.lineItemCategoryName;
    this.lineItemId = dataItem.lineItemId
    const rowIndex = this.jobTypeLineItemArray.indexOf(dataItem);
    this.rowIndexforLineitem = rowIndex;
    this.editLineItem = { ...dataItem };
    this.RMLineItem = this.jobTypeLineItemArray.splice(rowIndex, 1)
    this.onSelectInvoice = false;
    this.onSelect = false;
  }

  DeleteLineItem(dataItem: JobTypeLineItem) {
    debugger
    console.log(dataItem)
    const rowIndex = this.jobTypeLineItems.indexOf(dataItem);
    const rowIndex1 = this.jobTypeLineItemArray.indexOf(dataItem);
    this.jobTypeLineItems.splice(rowIndex, 1);
    this.jobTypeLineItemArray.splice(rowIndex1, 1);
    var removed = this.jobTypeLineItems = [...this.jobTypeLineItems];
    console.log(removed)
    console.log(this.jobTypeLineItems)
    console.log(this.jobTypeLineItemArray)

    dataItem.IseditLineItem = false;
    this.showAddRowLineItem = false;
  }
  oncancelLineItem(dataItem: any) {
    debugger
    const rowIndex = this.jobTypeLineItems.indexOf(dataItem);
    if (dataItem.newLineItem) {
      this.jobTypeLineItems.splice(rowIndex, 1);
      //this.jobTypeLineItemArray.splice(rowIndex,1);
      this.jobTypeLineItems = [...this.jobTypeLineItems];
      this.showAddRowLineItem = false;
      dataItem.newStatus = false;
      return;
    }
    if (dataItem.IseditLineItem) {
      this.jobTypeLineItems.splice(rowIndex, 1);
      this.jobTypeLineItems.splice(rowIndex, 0, this.editLineItem);
      this.jobTypeLineItemArray.splice(rowIndex, 0, this.editLineItem);
      this.jobTypeLineItems = [...this.jobTypeLineItems];
      this.showAddRowLineItem = false;
      this.editLineItem.IseditLineItem = false;
      dataItem.newStatus = false;
    }
    // else{
    // this.jobTypeLineItems.splice(rowIndex,0, this.editLineItem);
    // this.jobTypeLineItemArray.splice(rowIndex,0,this.editLineItem);
    // this.jobTypeLineItems = [...this.jobTypeLineItems];
    // this.editLineItem.IseditLineItem = false;
    // this.showAddRowLineItem = false;
    // }
  }
  selectLineevent(data: any) {
    this.onSelect = true;
    this.lineItemName = data.lineItemName;
    this.lineItemCode = data.lineItemCode;
    this.lineItemId = data.lineItemId;
    this.lineItemCategoryName = data.lineItemCategoryName;
  }
  selectInvoiceevent(data: any) {
    this.onSelectInvoice = true;
    this.invoicingFlagId = data.invoicingFlagId;
    this.invoicingFlag = data.invoicingFlag;
  }

  ValidateFieldLine(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }

  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressLineItem(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowLineItem ? this.SaveLineItem(dataItem) : this.UpdateLineItem(dataItem);
    }
  }
  /// to reach submit button
  handleChangeLineItem(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeLineItem(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressLineItem(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelLineItem(dataItem)
    }
  }
  //#endregion

  //--------------------------Job Status-------------------------------------------------
  //get Dropdown
  getAllStatusType() {
    this.jobtypeService.getAllStatusType().subscribe(result => {
      this.jobStageStatusList = result;
      console.log(result)
    })
  }
  AddStatus() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRowStatus) {
      const newRow: JobTypeStatus = {
        jtypeStageId: 0,
        jobTypeId: 0,
        jobStage: '',
        preferenceOrder: '',
        milestoneFlag: false,
        statusId: 0,
        jobStageStatus: '',
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        IseditStatus: true,
        newStatus: true,
        jtPredefinedStageId: 0,
        jtPredefinedStage: ''
      };
      this.statusName = '';
      this.jobTypeStatuses = [newRow, ...this.jobTypeStatuses];
      this.showAddRowStatus = true;
    }
  }
  onInputChangeSatus(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.jobStageStatusList.some(x => x.jobStageStatus.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.jobStageStatus = '';

    }
  }
  SaveStatus(data: JobTypeStatus) {

    data.statusId = this.jobStageStatusId;
    data.jobStageStatus = this.statusName;
    data.jtPredefinedStageId = this.JTSelectedStage;
    data.jtPredefinedStage = this.predefinedStageControl.value;
    if (data.jobStage == "" || data.jobStageStatus == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    this.jobTypeStatusArray.forEach(x => {
      if (x.jobStage === data.jobStage || x.preferenceOrder === data.preferenceOrder) {
        this.existStatus = true;
      }
    });
    if (this.existStatus) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      data.IseditStatus = true;
      this.showAddRowStatus = true;
      this.existStatus = false;
      return
    }
    else {
      this.jobTypeStatusArray.splice(0, 0, data);
      //this.jobTypeStatusArray.push(data);
      data.IseditStatus = false;
      this.showAddRowStatus = false;
      data.newStatus = false;
    }
    this.SelectStatus = false;
    console.log(this.jobTypeStatusArray)
  }
  UpdateStatus(data: JobTypeStatus) {
    debugger
    if (data.jobStage == "" || data.jobStageStatus == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.updatedBy = parseInt(this.userId$);
    data.statusId = this.jobStageStatusId;
    data.jobStageStatus = this.statusName;
    data.jtPredefinedStageId = this.JTSelectedStage;
    data.jtPredefinedStage = this.predefinedStageControl.value;
    if (this.SelectStatus) {
      data.statusId = this.jobStageStatusId;
      data.jobStageStatus = this.statusName;
    }
    this.jobTypeStatusArray.forEach(x => {
      if (x.jobStage === data.jobStage || x.preferenceOrder === data.preferenceOrder) {
        this.existStatus = true;
      }
    });
    if (this.existStatus) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Already exist",
        showConfirmButton: false,
        timer: 2000,
      });
      data.IseditStatus = true;
      this.showAddRowStatus = true;
      this.existStatus = false;
      return
    }
    else {
      this.jobTypeStatusArray.splice(this.rowIndexforStatus, 0, data);
      data.IseditStatus = false;
      this.showAddRowStatus = false;
    }
  }
  EditStatus(data: JobTypeStatus) {
    debugger
    data.IseditStatus = true;
    this.jobStageStatusId = data.statusId;
    this.statusName = data.jobStageStatus;

    this.JTSelectedStage = data.jtPredefinedStageId 
    this.predefinedStageControl.patchValue(data.jtPredefinedStage);

    const rowIndex = this.jobTypeStatusArray.indexOf(data);
    this.rowIndexforStatus = rowIndex;
    this.editStstus = { ...data };
    this.removeStatus = this.jobTypeStatusArray.splice(rowIndex, 1)
    this.onSelectInvoice = false;
  }
  DeleteStatus(data: JobTypeStatus) {
    debugger
    const rowIndex = this.jobTypeStatuses.indexOf(data);
    this.jobTypeStatusArray.splice(rowIndex, 1);
    this.jobTypeStatuses.splice(rowIndex, 1);
    this.jobTypeStatuses = [...this.jobTypeStatuses];
    data.IseditStatus = false;
    this.showAddRowStatus = false;
  }
  oncancelStatus(data: any) {
    debugger
    const rowIndex = this.jobTypeStatuses.indexOf(data);
    if (data.newStatus) {
      this.jobTypeStatuses.splice(rowIndex, 1);
      //this.jobTypeStatusArray.splice(rowIndex,1);
      this.jobTypeStatuses = [...this.jobTypeStatuses];
      this.showAddRowStatus = false;
      data.newStatus = false;
      return;
    }
    if (data.IseditStatus) {
      this.jobTypeStatuses.splice(rowIndex, 1);
      this.jobTypeStatuses.splice(rowIndex, 0, this.editStstus);
      this.jobTypeStatusArray.splice(rowIndex, 0, this.editStstus);
      this.jobTypeStatuses = [...this.jobTypeStatuses];
      this.showAddRowStatus = false;
      this.editStstus.IseditStatus = false;
      data.newStatus = false;
    }
    // else{
    // this.jobTypeStatuses.splice(rowIndex,0, this.editStstus);
    // this.jobTypeStatusArray.splice(rowIndex,0,this.editStstus);
    // this.jobTypeStatuses = [...this.jobTypeStatuses];
    // this.editStstus.IseditStatus = false;
    // this.showAddRowStatus = false;
    // data.newStatus = false;
    // }
  }
  selectstatusevent(item: any) {
    this.SelectStatus = true;
    this.jobStageStatusId = item.jobStageStatusId;
    this.statusName = item.jobStageStatus;
  }
  ValidateFieldStatus(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
  }

  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPressStatus(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRowStatus ? this.SaveStatus(dataItem) : this.UpdateStatus(dataItem);
    }
  }
  /// to reach submit button
  handleChangeStatus(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChangeStatus(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPressStatus(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancelStatus(dataItem)
    }
  }
  //#endregion

  //--------------------JobDocument ----------------------------------------------

  getDocumentList() {
    this.docmentsService.getDocuments(this.LiveStatus).subscribe(res => {
      this.documents = res;
      console.log(this.documents)
    });
  }
  onInputChange(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.documents.some(x => x.documentName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.documentName = '';

    }
  }
  AddDocument() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    this.isEditDocument = false;
    if (!this.showAddRowDoc) {
      const newRow: JobTypeDocument = {
        jtypeDocumentId: 0,
        jobTypeId: 0,
        documentId: 0,
        mandatory: false,
        createdBy: parseInt(this.userId$),
        createdDate: this.date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.date,
        IseditDoc: true,
        documentName: '',
        documentCode: '',
        remarks: '',
        newDoc: true
      };
      this.documentCode = ''
      this.remarks = '';
      this.jobTypeDocuments = [newRow, ...this.jobTypeDocuments];
      this.showAddRowDoc = true;
    }
  }
  SaveDoc(data: JobTypeDocument) {
    if (data.documentName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.documentName = this.documentName;
    data.documentCode = this.documentCode;
    data.remarks = this.remarks;
    data.documentId = this.documentId;
    this.jobTypeDocArray.forEach(element => {
      if (element.documentName === data.documentName) {
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
      this.jobTypeDocArray.splice(0, 0, data);

      // this.jobTypeDocArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
    this.onSelectDoc = false;
  }

  UpdateDoc(data: JobTypeDocument) {
    debugger
    if (data.documentName == "") {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    data.updatedBy = parseInt(this.userId$);
    data.documentName = this.documentName;
    data.documentCode = this.documentCode;
    data.remarks = this.remarks;
    data.documentId = this.documentId;
    if (this.onSelectDoc) {
      data.documentName = this.documentName;
      data.documentCode = this.documentCode;
      data.remarks = this.remarks;
      data.documentId = this.documentId;
    }
    this.jobTypeDocArray.forEach(element => {
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
      this.jobTypeDocArray.splice(this.rowIndexforDoc, 0, data);
      //this.jobTypeDocArray.push(data);
      this.showAddRowDoc = false;
      data.IseditDoc = false;
      data.newDoc = false;
    }
  }
  EditDoc(data: JobTypeDocument) {
    debugger
    this.isEditDocument = true;
    data.IseditDoc = true;
    this.documentId = data.documentId;
    this.documentCode = data.documentCode;
    this.documentName = data.documentName;
    this.remarks = data.remarks;
    const rowIndex = this.jobTypeDocArray.indexOf(data);
    this.rowIndexforDoc = rowIndex;
    this.editDoc = { ...data };
    this.removeDoc = this.jobTypeDocArray.splice(rowIndex, 1)
    this.onSelectDoc = false;
  }
  Deletedoc(data: JobTypeDocument) {
    
    if (data.mandatory) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "It's a mandatory document. Not able to delete!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const rowIndex = this.jobTypeDocArray.indexOf(data);
    this.jobTypeDocArray.splice(rowIndex, 1);
    this.jobTypeDocuments.splice(rowIndex, 1);
    this.jobTypeDocuments = [...this.jobTypeDocuments];
    data.IseditDoc = false;
    this.showAddRowDoc = false;
  }
  oncancelDoc(data: any) {
    debugger
    const rowIndex = this.jobTypeDocuments.indexOf(data);

    if(data?.documentName !== ""){
      data.IseditDoc = false;
      this.jobTypeDocuments = [...this.jobTypeDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      //this.fileName = '';
      return;
    }

    if (data.newDoc) {
      this.jobTypeDocuments.splice(rowIndex, 1);
      //this.jobTypeDocArray.splice(rowIndex,1);
      this.jobTypeDocuments = [...this.jobTypeDocuments];
      this.showAddRowDoc = false;
      data.newDoc = false;
      return;
    }
    if (data.IseditDoc) {
      this.jobTypeDocuments.splice(rowIndex, 1);
      this.jobTypeDocuments.splice(rowIndex, 0, this.editDoc);
      this.jobTypeDocArray.splice(rowIndex, 0, this.editDoc);
      this.jobTypeDocuments = [...this.jobTypeDocuments];
      this.showAddRowDoc = false;
      this.editDoc.IseditDoc = false;
      data.newDoc = false;
    }
    // else{
    // this.jobTypeDocuments.splice(rowIndex,0, this.editDoc);
    // this.jobTypeDocArray.splice(rowIndex,0,this.editDoc);
    // this.jobTypeDocuments = [...this.jobTypeDocuments];
    // this.editDoc.IseditDoc = false;
    // this.showAddRowDoc = false;
    // data.newDoc = false;
    // }
  }
  selectDocevent(item: any) {
    debugger
    this.onSelectDoc = true;
    this.documentId = item.documentId;
    this.documentCode = item.documentCode;
    this.documentName = item.documentName;
    //this.remarks=item.remarks
  }

  getDocCode(docName:any){
    if(this.documents?.length > 0){
      let document:any = this.documents.find((option:any) => option?.documentName === docName)
      return document?.documentCode;
    }
    return
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

  //-----------------------------terms and condition-------------------------------------


  //New Field Added
  predefinedStageControl= new FormControl('');
  filteredpredefinedStage: Observable<any[]>;
  JTStageList: any[]=[];
  JTSelectedStage: any;

  matFilter() {
    this.filteredpredefinedStage = this.predefinedStageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JTStageList?.filter((option: any) => option?.jtPredefinedStage.toLowerCase().includes(filterValue));
  }

  GetJTPredefinedStage(){
    this.commonService.GetJTPredefinedStage().subscribe((res:any)=>{
      if(res){
        this.JTStageList = res;
      }
      this.matFilter();
    })
  }

  onPredefinedBlur() {
    const inputValue = this.predefinedStageControl.value;
    const isSelectedStageRemoved = !this.JTStageList.some(option => option.jtPredefinedStage === inputValue);

    if (isSelectedStageRemoved) {
      this.JTSelectedStage = null;
    }
  }

  predefinedStage(event:any){
    let selectedName = event?.option?.value;
    let selectedjtPredefinedStageId = this.JTStageList.find((option: any) => option?.jtPredefinedStage == selectedName);
    if(selectedjtPredefinedStageId){
      this.JTSelectedStage = selectedjtPredefinedStageId?.jtPredefinedStageId;
    }
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

}
