import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { UOMConversion } from '../uomconversion.model';
import { PageEvent } from '@angular/material/paginator';
import { UOMConversionService } from '../uomconversion.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/confirmation/delete-confirmation-dialog.component';
import Swal from 'sweetalert2';
import { catchError, map, startWith } from 'rxjs';
import { UOM } from '../../unitofmeasure/unitofmeasure.model';
import { UOMsService } from '../../unitofmeasure/unitofmeasure.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-uomconversion-list',
  templateUrl: './uomconversion-list.component.html',
  styleUrls: ['./uomconversion-list.component.css']
})
export class UomconversionListComponent {
  keyword = "uomName";
  ///keywordname = "uomName";
  totaluoms = 0;
  uomConversionPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  pageIndex = 1;
  showAddRow: boolean | undefined;
  Date = new Date();
  uomConversion: UOMConversion[] = [];
  selectedValueFromUOM: UOMConversion[] = [];
  selectedValueToUOM: any[];
  selecteduomFromId: any;
  selecteduomToId: any;
  dataItem: any;
  skip = 0;
  uoms: UOM[] = [];
  ShowError = false;
  Livestatus = 0;
  pagePrivilege: Array<string>;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<UOMConversion>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;
  displayedColumns: string[] = [
    // "uomCode",
    "uomName",
    "conversionRate",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  userId$: string;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;


  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private uomConversionService: UOMConversionService,
    private uomsService: UOMsService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    private UserIdstore: Store<{ app: AppState }>,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService

  ) { }


  ngOnInit(): void {
    this.GetUserId();
    this.dataSource = new MatTableDataSource(this.uomConversion);
    this.getAllUOMConversion();
    // this.initializeAllPossibleOptionsForToUOM();
    this.uomsService.getAllActiveUOM
    ().subscribe((result) => {
      this.uoms = result;
      console.log(this.uoms)

    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });

    if (this.selecteduomFromId) {
      this.selectedValueToUOM = this.uoms.filter(uom => uom.uomId !== this.selecteduomFromId);
    }


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

  announceSortChange(sortUOMConversion: Sort) {
    if (sortUOMConversion.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortUOMConversion.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  onChangePage(data: PageEvent) {
    this.pageIndex = data.pageIndex + 1;
    this.uomConversionPerPage = data.pageSize;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addUOMConversion() {
    this.router.navigate(["/ums/department/create"]);
  }

  onDelete(uomConversion: UOMConversion) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the unit of measurement " +
          uomConversion.uomName +
          "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uomConversionService
          .deleteUOMConversion(uomConversion.uomConversionId)
          .subscribe(
            (res) => {
              this.getAllUOMConversion();
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

  getAllUOMConversion() {
    this.uomConversionService.getAllUOMConversion().subscribe((result: any) => {
      this.uomConversion = result;
      console.log("result", result)
    });
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: UOMConversion = {
        uomConversionId: 0,
        uomFromId: 0,
        uomToId: 0,
        uomName: "",
        uomToName: "",
        conversionRate:"",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
        uomCode: ""
      };
      this.uomConversion = [newRow, ...this.uomConversion];
      this.showAddRow = true;

    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: UOMConversion) {
    debugger;
    if (obj.conversionRate !== "" &&
      obj.uomName !== "" &&
      obj.uomToName
    ) {
      const save: UOMConversion = {
        ...obj,
        uomFromId: this.selecteduomFromId,
        uomToId: this.selecteduomToId,
        uomName: "",
        uomToName: ""
      };

      this.uomConversionService.addUOMConversion(save).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getAllUOMConversion();
        this.showAddRow = false;
      }, (err: HttpErrorResponse) => {
        let stausCode = err?.error?.StatusCode ? err?.error?.StatusCode : err?.error?.status
        if(stausCode === 500){
          this.errorHandler.handleError(err);
        } else if(stausCode === 400){
          this.errorHandler.FourHundredErrorHandler(err);
        } else {
          this.errorHandler.commonMsg();
        }
      },
    
    );
      return false;
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill all the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      });
      return true;
    }
  }



  Update(obj: UOMConversion) {
    obj.updatedBy = 1;

    // Check if mandatory fields are filled
    if (
      obj.conversionRate === null ||
      obj.uomName === "" ||
      obj.uomToName === ""
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      });
      return false; // Return false to indicate validation failure
    }
    obj.updatedBy=parseInt(this.userId$);
    let updateParams: UOMConversion = { ...obj };
    updateParams.uomFromId = parseInt(this.selecteduomFromId, 10);
    updateParams.uomName = "";
    updateParams.uomToName = "";
    updateParams.uomToId = parseInt(this.selecteduomToId, 10);

    // Check if the updated conversion already exists
    if (
      this.uomConversion.some(
        e =>
          e.uomFromId === updateParams.uomFromId &&
          e.uomToId === updateParams.uomToId &&
          e.uomConversionId !== updateParams.uomConversionId
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'UOM Conversion already exists!',
        showConfirmButton: false,
        timer: 2000
      });
      return false; // Return false to indicate duplicate entry
    }

