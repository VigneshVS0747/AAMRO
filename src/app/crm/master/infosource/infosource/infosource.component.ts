import { Component, ElementRef, ViewChild } from '@angular/core';
import { InfosourceService } from '../infosource.service';
import Swal from 'sweetalert2';
import { Infosource } from 'src/app/Models/crm/master/Infosource';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-infosource',
  templateUrl: './infosource.component.html',
  styleUrls: ['./infosource.component.css']
})
export class InfosourceComponent {
  showAddRow: boolean;
  Date = new Date();
  infosrc: Infosource[] = [];
  ShowError = false
  pagePrivilege: Array<string>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  livesatus = 0;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;

  constructor(private infosrcSvc: InfosourceService,
    private commonService: CommonService,
    private ErrorHandling: ErrorhandlingService,
    private UserIdstore: Store<{ app: AppState }>,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService
  ) { }
  ngOnInit(): void {
    this.GetUserId();
    this.getlist();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }

  getlist() {
    this.infosrcSvc.getInfosource(this.livesatus).subscribe(result => {
      this.infosrc = result;
    })
  }
  ValidateField(item: any) {
    return item !== '' ? false : true
    // if (item !== '') {
    //   return false;
    // } else {
    //   return true;
    // }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRow) {
      const newRow: Infosource = {
        informationSourceId: 0,
        informationSourceCode: '',
        informationSourceName: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true
      };
      this.infosrc = [newRow, ...this.infosrc];
      this.showAddRow = true;
    }
  }
  Save(obj: Infosource) {
    if (obj.informationSourceCode != '' && obj.informationSourceName != '') {
      this.infosrcSvc.addInfosource(obj).subscribe({
        next: (response) => {
          this.commonService.displayToaster(
            "success",
            "Success",
            "Added Sucessfully"
          );
          this.getlist();
          this.showAddRow = false;
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
      return false;
    } else {
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }
  }

  Update(obj: Infosource) {
    if (obj.informationSourceCode != '' && obj.informationSourceName != '') {
      obj.updatedBy = parseInt(this.userId$);
      this.infosrcSvc.updateInfosource(obj).subscribe({
        next: (response) => {
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated Sucessfully"
          );
          this.getlist();
          this.showAddRow = false;
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
      return false;
    } else {
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }
  }

  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the information source!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.infosrcSvc.deleteInfosource(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Information Source you are trying to delete is already in use. Do you want to in-active this information source ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.infosrcSvc.isActiveInfosource(id).subscribe((res) => {
                    if (res.message === "SUCCESS") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire(
                        "Success",
                        "Information source has been in-activated sucessfully",
                        "success"
                      );
                    } else if (res.message === "In-Active") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire("Info", "Information source is already in-active !", "info");
                    }
                  });
                }
              });
              return throwError(error); // Re-throw the error to propagate it to the subscriber
            })
          )
          .subscribe((res) => {
            this.getlist();
            this.showAddRow = false;
            Swal.fire(
              'Deleted!',
              'Information source has been deleted',
              'success'
            )
          });
      }
    })
  }

  Edit(obj: Infosource) {
    this.infosrc.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }
  oncancel(obj: Infosource) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }
  //#region Keyboard tab operation
  /// to provoke save or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === 'Tab') {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancel(dataItem)
    }
  }
  //#endregion
}
