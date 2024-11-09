import { Component, ElementRef, ViewChild } from '@angular/core';
import { CustomerrankingService } from '../customerranking.service';
import { CustomerRanking } from '../customerranking.model';
import Swal from 'sweetalert2';
import { catchError, elementAt, throwError } from 'rxjs';
import { ErrorhandlingService } from 'src/app/services/crm/errorhandling.service';
import { CommonService } from 'src/app/services/common.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';


@Component({
  selector: 'app-customerranking',
  templateUrl: './customerranking.component.html',
  styleUrls: ['./customerranking.component.css']
})
export class CustomerrankingComponent {
  customerRanking: CustomerRanking[] = [];
  ShowError = false
  showAddRow: boolean;
  Date = new Date();
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  userId$: string;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  constructor(private customerrankingService: CustomerrankingService, private commonService: CommonService
    , private ErrorHandling: ErrorhandlingService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>,

    private UserIdstore: Store<{ app: AppState }>) { }
  ngOnInit() {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.getAll();
  }
  getAll() {
    this.customerrankingService.getCustomerRanking().subscribe(result => {
      this.customerRanking = result;
    });
  }
  GetUserId() {
    this.UserIdstore.select("app").subscribe({
      next: (res) => {
        this.userId$ = res.userId;
      }
    });
  }



  ValidateField(item: any) {
    return item !== '' ? false : true
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
      const newRow: CustomerRanking = {
        customerRankingId: 0,
        rankCode: '',
        rankName: '',
        fromValue: null,
        toValue: null,
        liveStatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true
      };
      this.customerRanking = [newRow, ...this.customerRanking];
      this.showAddRow = true;
    }
  }
  fromValue(event:any,dataItem:any){
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    input.value = value;
    dataItem.fromValue=value;

  }
  toValue(event:any,dataItem:any){
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.startsWith('0') && value.length > 1) {
      value = value.slice(1);
    }
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    input.value = value;
    dataItem.toValue=value;
  }
  Save(obj: CustomerRanking) {
    debugger
    if (obj.rankCode != '' && obj.rankName != '' && obj.fromValue !=null) {
      if(obj.toValue!=null){
        if (parseInt(obj.fromValue) >= parseInt(obj.toValue)) {
          Swal.fire({
            icon: 'info',
            title: 'info',
            text: 'To Value should be greater than From Value..!',
            showConfirmButton: false,
            timer: 2000
          })
          return;
        }
      }
      const tovalues = this.customerRanking.filter(obj => obj.toValue == null || obj.toValue == '')
      if (tovalues.length > 1) {
        Swal.fire({
          icon: 'info',
          title: 'info',
          text: 'In To value field, Only one record can be empty..!',
          showConfirmButton: false,
          timer: 2000
        })
        return;
      }
      obj.toValue=obj.toValue==null?null:obj.toValue;
      this.customerrankingService.addCustomerRanking(obj).subscribe({
        next: (res) => {
          if (res.message == 'DUPLICATE') {
            Swal.fire({
              icon: 'error',
              title: 'Exist!',
              text: 'The combination of From Value and To Value already exists.',
              showConfirmButton: false,
              timer: 2500
            })
            return;
          }
          this.commonService.displayToaster(
            "success",
            "Success",
            "Added Sucessfully"
          );
          this.getAll();
          this.showAddRow = false;
        },
        error: (error) => {
          var ErrorHandle = this.ErrorHandling.handleApiError(error)
          this.commonService.displayToaster(
            "error",
            "Error",
            ErrorHandle
          );
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

  Update(obj: CustomerRanking) {
    debugger
    if(obj.fromValue!=null && obj.toValue!=null ){
      if (parseInt(obj.fromValue) >= parseInt(obj.toValue)) {
        Swal.fire({
          icon: 'info',
          title: 'info',
          text: 'To Value should be greater than From Value..!',
          showConfirmButton: false,
          timer: 2000
        })
        return;
      }
    }
    const tovalues = this.customerRanking.filter(obj => obj.toValue == null || obj.toValue == '')
    if (tovalues.length > 1) {
      Swal.fire({
        icon: 'info',
        title: 'info',
        text: 'In To value field, Only one record can be empty..!',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    if (obj.rankCode != '' && obj.rankName != '' && obj.fromValue != "") {
      obj.updatedBy = parseInt(this.userId$);
      obj.toValue=obj.toValue==""?null:obj.toValue;
      this.customerrankingService.addCustomerRanking(obj).subscribe({
        next: (res) => {
          if (res.message == 'DUPLICATE') {
            Swal.fire({
              icon: 'error',
              title: 'Exist!',
              text: 'The combination of From Value and To Value already exists.',
              showConfirmButton: false,
              timer: 2500
            })
            return;
          }
          this.commonService.displayToaster(
            "success",
            "Success",
            "Updated Sucessfully"
          );
          this.getAll();
          this.showAddRow = false;
        },
        error: (error) => {
          var ErrorHandle = this.ErrorHandling.handleApiError(error)
          this.commonService.displayToaster(
            "error",
            "Error",
            ErrorHandle
          );
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
      text: "Delete the Customer Ranking..!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerrankingService.deleteCustomerRanking(id).pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Customer Ranking you are trying to delete is already in use. Do you want to in-active this Customer Ranking ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.customerrankingService.isActiveCustomerRanking(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getAll();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Customer Ranking has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getAll();
                    this.showAddRow = false;
                    Swal.fire("Info", "Customer Ranking is already in-active !", "info");
                  }
                });
              }
            });
            return throwError(error); // Re-throw the error to propagate it to the subscriber
          })
        ).subscribe(res => {
          this.getAll();
          this.showAddRow = false;
          Swal.fire(
            'Deleted!',
            'Customer Ranking has been deleted',
            'success'
          )
        });
      }
    })
  }
  ValidateNumberField(item:any)
  {
    debugger
    if (item != null) {
      return false;
    } else {
      return true;
    }
  }
  Edit(obj: CustomerRanking) {
    this.customerRanking.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }
  oncancel(obj: CustomerRanking) {
    obj.Isedit = false;
    this.showAddRow = false;
    this.getAll();
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
