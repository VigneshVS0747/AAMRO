import { Component, ElementRef, ViewChild } from '@angular/core';
import { ContactType } from 'src/app/Models/crm/master/ContactType';
import { ContactTypeService } from '../contact-type.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-contact-type',
  templateUrl: './contact-type.component.html',
  styleUrls: ['./contact-type.component.css']
})
export class ContactTypeComponent {
  showAddRow: boolean | undefined;
  Date = new Date();
  contactType: ContactType[]=[];
  ShowError = false

  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  constructor(private contactcrudSvc: ContactTypeService,private dialog: MatDialog,private router: Router,
    private UserIdstore: Store<{ app: AppState }>,
    private store: Store<{ privileges: { privileges: any } }>
) { }
  ngOnInit(): void {
    this.getlist();
    this.GetUserId();
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
      const newRow: ContactType = {
        contactTypeId: 0,
        contactTypeName: '',
        contactDescription: '',
        liveStatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        contactTypeCode: ''
      };
      this.contactType = [newRow, ...this.contactType];
      this.showAddRow = true;
    }

  }
  onDescriptionInput(event: Event, dataItem:ContactType ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.contactDescription = inputValue;
    }
  }
  oncancel(obj: ContactType) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Save(obj: ContactType) {
    if (obj.contactTypeName != '' && obj.contactTypeCode!="") {
      this.contactcrudSvc.addContactType(obj).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Contact already exists...!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      ).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
      })
      return false;
    }else {
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

  Update(obj: ContactType) {
    if (obj.contactTypeCode != '' && obj.contactTypeName != '') {
      obj.updatedBy=parseInt(this.userId$);
      this.contactcrudSvc.updateContactType(obj).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Contact already exists...!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      ).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
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
  Edit(obj: ContactType) {
    this.contactType.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }
  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Contact Type...!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactcrudSvc.deleteContactType(id)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Contact Type you are trying to delete is already in use. Do you want to in-active this Contact Type ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.contactcrudSvc.isActiveContactType(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Contact Type has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire("Info", "Contact Type is already in-active !", "info");
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
            'Contact type has been deleted',
            'success'
          )
        });
      }
    })
  }

  getlist() {
    this.contactcrudSvc.getContactType().subscribe(result => {
      this.contactType = result;  
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
