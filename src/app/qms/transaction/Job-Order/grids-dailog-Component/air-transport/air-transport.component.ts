import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { DateValidatorService, decimalValidator } from 'src/app/qms/date-validator';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddVendorContractInfoComponent } from '../../../vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { LineitemService } from '../../../../../crm/master/lineitemcategory/lineitem.service';
import { JOAirModeModal } from '../../job-order.modals';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'app-air-transport',
  templateUrl: './air-transport.component.html',
  styleUrls: ['./air-transport.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AirTransportComponent {

  filteredStage: Observable<any[]>;
  filteredStatus: Observable<any[]>;

  JobOrderStageList: any[] = [];
  JobOrderStatusList: any[] = [];
  Livestatus = 1;

  AirTransport:JOAirModeModal = new JOAirModeModal();
  jobstage: any;
  jobstatus: any;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public airTransportDailog: MatDialogRef<AirTransportComponent>,
    private jobtypeService: JobtypeserviceService,
  ) { }

  ngOnInit(): void {
    this.GetAllJobStage();
    this.getAllStatusType();
    this.matFilter();
    console.log(this.data)

       this.jobstage=this.data.stage;
       this.jobstatus=this.data.status;
        this.AirTransportForm.get('stageControl')?.disable();
        this.AirTransportForm.get('statusControl')?.disable();
        this.AirTransportForm.get('stageControl')?.patchValue(this.jobstage);
        this.AirTransportForm.get('statusControl')?.patchValue(this.jobstatus);

    if (this.data?.list) {
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.rowNumber;
      }
      if (this.data?.view) {
        this.AirTransportForm.disable();
      }

      this.AirTransportForm.patchValue({
        HAWBNumberControl: this.data?.list.hawbNumber,
        shipperControl: this.data?.list.shipper,
        consigneeControl: this.data?.list.consignee,
        notifyPartyControl: this.data?.list.notifyparty,
        ETDControl: this.data?.list.etd ,
        ETAControl: this.data?.list.eta ,
        stageControl: this.data?.list.jobStage,
        statusControl: this.data?.list.jobStageStatus,
      });



    }
  }

  AirTransportForm = new FormGroup({
    HAWBNumberControl: new FormControl('', [Validators.required,Validators.maxLength(25)]),
    shipperControl: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    consigneeControl: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    notifyPartyControl: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    ETDControl: new FormControl(''),
    ETAControl: new FormControl(''),
    stageControl: new FormControl('', [ this.StageValidator.bind(this)]),
    statusControl: new FormControl('', [ this.StatusValidator.bind(this)]),
    // stageControl: new FormControl({value:'',disabled:true}, [ this.StageValidator.bind(this)]),
    // statusControl: new FormControl({value:'',disabled:true}, [ this.StatusValidator.bind(this)]),
  },{
    validators: DateValidatorService.dateRangeValidator('ETDControl', 'ETAControl')
  }
)

  get f() {
    return this.AirTransportForm.controls;
  }

  StageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.JobOrderStageList?.some((option: any) => option?.jobStage === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
      return isValid ? null : { invalidOption: true };
    }
    return null
  }
  
  matFilter() {
    this.filteredStage = this.AirTransportForm.controls.stageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStage(value || '')),
    );
    this.filteredStatus = this.AirTransportForm.controls.statusControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStatus(value || '')),
    );

  }
  private _filteredStage(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStageList?.filter((option: any) => option?.jobStage.toLowerCase().includes(filterValue));
  }
  private _filteredStatus(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.JobOrderStatusList?.filter((option: any) => option?.jobStageStatus.toLowerCase().includes(filterValue));
  }


  triggerValidation() {
    Object.keys(this.AirTransportForm.controls).forEach(field => {
      const control = this.AirTransportForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }


  getLineItem(event: any) {
    this.matFilter();
  }
  getLineItemId(event: any) {
    this.matFilter();
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
 
  

  save() {
    this.triggerValidation();
    console.log(this.data)
    if (this.AirTransportForm.invalid) {
      this.AirTransportForm.markAllAsTouched();
    } else {
      this.AirTransport.joAirModeId = +this.data?.list?.joAirModeId ? +this.data.list?.joAirModeId : 0,
      this.AirTransport.jobOrderId = +this.data?.jobOrderId ? +this.data?.jobOrderId : 0,
      this.AirTransport.hawbNumber = this.AirTransportForm.controls.HAWBNumberControl.value || null ,
      this.AirTransport.shipper = this.AirTransportForm.controls.shipperControl.value || null ,
      this.AirTransport.consignee = this.AirTransportForm.controls.consigneeControl.value || null ,
      this.AirTransport.notifyparty = this.AirTransportForm.controls.notifyPartyControl.value || null ,
      this.AirTransport.etd = this.normalizeDateToUTC(this.AirTransportForm.controls.ETDControl.value) || null ,
      this.AirTransport.eta = this.normalizeDateToUTC(this.AirTransportForm.controls.ETAControl.value) || null ,
      this.AirTransport.stageId = this.getStage(this.AirTransportForm.controls.stageControl.value) || null ,
      this.AirTransport.statusId = this.getStatus(this.AirTransportForm.controls.statusControl.value) || null ,
      this.AirTransport.jobStage = this.AirTransportForm.controls.stageControl.value || null ,
      this.AirTransport.jobStageStatus = this.AirTransportForm.controls.statusControl.value || null ,
      this.AirTransport.createdBy = this.data?.createdBy,
      this.AirTransport.createdDate= this.data?.list?.createdDate,
      this.AirTransport.updatedBy = this.data?.createdBy,
      this.AirTransport.updatedDate = this.normalizeDateToUTC(new Date())
      this.AirTransport.rowNumber = this.data?.rowNumber,
      this.AirTransport.joAirStatusHistoryModal = this.data?.list?.joAirStatusHistoryModal


      if (this.data?.overAllList?.length !== 0) {
        const isDuplicate = this.data?.overAllList?.some(
          (item: any) => item.hawbNumber === this.AirTransport.hawbNumber && item?.rowNumber !== this.AirTransport.rowNumber
        );

        if (isDuplicate) {
          Swal.fire({
            icon: 'info',
            title: 'Duplicate',
            text: 'Duplicate entry detected for HAWB Number',
            showConfirmButton: true,
          });
          this.AirTransportForm.controls.HAWBNumberControl.reset();
          return;
        } else {
          this.airTransportDailog.close(this.AirTransport);
        }
      } else {
        this.airTransportDailog.close(this.AirTransport);
      }
    }
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  Close() {
    this.airTransportDailog.close()
  }


  getStage(value: any) {
    let option = this.JobOrderStageList.find(option => option?.jobStage == value)
    return option?.jtypeStageId;
  }
  getStatus(value: any) {
    let option = this.JobOrderStatusList.find(option => option?.jobStageStatus == value)
    return option?.jobStageStatusId;
  }

}
