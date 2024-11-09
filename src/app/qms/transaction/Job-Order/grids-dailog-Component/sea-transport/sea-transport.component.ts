import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { LineitemmasterService } from 'src/app/crm/master/LineItemMaster/line-item-master/lineitemmaster.service';
import { RegionService } from 'src/app/services/qms/region.service';
import { AddVendorContractInfoComponent } from '../../../vendor-contract/add-vendor-contract-info/add-vendor-contract-info.component';
import { LineitemService } from '../../../../../crm/master/lineitemcategory/lineitem.service';
import { CommonService } from 'src/app/services/common.service';
import { ContainerTypeService } from 'src/app/crm/master/containertype/containertype.service';
import { JobtypeserviceService } from 'src/app/crm/master/jobtype/jobtypeservice.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { JOSeaModeModal } from '../../job-order.modals';
import Swal from 'sweetalert2';
import { DateValidatorService } from 'src/app/qms/date-validator';


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
  selector: 'app-sea-transport',
  templateUrl: './sea-transport.component.html',
  styleUrls: ['./sea-transport.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SeaTransportComponent {

  filteredshipmentTypeControl: Observable<any[]>;
  filteredcontainerTypeControl: Observable<any[]>;
  filteredStage: Observable<any[]>;
  filteredStatus: Observable<any[]>;

  JobOrderStageList: any[] = [];
  JobOrderStatusList: any[] = [];
  Livestatus = 1;
  TaxType: any[] = [];
  shipmentList: any[]=[];
  containerList: any[]=[];
  SeaTransport:JOSeaModeModal = new JOSeaModeModal();
  jobstage: any;
  jobstatus: any;

  constructor(private LineitemService: LineitemService, private service: LineitemmasterService, private regionService: RegionService,
    @Inject(MAT_DIALOG_DATA) public data: any, public seaTransportDailog: MatDialogRef<AddVendorContractInfoComponent>,
    private commonService: CommonService,private containerTypeService: ContainerTypeService,private jobtypeService: JobtypeserviceService,
  ) { }

  ngOnInit(): void {
    this.getAllShipmentTypes();
    this.getAllContainer();
    this.GetAllJobStage();
    this.getAllStatusType();
    this.matFilter();
    console.log(this.data);
    this.jobstage=this.data.stage;
    this.jobstatus=this.data.status;
     this.SeaTransportForm.get('stageControl')?.disable();
     this.SeaTransportForm.get('statusControl')?.disable();
     this.SeaTransportForm.get('stageControl')?.patchValue(this.jobstage);
     this.SeaTransportForm.get('statusControl')?.patchValue(this.jobstatus);

    if (this.data?.list) {
      if (this.data && this.data.list) {
        this.data.list["rowNumber"] = this.data.rowNumber;
      }
      if (this.data?.view) {
        this.SeaTransportForm.disable();
      }

      this.SeaTransportForm.patchValue({
        HBLNumberControl: this.data?.list?.hblNumber,
        shipmentTypeControl: this.data?.list?.shipmentType,
        containerTypeControl: this.data?.list?.containerTypeName,
        containerNumberControl: this.data?.list?.containerNumber,
        shipperControl: this.data?.list?.shipper,
        consigneeControl: this.data?.list?.consignee,
        notifyPartyControl: this.data?.list?.notifyparty,
        vesselNameControl: this.data?.list?.vesselName,
        sealNumberControl: this.data?.list?.sealNumber,
        voyageNumberControl: this.data?.list?.voyageNumber,
        ETDControl: this.data?.list?.etd,
        ETAControl: this.data?.list?.eta,
        stageControl: this.data?.list?.jobStage,
        statusControl: this.data?.list?.jobStageStatus
      }); 

      this.getShipmentEvent(this.data?.list?.shipmentType);
    }
  }

  SeaTransportForm = new FormGroup({
    HBLNumberControl: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    shipmentTypeControl: new FormControl('', [Validators.required, this.ShipmentTypeValidator.bind(this)]),
    containerTypeControl: new FormControl('', [this.ContainerTypeValidator.bind(this)]),
    containerNumberControl: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    shipperControl: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    consigneeControl: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    notifyPartyControl: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    vesselNameControl: new FormControl('', [Validators.maxLength(100)]),
    sealNumberControl: new FormControl('', [Validators.maxLength(25)]),
    voyageNumberControl: new FormControl('', [Validators.maxLength(25)]),
    ETDControl: new FormControl(''),
    ETAControl: new FormControl(''),
    // stageControl: new FormControl('', [Validators.required, this.StageValidator.bind(this)]),
    // statusControl: new FormControl('', [Validators.required, this.StatusValidator.bind(this)]),
    stageControl: new FormControl('', [ this.StageValidator.bind(this)]),
    statusControl: new FormControl('', [ this.StatusValidator.bind(this)]),
  },{
    validators: DateValidatorService.dateRangeValidator('ETDControl', 'ETAControl')
  })

  get f() {
    return this.SeaTransportForm.controls;
  }

  ShipmentTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.shipmentList?.some((option: any) => option?.shipmentType === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  ContainerTypeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.containerList?.some((option: any) => option?.containerTypeName === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }
  StageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.JobOrderStageList?.some((option: any) => option?.jobStage === value);
      return isValid ? null : { invalidOption: true }; 
    }
    return null;
  }
  StatusValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isTouched = control.touched || control.dirty;
    if(isTouched && value !== '' && value !== null){
      var isValid = this.JobOrderStatusList?.some((option: any) => option?.jobStageStatus === value);
      return isValid ? null : { invalidOption: true };
    }
    return null;
  }

  matFilter() {
    this.filteredshipmentTypeControl = this.SeaTransportForm.controls.shipmentTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredshipmentTypeControl(value || '')),
    );
    this.filteredcontainerTypeControl = this.SeaTransportForm.controls.containerTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredcontainerTypeControl(value || '')),
    );
    this.filteredStage = this.SeaTransportForm.controls.stageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStage(value || '')),
    );
    this.filteredStatus = this.SeaTransportForm.controls.statusControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filteredStatus(value || '')),
    );

  }
  private _filteredshipmentTypeControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.shipmentList?.filter((option: any) => option?.shipmentType.toLowerCase().includes(filterValue));
  }
  private _filteredcontainerTypeControl(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.containerList?.filter((option: any) => option?.containerTypeName.toLowerCase().includes(filterValue));
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
    Object.keys(this.SeaTransportForm.controls).forEach(field => {
      const control = this.SeaTransportForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else {
        console.log(`Control not found: ${field}`);
      }
    });
  }

  
  getAllShipmentTypes() {
    this.commonService.GetAllShipmentTypes().subscribe(res => {
      this.shipmentList = res;
      this.matFilter();
    });
  }
  getAllContainer() {
    this.containerTypeService.getAllActiveContainerType().subscribe(res => {
      this.containerList = res;
      this.matFilter();
    });
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
 
  getLineItem(event: any) {
    this.matFilter();
  }
  getLineItemId(event: any) {
    this.matFilter();
  }

  getShipmentEvent(event:any){
    let value = event?.option?.value ? event?.option?.value : event;
    if(value === 'FCL'){
      this.SeaTransportForm.controls.containerTypeControl.setValidators([Validators.required, this.ContainerTypeValidator.bind(this)]);
    } else{
      this.SeaTransportForm.controls.containerTypeControl.clearValidators();
    }
    this.SeaTransportForm.controls.containerTypeControl.updateValueAndValidity();
    this.matFilter();
  }

  save() {
    this.triggerValidation();
    console.log(this.data)
    if (this.SeaTransportForm.invalid) {
      this.SeaTransportForm.markAllAsTouched();
    } else {

      this.SeaTransport.joSeaModeId = this.data?.list?.joSeaModeId ? this.data.list?.joSeaModeId : 0,
      this.SeaTransport.jobOrderId = this.data?.jobOrderId ? this.data?.jobOrderId : 0,
      this.SeaTransport.hblNumber = this.SeaTransportForm.controls.HBLNumberControl.value || '',
      this.SeaTransport.shipmentTypeId = this.getShipmentType(this.SeaTransportForm.controls.shipmentTypeControl.value) || 0,
      this.SeaTransport.containerTypeId = this.getContainerTypeId(this.SeaTransportForm.controls.containerTypeControl.value) || 0,
      this.SeaTransport.containerNumber = this.SeaTransportForm.controls.containerNumberControl.value || '',
      this.SeaTransport.shipmentType = this.SeaTransportForm.controls.shipmentTypeControl.value || '',
      this.SeaTransport.containerTypeName = this.SeaTransportForm.controls.containerTypeControl.value || '',
      this.SeaTransport.shipper = this.SeaTransportForm.controls.shipperControl.value || '',
      this.SeaTransport.consignee = this.SeaTransportForm.controls.consigneeControl.value || '',
      this.SeaTransport.notifyparty = this.SeaTransportForm.controls.notifyPartyControl.value || '',
      this.SeaTransport.vesselName = this.SeaTransportForm.controls.vesselNameControl.value || '',
      this.SeaTransport.sealNumber = this.SeaTransportForm.controls.sealNumberControl.value || '',
      this.SeaTransport.sealNumber = this.SeaTransportForm.controls.sealNumberControl.value || '',
      this.SeaTransport.voyageNumber = this.SeaTransportForm.controls.voyageNumberControl.value || '',
      this.SeaTransport.etd = this.normalizeDateToUTC(this.SeaTransportForm.controls.ETDControl.value) || null ,
      this.SeaTransport.eta = this.normalizeDateToUTC(this.SeaTransportForm.controls.ETAControl.value) || null ,
      this.SeaTransport.stageId = this.getStage(this.SeaTransportForm.controls.stageControl.value) || null ,
      this.SeaTransport.statusId = this.getStatus(this.SeaTransportForm.controls.statusControl.value) || null ,
      this.SeaTransport.jobStage = this.SeaTransportForm.controls.stageControl.value || null ,
      this.SeaTransport.jobStageStatus = this.SeaTransportForm.controls.statusControl.value || null ,
      this.SeaTransport.createdBy = this.data?.createdBy,
      this.SeaTransport.createdDate= this.data?.list?.createdDate,
      this.SeaTransport.updatedBy = this.data?.createdBy,
      this.SeaTransport.updatedDate = this.normalizeDateToUTC(new Date())
      this.SeaTransport.rowNumber = this.data?.rowNumber,
      this.SeaTransport.joSeaStatusHistoryModal = this.data?.list?.joSeaStatusHistoryModal

      if (this.data?.overAllList?.length !== 0) {
        const isDuplicate = this.data?.overAllList?.some(
          (item: any) => item.hblNumber === this.SeaTransport.hblNumber && item?.rowNumber !== this.SeaTransport.rowNumber
        );

        if (isDuplicate) {
          Swal.fire({
            icon: 'info',
            title: 'Duplicate',
            text: 'Duplicate entry detected for HBL Number',
            showConfirmButton: true,
          });
          this.SeaTransportForm.controls.HBLNumberControl.reset();
          return;
        } else {
          this.seaTransportDailog.close(this.SeaTransport);
        }
      } else {
        this.seaTransportDailog.close(this.SeaTransport);
      }
    }
  }

  Close() {
    this.seaTransportDailog.close()
  }

  normalizeDateToUTC(date: any): any {
    if (!date) return null;
    const parsedDate = new Date(date);
    const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    return utcDate.toISOString().substring(0, 10);
  }

  getShipmentType(value: any) {
    let option = this.shipmentList.find(option => option?.shipmentType == value)
    return option?.shipmentTypeId;
  }
  getContainerTypeId(value: any) {
    let option = this.containerList.find(option => option?.containerTypeName == value)
    return option?.containerTypeId;
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

