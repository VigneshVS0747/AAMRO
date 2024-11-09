import { Component, ElementRef, ViewChild } from '@angular/core';
import { AddressCrudService } from '../address-crud.service';
import { AddressType } from 'src/app/Models/crm/master/AddresssType';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { MatDialog } from '@angular/material/dialog';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { CommonService } from 'src/app/services/common.service';
import { AddressCategorys } from 'src/app/Models/crm/master/Dropdowns';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-address-crud',
  templateUrl: './address-crud.component.html',
  styleUrls: ['./address-crud.component.css']
})
export class AddressCrudComponent {
  showAddRow: boolean | undefined;
  Date = new Date();
  addressType: AddressType[]=[];
  ShowError = false;
  keywordAdd='addressCategory'
  addressCategory:string;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  addressCategoryList: AddressCategorys[];
  addressCategoryId: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  constructor(private addresscrudSvc: AddressCrudService,private dialog: MatDialog, private commonService:CommonService,
    private UserIdstore: Store<{ app: AppState }>,private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService
) { }
  ngOnInit(): void {
    this.GetUserId();
    this.getlist();
    this.GetAllAddressCategory();
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
  GetAllAddressCategory()
  {
    this.commonService.GetAllAddressCategory().subscribe(res=>{
      this.addressCategoryList=res;
      console.log(this.addressCategoryList);
    });
  }
  selectaddressevent(data: any) {
    this.addressCategory = data.addressCategory;
    this.addressCategoryId = data.addressCategoryId;
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: AddressType = {
        addresstypeId: 0,
        addresstypeCode: '',
        addresstypeName: '',
        description:'',
        addressCategory:'',
        addressCategoryId:0,
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true
      };
      this.addressType = [newRow, ...this.addressType];
      this.showAddRow = true;
    }

  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  onDescriptionInput(event: Event, dataItem:AddressType ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.description = inputValue;
    }
  }
  oncancel(obj: AddressType) {
    obj.Isedit = false;
    this.getlist();
  }

  Save(obj: AddressType) {
    if (obj.addresstypeCode != '' && obj.addresstypeName != ''&& obj.addressCategory!='') {
      obj.addressCategory=this.addressCategory
      obj.addressCategoryId=this.addressCategoryId
      this.addresscrudSvc.addAddressType(obj).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
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
    )
      return false;
    }  else {
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

  Update(obj: AddressType) {
    debugger
    if (obj.addresstypeCode != '' && obj.addresstypeName != ''&& obj.addressCategory!='') {
      obj.updatedBy=parseInt(this.userId$);
      obj.addressCategory=this.addressCategory
      obj.addressCategoryId=this.addressCategoryId
      this.addresscrudSvc.updateAddressType(obj).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
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
    )
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
  Edit(obj: AddressType) {
    this.addressType.forEach(element => {
      element.Isedit = false;
      this.addressCategory=obj.addressCategory;
      this.addressCategoryId=obj.addressCategoryId;
    });
    obj.Isedit = true;
  }
  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Address Type!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addresscrudSvc.deleteAddressType(id)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Address type you are trying to delete is already in use. Do you want to in-active this Address type ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.addresscrudSvc.isActiveAddresstype(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Address type has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire("Info", "Address type is already in-active !", "info");
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
            'Address Type has been deleted',
            'success'
          )
        });
      }
    })
  }

  getlist() {
    this.addresscrudSvc.getAddressType().subscribe(result => {
      this.addressType = result;      
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

  onInputChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.addressCategoryList.some(doc => doc.addressCategory.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.addressCategory = '';
    }
  }
}
