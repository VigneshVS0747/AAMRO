import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, startWith, map, BehaviorSubject } from 'rxjs';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import Swal from 'sweetalert2';
import { AddJobOrderComponent } from '../../add-job-order/add-job-order.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, ThemePalette } from '@angular/material/core';
import { JobModeofTransports } from 'src/app/Models/crm/master/Dropdowns';
import { joborderstatus, joborderstauslist } from '../../job-order.modals';
import * as moment from 'moment';
import { NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';


const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'DD/MMM/YYYY HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

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
  selector: 'app-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.css'],
  providers: [
    { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },  
    { provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ListStatusComponent {
  Status: FormGroup;
  userId$: any;
  pageSize = 10;
  skip = 0;
  JOStatusList:any[]=[];
  StatusHistoryPopup:any;

  filteredJobOrderStageControl: Observable<any[]>;
  filteredJobOrderStatusControl: Observable<any[]>;
  myFormGroup: FormGroup;
  JobOrderStageList: any[]=[];
  JobOrderStatusList: any[]=[];
  Modeoftransports:JobModeofTransports[]=[];
  filteredtransOptions$:  Observable<any[]>;
  selectedModeoftransportId: any;
  selectedModeoftransportName: any;
  joborderId: any;
  Hwnumber: any[]=[];
  showAddRowDoc: any;
  JobStatus: any[]=[];
  selectedrefnumberId: any;
  selectedrefnumberName: any;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = true;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  defaultTime = [new Date().getHours(), 0, 0];
  minDate: Date;
  maxDate: Date;
  jobtypeid: any;
  joStageandStatus: any[]=[];
  filteredjobsOptions$: Observable<any[]>;
  selectedjobstagenumberName: any;
  selectedjobstagenumberId: any;
  jobstatus: any;
  jobstausId: any;
  jobstatusArray: any[]=[];
  private jobStagesSubject = new BehaviorSubject<any[]>([]);
  allJobStages: void;
  refStageMapping: { [key: string]: number[] } = {};  // Track selected stages per ref number
  selectedCombinations: any[]=[];
  filteredStages: any[] = [];
  JobStatusExist: any[]=[];
  show: boolean = true;
  lateststage: joborderstatus;
  lateststageId: joborderstatus;
  filteredrefOptions$: Observable<any[]>;
  modeoftransportId: any;

  constructor(private router: Router, private store: Store<{ privileges: { privileges: any } }>, private regionService: RegionService,
    private UserIdstore: Store<{ app: AppState }>,public dialog: MatDialog,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private jobtypeService: JobtypeserviceService, public ListStatusDailog: MatDialogRef<ListStatusComponent>,
  ) { 
    this.myFormGroup = this.fb.group({
      jobOrderStageControl: ['', [Validators.required, this.StageValidator.bind(this)]],
      dateControl: ['', Validators.required],
      jobOrderStatusControl: [
        { value: '', disabled: true }, 
        [Validators.required, this.StatusValidator.bind(this)]
      ],
      remarksControl: ['', [Validators.maxLength(500)]]
    });
   }
  ngOnInit(): void {
    this.InitializeForm();
    this.getList();
    this.GetAllJobStage();
    this.getAllStatusType();
    this.getAllTransPort();
    //this.matFilter();
    console.log(this.data)
    if(this.data?.list){
      this.JOStatusList = this.data?.list;
    }
    this.joborderId=this.data.JOId;
    this.jobtypeid = this.data.jobtypeid;
    this.modeoftransportId = this.data.ModeoftransId;
    this.GetlatestStage();
    this.Jobstage();
    this.GetUserId();
    this.GetallJobstatusList();
    this.Modeelectedoption(this.modeoftransportId); // Fetch or define all stages here
    this.jobStagesSubject.next(this.joStageandStatus);
    this.filteredjobsOptions$ = this.jobStagesSubject.asObservable();
    this.minDate = new Date();
  }

  InitializeForm(){
    this.Status = this.fb.group({
      joStatusId:[null],
      modeofTransportId: [this.modeoftransportId],
      latestStage:{ value: null, disabled: true },  
      jobOrderId:[''],
      refNumberId: ['',Validators.required],
      date: ['',Validators.required],
      jobOrderStageId:['',Validators.required],
      jobOrderStatusId: { value: '', disabled: true },  
      remarks:['']
    });
   }

   GetlatestStage(){
    const payload: joborderstatus = {
      joStatusId: 0,
      jobOrderId: this.joborderId,
      modeofTransportId: this.modeoftransportId,
      refNumberId: 0,
      date: null,
      jobOrderStageId: 0,
      jobOrderStatusId: 0,
      createdBy: 0,
      createdDate: null,
      updatedBy: 0,
      updatedDate: null,
      modeofTransport: null,
      jobStageStatus: null,
      jobStage: null,
      number: null,
      jobTypeId: this.jobtypeid
    };
    this.regionService.JobOrderLatestStage(payload).subscribe(
      (res) => {
        this.lateststageId = res
        
      },
      (error) => {
        console.error('Error fetching job status list:', error);
      }
    );
   }

   GetallJobstatusList() {
    const payload: joborderstatus = {
      joStatusId: 0,
      jobOrderId: this.joborderId,
      modeofTransportId: this.modeoftransportId,
      refNumberId: 0,
      date: null,
      jobOrderStageId: 0,
      jobOrderStatusId: 0,
      createdBy: 0,
      createdDate: null,
      updatedBy: 0,
      updatedDate: null,
      modeofTransport: null,
      jobStageStatus: null,
      jobStage: null,
      number: null,
      jobTypeId: null
    };
  
    this.regionService.JobOrderStatusList(payload).subscribe(
      (res) => {
        this.JobStatus = res;
        this.JobStatus.forEach((status) => {
          const combination = {
            modeofTransportId: status.modeofTransportId,
            refNumberId: status.refNumberId,
            jobOrderStageId: status.jobOrderStageId
          };
  
          // Push the combination into selectedCombinations array
          this.selectedCombinations.push(combination);
        });
        this.GetlatestStage();
  
        console.log("this.JobStatus", this.JobStatus);
        console.log("this.selectedCombinations", this.selectedCombinations);
        console.log("this.JobStatus",this.JobStatus);
      },
      (error) => {
        console.error('Error fetching job status list:', error);
      }
    );
  }
  matFilter(){
    this.filteredJobOrderStageControl = this.myFormGroup.controls['jobOrderStageControl']?.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStageControl(value || '')),
    );
    this.filteredJobOrderStatusControl = this.myFormGroup.controls['jobOrderStatusControl']?.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredJobOrderStatusControl(value || '')),
    );
  }

  private _filteredJobOrderStageControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStageList.filter((option: any) => option?.jobStage.toLowerCase().includes(filterValue));
  }
  private _filteredJobOrderStatusControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList.filter((option: any) => option?.jobStageStatus.toLowerCase().includes(filterValue));
  }

  StageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.JobOrderStageList?.some((option: any) => option?.jobStage === value);
    return isValid ? null : { invalidOption: true };
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
    return isValid ? null : { invalidOption: true };
  }
  

  onchangeEvent(event: any) {
    this.matFilter();
  }

  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getList(){
    this.regionService.GetStatusListByJoId(this.data?.JOId).subscribe((res:any)=>{
      this.JOStatusList = res;
    })
  }

  GetAllJobStage() {
    this.jobtypeService.GetAllJobStage().subscribe((result: any) => {
      this.JobOrderStageList = result;
      this.matFilter();
    });
  }

  getAllStatusType() {
    this.jobtypeService.getAllStatusType().subscribe(result => {
      this.JobOrderStatusList = result;
      this.matFilter();
    });
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  save(){ 
      let payload:joborderstauslist = {
        joborderstatus: this.JobStatus
      }
      this.ListStatusDailog.close(payload)
  }

  close(){
    this.ListStatusDailog.close();
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getStage(value: any) {
    let option = this.JobOrderStageList.find(option => option?.jobStage == value)
    return option?.jobTypeId;
  }
  getStatus(value: any) {
    let option = this.JobOrderStatusList.find(option => option?.jobStageStatus == value)
    return option?.jobStageStatusId;
  }


  getAllTransPort() {
    this.regionService.GetAllJobModeofTransport().subscribe(result => {
      this.Modeoftransports = result;
      this.TransFun();
    });
  }
  TransFun() {
    this.filteredtransOptions$ = this.Status.controls['modeofTransportId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.modeofTransport)),
      map((name: any) => (name ? this.filteredmodeOptions(name) : this.Modeoftransports?.slice()))
    );
  }
  private filteredmodeOptions(name: string): any[] {
    debugger;
    const filterValue = name.toLowerCase();
    const results = this.Modeoftransports.filter((option: any) => option.modeofTransport.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatamode();
  }
  NoDatamode(): any {
    this.Status.controls['modeofTransportId'].setValue('');
    return this.Modeoftransports;
  }
  displayModeListLabelFn(data: any): string {
    return data && data.modeofTransport ? data.modeofTransport : '';
  }
  Modeelectedoption(id: any) {
    debugger;
    this.selectedModeoftransportId = id;
    //this.selectedModeoftransportName = selectedValue.modeofTransport;

    if(this.selectedModeoftransportId==1){
      this.regionService.GetJobOrderById(this.joborderId).subscribe((res: any) => {

        this.Hwnumber = res?.joAirTransport;
        console.log("res?.joAirTransport",res?.joAirTransport)
        if (res?.joAirTransport && Array.isArray(res?.joAirTransport)) {
          this.Hwnumber = res?.joAirTransport.map((item: { joAirModeId: any; hawbNumber: any; }) => ({
            ...item,
            id: item.joAirModeId,
            number: item.hawbNumber
          }));
           this.RefFun();
        } else {
          this.Hwnumber = []; // Fallback in case joSeaTransport is not valid
        }
        console.log("2", this.Hwnumber);
      });
      //this.RefFun();
        
 
    }
    if (this.selectedModeoftransportId == 2) {
      this.regionService.GetJobOrderById(this.joborderId).subscribe((res: any) => {

        console.log("res----------->",res)
        // Ensure joSeaTransport is an array before mapping
        if (res?.joSeaTransport && Array.isArray(res.joSeaTransport)) {
          this.Hwnumber = res.joSeaTransport.map((item: { joSeaModeId: any; hblNumber: any; }) => ({
            ...item,
            id: item.joSeaModeId,
            number: item.hblNumber
          }));
          this.RefFun();
        } else {
          this.Hwnumber = []; // Fallback in case joSeaTransport is not valid
        }
        console.log("2", this.Hwnumber);
      });
      //this.RefFun();
    }
    
    if(this.selectedModeoftransportId==3){
      this.regionService.GetJobOrderById(this.joborderId).subscribe((res: any) => {

        if (res?.joRoadTransport && Array.isArray(res.joRoadTransport)) {
          this.Hwnumber = res.joRoadTransport.map((item: { joRoadModeId: any; trackingNumber: any; }) => ({
            ...item,
            id: item.joRoadModeId,
            number: item.trackingNumber
          }));
          this.RefFun();
        } else {
          this.Hwnumber = []; // Fallback in case joSeaTransport is not valid
        }
      });
      //this.RefFun();
    }
    if(this.selectedModeoftransportId==4){
      this.regionService.GetJobOrderById(this.joborderId).subscribe((res: any) => {

        if (res?.joGeneral) {
          this.Hwnumber = [
            { id: res.joGeneral.jobOrderId, number: res.joGeneral.referenceNumber1 },
          ];
          this.RefFun();
        } else {
          this.Hwnumber = []; // Fallback in case joSeaTransport is not valid
        }
      });
      //this.RefFun();
    }
    //this.GetallJobstatusList();
  }

  //#region Refnumber
  RefFun() {
    this.filteredrefOptions$ = this.Status.controls['refNumberId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.number)),
      map((name: any) => (name ? this.filtereRefOptions(name) : this.Hwnumber?.slice()))
    );
  }
  private filtereRefOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.Hwnumber.filter((option: any) => option.number.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatamode();
  }
  NoDataref(): any {
    this.Status.controls['refNumberId'].setValue('');
    return this.Hwnumber;
  }
  displayRefListLabelFn(data: any): string {
    return data && data.number ? data.number : '';
  }
  Reflectedoption(data: any) {
    let selectedValue = data.option.value;
    this.selectedrefnumberId = selectedValue.id;
    this.selectedrefnumberName = selectedValue.number;
  }


  AddStatus() {
    // let skip = 0
    // let take = this.pageSize
    // this.pageChange({skip:skip,take:take});
    // if(this.Hwnumber.length==1){
    //   this.selectedrefnumberName=this.Hwnumber[0].number
    //   this.selectedrefnumberId = this.Hwnumber[0].id
    // }else{
    //   this.selectedrefnumberName="";
    // }
    console.log("this.Hwnumber",this.Hwnumber);
   
    if (!this.showAddRowDoc) {
      const Value = {
        ...this.Status.value,
        joStatusId:0,
        jobOrderId:"",
        modeofTransportId:this.modeoftransportId,
        refNumberId:"",
        date: null,
        jobOrderStageId:"",
        jobOrderStatusId:"",  
        remarks:"",
        Isedit: true
      }

      let defaultDate = new Date()
      const formattedDate = moment(defaultDate).format('DD/MMM/YYYY HH:mm');
      let date = new Date(formattedDate)
      this.Status.patchValue({
        date: date,
      });

      //this.ImageDataArray.push(Value);
      this.JobStatus = [Value, ...this.JobStatus];
      this.showAddRowDoc = true;
      this.show = true;
    }

    //this.showtable = false;
  }

  Jobstage() {
    this.jobtypeService.getAllJopTypeById(this.jobtypeid).subscribe((res: any) => {
  
      if (res?.jobTypeStatuses?.length != 0) {
        // Sort jobTypeStatuses based on preferenceOrder
        this.joStageandStatus = res?.jobTypeStatuses.sort((a: any, b: any) => {
          return a.preferenceOrder - b.preferenceOrder;
        });
  
        // After sorting, bind the values
        this.jobFun();
      }
      // Patch TM Mod

      var lateststage =this.joStageandStatus.find(id=>id.jtypeStageId==this.lateststageId.jobOrderStageId);
        this.lateststage=lateststage.jobStage
        this.Status.controls["latestStage"].setValue(this.lateststage);
    });
  }
  jobFun() {
    this.filteredjobsOptions$ = this.Status.controls['jobOrderStageId'].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value?.jobStage)),
      map((name: any) => (name ? this.filterejobOptions(name) : this.joStageandStatus?.slice()))
    );
  }
  private filterejobOptions(name: string): any[] {
    const filterValue = name.toLowerCase();
    const results = this.joStageandStatus.filter((option: any) => option.jobStage.toLowerCase().includes(filterValue));
    return results.length ? results : this.NoDatamode();
  }
  Nojobref(): any {
    this.Status.controls['jobOrderStageId'].setValue('');
    return this.joStageandStatus;
  }
  displayjobListLabelFn(data: any): string {
    return data && data.jobStage ? data.jobStage : '';
  }
  joblectedoption(data: any) {
    console.log("dardataa",data)
    let selectedValue = data.option.value;
    this.selectedjobstagenumberId = selectedValue.jtypeStageId;
    this.selectedjobstagenumberName = selectedValue.jobStage;

    var jobstatus = this.joStageandStatus.find(id=>id.jtypeStageId==this.selectedjobstagenumberId);
    var status = this.JobOrderStatusList.find(id=>id.jobStageStatusId == jobstatus.statusId);
    this.jobstausId=jobstatus.statusId;
    this.jobstatus=status?.jobStageStatus;
    this.Status.get('jobOrderStatusId')?.patchValue(status?.jobStageStatus);


    const selectedStatus = this.modeoftransportId;
    const selectedRef = this.Status.get('refNumberId')?.value;
    const selectedStage = this.Status.get('jobOrderStageId')?.value;

  // Add selected combination to the list
  this.selectedCombinations.push({
    modeofTransportId: selectedStatus,
    refNumberId: selectedRef.id,
    jobOrderStageId: selectedStage.jtypeStageId
  });

  // Re-filter stages
  this.filterStages();
  }
  filterStages() {
    const selectedStatusId = this.modeoftransportId;
    const selectedRefId = this.Status.get('refNumberId')?.value.id;

    // Get the next stage based on the current selections
    const nextStage = this.joStageandStatus.find(stage => 
        !this.selectedCombinations.some(combo =>
            combo.modeofTransportId === selectedStatusId &&
            combo.refNumberId === selectedRefId &&
            combo.jobOrderStageId === stage.jtypeStageId
        )
    );

    // Filter stages to include only the next stage and exclude already selected stages
    this.filteredStages = this.joStageandStatus.filter(stage => {
        return stage.jtypeStageId === nextStage?.jtypeStageId;
    });
}

