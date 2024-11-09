import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Permit } from "../permit.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { PermitService } from "../permit.service";
import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { Observable, catchError, throwError } from "rxjs";
import { CommonService } from "src/app/services/common.service";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Country } from "src/app/ums/masters/countries/country.model";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { HttpErrorResponse } from "@angular/common/http";
import { ApiErrorHandlerService } from "src/app/shared/api-error-handler.service";

@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.css','../../../../ums/ums.styles.css']
})
export class PermitListComponent {
  keyword = "countryName";
  permit: Permit[] = [];
  countries: Country[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  Livestaus = 1;
  LivestatusPermit = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  dataSource!: MatTableDataSource<Permit>;

  displayedColumns: string[] = [
    "permitCode",
    "permitName",
    "countryName",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  selectedcountyid: any;
  filteredOptions: Observable<Country[]> | undefined;
  userId$: string;
  pagePrivilege: Array<string>;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private permitService: PermitService,
    private router: Router,
    private notificationService: NotificationService,
    private UserIdstore: Store<{ app: AppState }>,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.GetUserId();
    this.dataSource = new MatTableDataSource(this.permit);
    this.getAllPermit();
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.countries = result;
    });

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
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortPermit: Sort) {
    if (sortPermit.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortPermit.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addPermit() {
    this.router.navigate(["/ums/permit/create"]);
  }

  onDelete(permit: Permit) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the permit " + permit.permitName + "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.permitService.deletePermit(permit.permitId).subscribe(
          (res) => {
            this.getAllPermit();
            // this.notificationService.ShowSuccess(res.message, "Logistics");
            this.commonService.displayToaster(
              "success",
              "Success",
              res.message
            );
          },
          (error) => {
            this.commonService.displayToaster(
              "error",
              "Error",
              JSON.stringify(error)
            );
            // this.notificationService.ShowError(
            //   JSON.stringify(error),
            //   "Logistics"
            // );
          }
        );
      }
    });
  }

  getAllPermit() {
    this.permitService.getAllPermit().subscribe((result) => {
      this.permit = result;
      this.dataSource.data = this.permit;
     console.log(this.permit)
    });
  }
  onInputChange(event: any, dataItem: any) {
    debugger
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.countries.some(x => x.countryName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.countryName = '';

    }
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
      const newRow: Permit = {
        permitId: 0,
        permitCode: "",
        permitName: "",
        countryId: 0,
        countryName: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.permit = [newRow, ...this.permit];
      this.showAddRow = true;
    }
  }

  Save(obj: Permit) {
    if (obj.permitCode != "" &&
      obj.permitName != "" &&
      obj.countryName != "") {
      //console.log(obj);
      const save: Permit = {
        ...obj,
        countryId: this.selectedcountyid,
        countryName: "",
      };
      this.permitService.addPermit(save).subscribe((response) => {
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
          if (stausCode === 500) {
            this.errorHandler.handleError(err);
          } else if (stausCode === 400) {
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        }
      );
      return false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }

  }

  Update(obj: Permit) {
    if (obj.permitCode != '' &&
      obj.permitName != '' &&
      obj.countryName != '') {

      const update: Permit = {
        ...obj,
        countryId: this.selectedcountyid,
        countryName: "",
        updatedBy: parseInt(this.userId$)
      }
      this.permitService.updatePermit(update).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Updated Sucessfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.getlist();
        this.showAddRow = false;
      },
        (err: HttpErrorResponse) => {
          let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
          if (stausCode === 500) {
            this.errorHandler.handleError(err);
          } else if (stausCode === 400) {
            this.errorHandler.FourHundredErrorHandler(err);
          } else {
            this.errorHandler.commonMsg();
          }
        }
      );

      return false;
    } else {
      const update: Permit = {
        ...obj,
        countryId: this.selectedcountyid,
        countryName: "",
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }
  }
    oncancel(obj:Permit){
      obj.Isedit=false;
      this.getlist();
      this.showAddRow=false;
    }
  
    Edit(obj:Permit){
      this.selectedcountyid=obj.countryId
      this.permit.forEach(element=>{
        element.Isedit=false;
      });
      obj.Isedit=true;
    }
  
    Delete(id:number){
        Swal.fire({
          title: 'Are you sure?',
          text: "Delete the permit...!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.permitService.deletePermit(id)
            .pipe(
              catchError((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Not able to delete",
                  text: "The permit you are trying to delete is already in use. Do you want to in-active this permit ?",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.permitService.isActivePermit(id).subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Permit has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire("Info", "Permit is already in-active !", "info");
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
                'Permit has been deleted',
                'success'
              )
            });
          }
        })
  
    }
  getlist(){
    this.permitService.getAllPermit().subscribe(result=>{
      this.permit = result;
    });
  }
  ValidateField(item: any) {
    if (item !== "") {
      return false;
    } else {
      return true;
    }
  }

  //selectedCountryIds: number[] = []; // Array to store selected country IDs

  selectedCountryIds: any[] = [];

  selectEvent(item: any) {
    const selectedCountryId = item.countryId;
    this.selectedcountyid = selectedCountryId;
  
    // if (this.selectedCountryIds.includes(selectedCountryId)) {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Info",
    //     text: "Country already selected!",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   // Optionally, you can prevent further actions here
    // } else {
      this.selectedCountryIds.push(selectedCountryId);
      // Continue with your logic for handling the selected country
    //}
  }
  


  onChangeSearch(val: number) {
   // console.log(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onAutocompleteChange(event: any) {
   // console.log(event);
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
}


