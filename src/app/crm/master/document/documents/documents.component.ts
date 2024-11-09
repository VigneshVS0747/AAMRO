import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocmentsService } from '../document.service';
import Swal from 'sweetalert2';
import { Documents } from 'src/app/Models/crm/master/documents';
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
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  showAddRow: boolean | undefined;
  Date = new Date();
  documents: Documents[] = [];
  ShowError = false
  pagePrivilege: Array<string>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  livestatus=0;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  constructor(private docService: DocmentsService,
    private UserIdstore: Store<{ app: AppState }>,
    private commonService: CommonService,
    private ErrorHandling: ErrorhandlingService,
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
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }


  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});

    if (!this.showAddRow) {
      const newRow: Documents = {
        documentId: 0,
        documentCode: '',
        documentName: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        remarks: ''
      };
      this.documents = [newRow, ...this.documents];
      this.showAddRow = true;
    }

  }
  onRemarksInput(event: Event, dataItem:Documents ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.remarks = inputValue;
    }
  }
  oncancel(obj: Documents) {
    obj.Isedit = false;
    this.showAddRow = false;
    this.getlist();
  }

  Save(obj: Documents) {
    if (obj.documentCode != '' && obj.documentName != '') {
      this.docService.addDocument(obj).subscribe({ next: (response) => {
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
      })
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

  Update(obj: Documents) {
    if (obj.documentCode != '' && obj.documentName != '') {
      obj.updatedBy=parseInt(this.userId$);
      this.docService.updateDocument(obj).subscribe( {
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
        this.getlist();
        this.showAddRow = false;
        obj.Isedit=false;
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
  Edit(obj: Documents) {
    this.documents.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }
  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the document!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.docService.deleteDocument(id)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Document you are trying to delete is already in use. Do you want to in-active this Document ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.docService.isActiveDocument(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Document has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire("Info", "Document is already in-active !", "info");
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
            'Document has been deleted',
            'success'
          )
        });
      }
    })
  }

  getlist() {
    this.docService.getDocuments(this.livestatus).subscribe(result => {
      this.documents = result;
    })
  }
  ValidateField(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
    }
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
