import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ContainerType } from "../containertype.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

import { ContainerTypeService } from "../containertype.service";

import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";

import { Observable, catchError, throwError } from "rxjs";
import { CommonService } from "src/app/services/common.service";
import { Country } from "src/app/ums/masters/countries/country.model";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { DescriptiondialogComponent } from "src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: 'app-containertype-list',
  templateUrl: './containertype-list.component.html',
  styleUrls: ['./containertype-list.component.css']
})
export class ContainertypeListComponent {
  keyword = "countryName";
  containerType: ContainerType[] = [];
  countries: Country[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  Livestaus = 1;
  LivestatusContainerType = 0;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  dataSource!: MatTableDataSource<ContainerType>;

  displayedColumns: string[] = [
    "containerTypeCode",
    "containerTypeName",
    "description",
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
  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private store: Store<{ privileges: { privileges: any } }>,
    private _liveAnnouncer: LiveAnnouncer,
    private containerTypeService: ContainerTypeService,
    private router: Router,
    private notificationService: NotificationService,
    private UserIdstore: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.GetUserId();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    this.dataSource = new MatTableDataSource(this.containerType);
    this.getAllContainerType();
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.countries = result;
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

  announceSortChange(sortContainerType: Sort) {
    if (sortContainerType.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortContainerType.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addContainerType() {
    this.router.navigate(["/ums/containerType/create"]);
  }

  OnDelete(containerType: ContainerType) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the containerType " + containerType.containerTypeName + "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.containerTypeService.deleteContainerType(containerType.containerTypeId).subscribe(
          (res) => {
            this.getAllContainerType();
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

  getAllContainerType() {
    this.containerTypeService.getAllContainerType().subscribe((result) => {
      this.containerType = result;
      this.dataSource.data = this.containerType;
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
      const newRow: ContainerType = {
        containerTypeId: 0,
        containerTypeCode: "",
        containerTypeName: "",
        description: "",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.containerType = [newRow, ...this.containerType];
      this.showAddRow = true;
    }
  }
  onDescriptionInput(event: Event, dataItem:ContainerType ) {
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.description = inputValue;
    }
  }

  Save(obj: ContainerType) {
    if (obj.containerTypeCode != "" && 
    obj.containerTypeName != "") {
      //  console.log(obj);
      const save: ContainerType = {
        ...obj,

      };
      this.containerTypeService
        .addContainerType(save)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "info",
              title: "info",
              text: "ContainerType already exists!!",
              showConfirmButton: false,
              timer: 2000,
            });
            throw error;
          })
        )
        .subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Sucessfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
        });
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

  Update(obj: ContainerType) {
    if (obj.containerTypeCode != '' && 
    obj.containerTypeName != '') {
      const update: ContainerType = {
        ...obj,
        updatedBy:parseInt(this.userId$)
      }
      this.containerTypeService.updatecontainerType(update)
      .pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "ContainerType is already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      )
      .subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Updated Sucessfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.getlist();
        this.showAddRow = false;
      });

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

  oncancel(obj: ContainerType) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: ContainerType) {
    this.containerType.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }

  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Container Type!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.containerTypeService.deleteContainerType(id).pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Container Type you are trying to delete is already in use. Do you want to in-active this Container Type ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.containerTypeService.isActiveContainerType(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Container Type has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire("Info", "Container Type is already in-active !", "info");
                  }
                });
              }
            });
            return throwError(error); // Re-throw the error to propagate it to the subscriber
          })
        ).subscribe((res) => {
          this.getlist();
          this.showAddRow = false;
          Swal.fire(
            'Deleted!',
            'Container Type has been Deleted.',
            'success'
          )
        });

      }
    })

  }
  getlist() {
    this.containerTypeService.getAllContainerType().subscribe(result => {
      this.containerType = result;
    });
  }
  ValidateField(item: any) {
    if (item !== "") {
      return false;
    } else {
      return true;
    }
  }

  selectEvent(item: any) {
    this.selectedcountyid = item.countryId;
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