isStageDisabled(stageId: number): boolean {
  const selectedStatusId = this.modeoftransportId;
  const selectedRefId  = this.selectedrefnumberId;

  // Disable all stages except the next available stage
  const nextStage = this.joStageandStatus.find(stage =>
      !this.selectedCombinations.some(combo =>
          combo.modeofTransportId === selectedStatusId &&
          combo.refNumberId === selectedRefId &&
          combo.jobOrderStageId === stage.jtypeStageId
      )
  );

  return stageId !== nextStage?.jtypeStageId;
}

  saveRow(rowIndex: any) {
    if (this.Status.valid) {
      const selectedRefNumber = this.selectedrefnumberId;
      const selectedStageId = this.selectedjobstagenumberId;
  
      // Track the selected stage for the current reference number
      if (!this.refStageMapping[selectedRefNumber]) {
        this.refStageMapping[selectedRefNumber] = [];
      }
      this.refStageMapping[selectedRefNumber].push(parseInt(selectedStageId, 10));
  
      // Update the row data with form values and additional properties
      const updatedValue = {
        ...this.Status.value,
        jobOrderId:this.joborderId,
        jobTypeId:this.jobtypeid,
        number: this.selectedrefnumberName,
        jobStage: this.selectedjobstagenumberName,
        jobStageStatus: this.jobstatus,
        modeofTransportId: this.modeoftransportId,
        refNumberId: this.selectedrefnumberId,
        jobOrderStageId: this.selectedjobstagenumberId,
        jobOrderStatusId: this.jobstausId,
        createdBy:1,
        updatedBy:1,
        Isedit: false
      };
  
      // Update the row in JobStatus
      this.JobStatus[rowIndex] = updatedValue;
      this.JobStatus = [...this.JobStatus];
      this.GetlatestStage();
//       this.JobStatusExist = this.JobStatus.filter(status => status.number === 'H-01');
//       console.log("  this.JobStatusExist", this.JobStatusExist);
//       // Find the maximum value of JobOrderStageId in JobStatusExist
// const maxJobOrderStageId = this.JobStatusExist.reduce((max, current) => 
//   current.jobOrderStageId > max ? current.jobOrderStageId : max, 
//   this.JobStatusExist[0].jobOrderStageId
// );

 console.log("maxJobOrderStageId",this.JobStatus);  // This will print the maximum JobOrderStageId
  
      // Reset the form after saving
      this.Status.controls["refNumberId"].reset();
      this.Status.controls["date"].reset();
      this.Status.controls["jobOrderStageId"].reset();
      this.Status.controls["jobOrderStatusId"].reset();
      this.Status.controls["remarks"].reset();
      this.showAddRowDoc = false;
      this.show=false;
    } else {
      // Mark form as touched for validation
      this.Status.markAllAsTouched();
      this.validateall(this.Status);
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

  Download() {

  }

  editRow(dataItem:any, rowIndex:any) {

    this.JobStatus.forEach((row, index) => {
      row.Isedit = false;
    });
    // Enable edit mode for the selected row
    this.JobStatus[rowIndex].Isedit = true;
    this.selectedModeoftransportId=dataItem.modeofTransportId,
    this.selectedrefnumberId =dataItem.refNumberId,
    this.selectedrefnumberName =dataItem.number,
    this.selectedjobstagenumberName = dataItem.jobStage,
    this.jobstatus = dataItem.jobStageStatus,
    this.selectedjobstagenumberId = dataItem.jobOrderStageId,
    this.jobstausId = dataItem.jobOrderStatusId,
   
    // Populate the form with the current row's data
    this.Status.patchValue({
      refNumberId: dataItem,
      date: dataItem.date,
      jobOrderStageId: dataItem,
      jobOrderStatusId: dataItem.jobStageStatus,
      remarks: dataItem.remarks,
    });
  }

  cancelEdit(dataItem:any,rowIndex:any) {
    if(dataItem.refNumberId!=""){
      this.JobStatus[rowIndex].Isedit = false;
      
       this.Status.controls["refNumberId"].reset();
       this.Status.controls["date"].reset();
       this.Status.controls["jobOrderStageId"].reset();
       this.Status.controls["jobOrderStatusId"].reset();
       this.Status.controls["remarks"].reset();
       this.InitializeForm();
      this.showAddRowDoc = false;
      this.show = true;
    }else{
      this.JobStatus.splice(rowIndex, 1);
      this.Status.controls["refNumberId"].reset();
      this.Status.controls["date"].reset();
      this.Status.controls["jobOrderStageId"].reset();
      this.Status.controls["jobOrderStatusId"].reset();
      this.Status.controls["remarks"].reset();
      this.JobStatus = [...this.JobStatus];
      this.showAddRowDoc = false;
      this.show = true;
    }
   
  }

  deleteRow(rowIndex: number,id:number,refid:number) {
    debugger;
    const combinationIndex = this.selectedCombinations.findIndex(
      (combination) => combination.jobOrderStageId === id &&
      combination.refNumberId === refid
  );
   // Check if the row being deleted is the last one in the JobStatus array
   if (rowIndex === 0) {
    // Find the index of the item in selectedCombinations with matching jobOrderStageId and refNumberId
  

    // If a matching combination is found, remove it from selectedCombinations
    if (combinationIndex !== -1) {
        this.selectedCombinations.splice(combinationIndex, 1);
    }

    // Remove the row from JobStatus array
    this.JobStatus.splice(rowIndex, 1);

    // Trigger change detection
    this.JobStatus = [...this.JobStatus];
    this.show = false;
} else {
    // Optionally, you can display a message or alert to the user
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "You should delete the last stage only!!",
      showConfirmButton: false,
      timer: 2000,
    });
}
  }

 
  // getFilteredStages(refNumberId: string): any[] {
  //   const selectedStages = this.refStageMapping[refNumberId] || [];
  
  //   return this.joStageandStatus.map((stage, index) => {
  //     const isDisabled = selectedStages.includes(stage.jtypeStageId);
      
  //     // Automatically select the first unselected stage if this is a new selection
  //     if (selectedStages.length === 0 && index === 0 && !isDisabled) {
  //       this.Status.patchValue({
  //         jobOrderStageId: stage.id
  //       });
  //       this.selectedjobstagenumberId = stage.jtypeStageId;
  //       this.selectedjobstagenumberName = stage.jobStage;
  //     }
  
  //     return {
  //       ...stage,
  //       disabled: isDisabled
  //     };
  //   });
  // }
  getNextAvailableStage(): number | null {
    const selectedStatusId = this.Status.get('modeofTransportId')?.value.modeofTransportId;
    const selectedRefId = this.selectedrefnumberId;
    
    // Assuming jobStages is sorted and the next available stage is the one immediately following the last selected stage
    const selectedStages = this.selectedCombinations
      .filter(combo => combo.modeofTransportId === selectedStatusId && combo.refNumberId === selectedRefId)
      .map(combo => combo.jobOrderStageId);
  
    if (selectedStages.length === 0) {
      // If no stages are selected yet, return the first stage or null if none available
      return this.joStageandStatus.length > 0 ? this.joStageandStatus[0].id : null;
    }
    
    // Find the next stage to show
    const lastSelectedStageId = Math.max(...selectedStages);
    const nextStage = this.joStageandStatus.find(stage => stage.jtypeStageId > lastSelectedStageId);
    
    return nextStage ? nextStage.id : null;
  }

}