    // Perform the update operation if validation passes
    this.uomConversionService.updateUOMConversion(updateParams)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated Successfully',
            showConfirmButton: false,
            timer: 2000
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
      );

    return true; // Return true to indicate successful update request
  }

  oncancel(obj: UOMConversion) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: UOMConversion) {
    this.uomConversion.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.selecteduomFromId = obj.uomFromId;
    this.selecteduomToId = obj.uomToId;

    if (obj.uomFromId) {
      this.selectedValueToUOM = this.uoms.filter(uom => uom.uomId !== obj.uomFromId);
    }
  }

  Delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the UOM Conversion ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.uomConversionService.deleteUOMConversion(id).subscribe((res) => {
          this.getlist();
          this.showAddRow = false;
          Swal.fire(
            'Deleted!',
            'UOM has been deleted',
            'success'
          )
        });

      }
    })
  }


  getlist() {
    // console.log(this.uomConversion,"result1")
    this.uomConversionService.getAllUOMConversion().subscribe((result: any) => {
      this.uomConversion = result;
    });
  }


  // selectEventUomfromId(item: any) {
  //   debugger;
  // //   console.log(item)

  //    item.uomFromId = item.uomId;
  //    this.selecteduomFromId = item.uomFromId;
  // //    var temp = this.uoms.filter(uom => uom.uomId !== item.uomId);
  // //  this.selectedValueToUOM = temp;
  // //  this.selectedValueToUOM= [];
  // // if (this.selecteduomFromId) {
  // //   this.selectedValueToUOM = this.uoms.filter(uom => uom.uomId !== this.selecteduomFromId);
  // // }
  // }
  selectEventUomfromId(item: any) {
    item.uomFromId = item.uomId;
    this.selecteduomFromId = item.uomFromId;
    this.selectedValueToUOM = this.uoms.filter(uom => uom.uomId !== this.selecteduomFromId);
  }


  selectEventUomToId(item: any) {
    debugger;
    console.log("selected to id", this.selecteduomToId)
    item.uomToId = item.uomId;
    this.selecteduomToId = item.uomToId;
    console.log("selected to id", this.selecteduomToId)

  }

  ValidateField(item: any) {
    if (item !== "") {
      return false;
    } else {
      return true;
    }
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
  onChangeSearch(val: number) {
    console.log(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === 'Enter') {
      this.oncancel(dataItem)
    }
  }

  crate(event: any): number {
    // Ensure the value is a number and check if it's negative
    if (event.conversionRate < 0) {
      // Set the value to the absolute value (positive)
      event.conversionRate = Math.abs(event.conversionRate).toFixed(2);
      // Update the input element's value
      return event.conversionRate;
    }
    // Return the adjusted value
    return event.conversionRate;
  }

  onInputChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.uoms.some(doc => doc.uomName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.uomName = '';
    }
  }

  onInputuomToNameChange(event: any, dataItem: any) {
    const inputValue = event.target.value.toLowerCase();
    const hasMatch = this.uoms.some(doc => doc.uomName.toLowerCase().includes(inputValue));
    if (!hasMatch) {
      dataItem.uomToName = '';
    }
  }
}
