import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { textboxHiddenIcon } from '@progress/kendo-svg-icons';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { StoragetypeService } from '../storagetype.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-storagetype',
  templateUrl: './storagetype.component.html',
  styleUrls: ['./storagetype.component.css','../../../../ums/ums.styles.css']
})
export class StoragetypeComponent implements OnInit {
  Storage!: FormGroup;
  Date = new Date();
  titile: string;
  disablefields: boolean = false;
  showbutton: boolean;
  ShowUpdate: boolean;
  Showsave: boolean;
  ShowReset: boolean;
  userId$: string;
  constructor(private FB: FormBuilder,
    private service:StoragetypeService,
    private ErrorHandling:ErrorhandlingService,
    private commonService: CommonService,
    private router: Router, 
    private route: ActivatedRoute,
    private UserIdstore: Store<{ app: AppState }>,
    private errorHandler: ApiErrorHandlerService
){}

  ngOnInit(): void {
    this.GetUserId();
    this.titile = "New Storage Type";
    this.ShowUpdate = false;
    this.Showsave = true;
    this.ShowReset = true;
   this.InItializeForms();
   this.EditMode();
   this.ViewMode();
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  
   InItializeForms(){
    this.Storage = this.FB.group({
      storageTypeId: [0],
      storageTypeCode: ["", [Validators.required]],
      storageTypeName: ["", Validators.required],
      storageDescription: [null],
      mintemperature: [null],
      maxtemperature: [null],
      livestatus: [true, Validators.required],
      createdBy: [parseInt(this.userId$), Validators.required],
      createdDate: [this.Date, Validators.required],
      updatedBy: [parseInt(this.userId$), Validators.required],
      updatedDate:[this.Date, Validators.required],
    });
  }

  EditMode(){
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/storagetype/edit/" + this.route.snapshot.params["id"]) {
      this.titile = "Update Storage Type";
      this.disablefields = false;
      this.ShowUpdate = true;
      this.Showsave = false;
      this.ShowReset = true;
     
      this.service
        .GetAllStorageMasterById(this.route.snapshot.params["id"])
        .subscribe((result) => {
          console.log("result", result);
          this.Storage.patchValue({
            storageTypeId: result.storageTypeId,
            storageTypeCode: result.storageTypeCode,
            storageTypeName: result.storageTypeName,
            storageDescription:result.storageDescription,
            mintemperature:result.mintemperature,
            maxtemperature:result.maxtemperature,
            livestatus: result.livestatus,
            createdBy:result.createdBy,
            createdDate:result.createdDate,
            updatedBy:parseInt(this.userId$),
            updatedDate:this.Date
          });
        });
    }
  }

  ViewMode(){
    var Path2 = this.router.url;
    if (Path2 == "/crm/master/storagetype/view/" + this.route.snapshot.params["id"]) {
      this.titile = "View Storage Type";
      this.disablefields = true;
      this.ShowUpdate = false;
      this.Showsave = false;
      this.ShowReset = false;
      this.service
        .GetAllStorageMasterById(this.route.snapshot.params["id"])
        .subscribe((result) => {
          console.log("result", result);
          this.Storage.patchValue({
            storageTypeId: result.storageTypeId,
            storageTypeCode: result.storageTypeCode,
            storageTypeName: result.storageTypeName,
            storageDescription:result.storageDescription,
            mintemperature:result.mintemperature,
            maxtemperature:result.maxtemperature,
            livestatus: result.livestatus,
            createdBy:result.createdBy,
            createdDate:result.createdDate,
            updatedBy:result.updatedBy,
            updatedDate:this.Date
          });
        });
    }
  }


  Savedata(){
    if (this.Storage.valid) {
      this.service
      .CreateStorageMaster(this.Storage.value).subscribe({
        next: (res) => {
          this.commonService.displayToaster(
            "success",
            "Success",
             res.message
          );
          this.Storage.reset();
          this.PageNavigation();
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

    }else{
      this.Storage.markAllAsTouched();
      this.validateall(this.Storage);
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

  Update(){
   this.Savedata();
  }

  reset(){
    this.Storage.reset();
    this.InItializeForms();
    var Path1 = this.router.url;
    if (Path1 == "/crm/master/storagetype/edit/" + this.route.snapshot.params["id"]) {
      this.EditMode();
    }
  }

  PageNavigation() { 
    this.router.navigate(["/crm/master/storagetypelist"]);
}
}
