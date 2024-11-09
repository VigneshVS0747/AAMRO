import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { IncoTermService } from '../incoterm.service';
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Incoterm } from 'src/app/Models/crm/master/IncoTerm';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
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
  selector: 'app-incoterms',
  templateUrl: './incoterms.component.html',
  styleUrls: ['./incoterms.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class IncotermsComponent {
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  incoterms: Incoterm[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  date: any;
  isInvalidDate: boolean = false;

  calendar: boolean = false;
  selectedDate = new FormControl(new Date());
  //maxDate: Date;
  maxDate: Date;
  userId$: string;
  livestaus=0;
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  constructor(
    private incoService: IncoTermService,
    private dialog: MatDialog,
    private UserIdstore: Store<{ app: AppState }>,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private datePipe: DatePipe,
    private errorHandler: ApiErrorHandlerService) {
    this.maxDate = new Date();
  }
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

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value;
    if (event.value === null) {
      this.isInvalidDate = true;
    } else {
      this.isInvalidDate = false;
    }
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: Incoterm = {
        incoTermId: 0,
        incoTermCode: '',
        incoTermDescription: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        effectiveFrom: this.Date,
        message: ''
      };
      this.incoterms = [newRow, ...this.incoterms];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  formatDate(date: Date): string {
    // Get the current time
    const currentTime = new Date();
    // Format the date and concatenate with the current time
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    const formattedTime = this.datePipe.transform(currentTime, 'HH:mm:ss');
    return formattedDate + 'T' + formattedTime;
  }
  onDescriptionInput(event: Event, dataItem: Incoterm) {
    const inputValue = (event.target as HTMLInputElement).value;

    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.incoTermDescription = inputValue;
    }
  }
  getSelectedYear() {
    const dateValue = this.selectedDate.value;

    if (dateValue instanceof Date) {
      console.log(dateValue.getFullYear());

    }
  }
  Save(obj: any) { 
    obj.effectiveFrom = this.formatDate(obj.effectiveFrom);
    if (obj.incoTermCode != '' && obj.incoTermDescription != '' && obj.effectiveFrom != '') {
      this.incoService.addIncoterm(obj).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Added Sucessfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.getlist();
        this.date = '';
        this.showAddRow = false;
        obj.Isedit = false;

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
      }
    );
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
  Update(obj: Incoterm) {
    let a = typeof (this.date)
    if (a.toString() === 'object') {
      obj.effectiveFrom = this.formatDate(obj.effectiveFrom);
    }
    if (a != 'object') {
      obj.effectiveFrom = this.date;
    }
    if (obj.incoTermCode != '' && obj.effectiveFrom != '') {
      obj.updatedBy = parseInt(this.userId$);
      this.incoService.updateIncoterm(obj).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Updated Sucessfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.getlist();
        this.date = '';
        this.showAddRow = false;
        obj.Isedit = false;
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
      }
    );
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
  oncancel(obj: any) {
    obj.Isedit = false;
    if (this.showAddRow) {
      this.showAddRow = false;
    }
    this.getlist();
  }

  Edit(obj: any) {
    console.log(obj.effectiveFrom);
    this.date = this.datePipe.transform(obj.effectiveFrom, 'yyyy-MM-ddTHH:mm:ss')
    this.incoterms.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;

  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: 'Delete the Incoterm!',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.incoService.deleteIncoterm(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Incoterm you are trying to delete is already in use. Do you want to in-active this Incoterm ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.incoService
                    .IsActive(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        Swal.fire(
                          "Success",
                          "Incoterm has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        Swal.fire(
                          "Info",
                          "Incoterm is already in-active !",
                          "info"
                        );
                      }
                    });
                }
              });
              return throwError(error); // Re-throw the error to propagate it to the subscriber
            })
          )
          .subscribe((res) => {
            if (res.message === "SUCCESS") {
              this.getlist();
              Swal.fire("Deleted!", "Incoterm has been deleted sucessfully", "success");
            }
          });
      }
    });
  }

 
  getlist() {
    this.incoService.getIncoterms(this.livestaus).subscribe(result => {
      this.incoterms = result;
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


  //#region Keyboard tab operation

  /// to provoke csave or update method
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
  openDescriptionDialog(description: string) {
    const dialogRef = this.dialog.open(DescriptiondialogComponent, {
      width: '400px', // Set the width of the dialog
      height: '270px', // Set the height of the dialog
      data: { description: description },autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
