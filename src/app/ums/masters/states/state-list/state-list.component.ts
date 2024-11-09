import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { State } from "../state.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

import { StatesService } from "../states.service";

import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";

import { Observable, catchError, throwError } from "rxjs";
import { CommonService } from "src/app/services/common.service";
import { Country } from "../../countries/country.model";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-state-list",
  templateUrl: "./state-list.component.html",
  styleUrls: ["./state-list.component.css", "../../../ums.styles.css"],
})
export class StateListComponent implements OnInit, AfterViewInit {
  keyword = "countryName";
  states: State[] = [];
  countries: Country[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  Livestaus = 1;
  LivestatusState = 0;
  pagePrivilege: Array<string>;
  skip = 0;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;

  dataSource!: MatTableDataSource<State>;

  displayedColumns: string[] = [
    "stateCode",
    "stateName",
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

   //kendo pagination//
   sizes = [10,20, 50];
   buttonCount = 2
   pageSize =10;
   userId$:string;
  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private statesService: StatesService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.dataSource = new MatTableDataSource(this.states);
    this.getStates();
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

    this.UserIdstore.select("app").subscribe({
      next:(res)=>{
       this.userId$=res.userId;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addState() {
    this.router.navigate(["/ums/state/create"]);
  }

  // onDelete(state: State) {
  //   const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
  //     data: {
  //       message:
  //         "Are you sure you want to delete the state " + state.stateName + "?",
  //       dialogTitle: "Confirm Delete",
  //       buttonName: "Delete",
  //       showCancelButton: true,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.statesService.deleteState(state.stateId).subscribe(
  //         (res) => {
  //           this.getStates();
  //           // this.notificationService.ShowSuccess(res.message, "Logistics");
  //           this.commonService.displayToaster(
  //             "success",
  //             "Success",
  //             res.message
  //           );
  //         },
  //         (error) => {
  //           this.commonService.displayToaster(
  //             "error",
  //             "Error",
  //             JSON.stringify(error)
  //           );
  //           // this.notificationService.ShowError(
  //           //   JSON.stringify(error),
  //           //   "Logistics"
  //           // );
  //         }
  //       );
  //     }
  //   });
  // }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the State!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.statesService
          .deleteState(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The state you are trying to delete is already in use. Do you want to in-active this State ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.statesService.isActiveState(id).subscribe((res) => {
                    if (res.message === "SUCCESS") {
                      this.getStates();
                      this.showAddRow = false;
                      Swal.fire(
                        "Success",
                        "State has been in-activated sucessfully",
                        "success"
                      );
                    } else if (res.message === "In-Active") {
                      this.getStates();
                      this.showAddRow = false;
                      Swal.fire("Info", "State is already in-active !", "info");
                    }
                  });
                }
              });
              return throwError(error); // Re-throw the error to propagate it to the subscriber
            })
          )
          .subscribe((res) => {
            if (res.message === "SUCCESS") {
              this.getStates();
              this.showAddRow = false;
              Swal.fire("Deleted!", "State has been deleted", "success");
            }
          });
      }
    });
  }

  getStates() {
    this.statesService.getStates(this.LivestatusState).subscribe((result) => {
      this.states = result;
      this.dataSource.data = this.states;
    });
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: State = {
        stateId: 0,
        stateCode: "",
        stateName: "",
        countryId: 0,
        countryName: "",
        saprefno:"",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.states = [newRow, ...this.states];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }

  Save(obj: State) {
    if (obj.stateCode != "" && obj.stateName != "" && obj.countryName != "") {
      console.log(obj);
      const save: State = {
        ...obj,
        countryId: this.selectedcountyid,
        countryName: "",
      };
      this.statesService
        .addState(save)
        .pipe(
          catchError((error) => {
            if (error.error.ErrorDetails.includes("UNIQUE KEY")) {
              Swal.fire({
                icon: "error",
                title: "error",
                text: "State already exists!!",
                showConfirmButton: false,
                timer: 2000,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "error",
                text: "Please enter valid Country",
                showConfirmButton: false,
                timer: 2000,
              });
            }

            throw error;
          })
        )
        .subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
        });
      return false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }

  Update(obj: State) {
    if (obj.stateCode != "" && obj.stateName != "" && obj.countryName != "") {
      if (this.selectedcountyid == null) {
        const update: State = {
          ...obj,
          updatedBy:parseInt(this.userId$),
          countryName: "",
        };
        this.statesService.updateState(update).subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
        },(error) => {
          if(error.error.ErrorDetails.includes('UNIQUE KEY')){
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "State already exists!!",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      } else {
        const update: State = {
          ...obj,
          countryId: this.selectedcountyid,
          updatedBy:parseInt(this.userId$),
          countryName: "",
        };
        this.statesService.updateState(update).subscribe((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Updated Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.getlist();
          this.showAddRow = false;
        },(error) => {
          if(error.error.ErrorDetails.includes('UNIQUE KEY')){
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "State already exists!!",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      }
      return false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }
  }
  oncancel(obj: State) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: State) {
    this.states.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  // Delete(id:number){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Delete the States!..",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //     }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.statesService.deleteState(id).subscribe((res) => {
  //         this.getlist();
  //         this.showAddRow = false;
  //         Swal.fire(
  //           'Deleted!',
  //           'State has been Deleted.',
  //           'success'
  //         )
  //       });

  //     }
  //     })

  // }
  getlist() {
    this.statesService.getStates(this.LivestatusState).subscribe((result) => {
      this.states = result;
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
    console.log(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onAutocompleteChange(event: any) {
    console.log(event);
  }
  //#region Keyboard tab operation

  /// to provoke csave or update method
  hndlKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.showAddRow ? this.Save(dataItem) : this.Update(dataItem);
    }
  }
  /// to reach submit button
  handleChange(event: any, dataItem: any) {
    if (event.key === "Tab" || event.key === "Enter") {
      this.submitButton.nativeElement.focus();
    }
  }
  /// to reach cancel button
  hndlChange(event: any) {
    if (event.key === "Tab") {
      this.cancelButton.nativeElement.focus();
    }
  }
  /// to provoke cancel method
  handleKeyPress(event: any, dataItem: any) {
    if (event.key === "Enter") {
      this.oncancel(dataItem);
    }
  }

  //#endregion
}
