import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { NotificationService } from "src/app/services/notification.service";
import { StatesService } from "src/app/ums/masters/states/states.service";
import { City } from "../../../../Models/ums/city.model";
import { CitiesService } from "../cities.service";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { CommonService } from "src/app/services/common.service";
import { State } from "../../states/state.model";
import { Country } from "../../countries/country.model";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-city-list",
  templateUrl: "./city-list.component.html",
  styleUrls: ["./city-list.component.css", "../../../ums.styles.css"],
})
export class CityListComponent implements OnInit, AfterViewInit {
  keyword = "countryName";
  keywordstates = "stateName";
  Livestatus = 1;
  cities: City[] = [];
  countries: Country[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  states: State[] = [];
  Livestatuscities = 0;
  pagePrivilege: Array<string>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;

  dataSource!: MatTableDataSource<City>;

  displayedColumns: string[] = [
    "cityCode",
    "cityName",
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
  selectedstateid: any;

   //kendo pagination//
   sizes = [10,20,50];
  buttonCount = 2
  pageSize =10;
   userId$:string;
   skip = 0;
  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private statesService: StatesService,
    private citiesService: CitiesService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }
  initializePage() {
    this.dataSource = new MatTableDataSource(this.cities);
    this.getCities();
    this.commonService.getCountries(this.Livestatus).subscribe((result) => {
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

  announceSortChange(sortCity: Sort) {
    if (sortCity.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortCity.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCity() {
    this.router.navigate(["/ums/city/create"]);
  }

  onDelete(city: City) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the city " + city.cityName + "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.citiesService.deleteCity(city.cityId).subscribe(
          (res) => {
            this.getCities();
            this.notificationService.ShowSuccess(res.message, "Logistics");
          },
          (error) => {
            // this.notificationService.ShowError(
            //   JSON.stringify(error),
            //   "Logistics"
            // );
            Swal.fire({
              icon: "error",
              title: "Error",
              text: JSON.stringify(error),
              showConfirmButton: false,
              timer: 2000,
            });
          }
        );
      }
    });
  }

  getCities() {
    this.citiesService.getCities(this.Livestatuscities).subscribe((result) => {
      this.cities = result;
      this.dataSource.data = this.cities;
    });
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: City = {
        cityId: 0,
        cityCode: "",
        cityName: "",
        stateId: 0,
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
      this.cities = [newRow, ...this.cities];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: any) {
    if (
      obj.cityCode != "" &&
      obj.cityName != "" &&
      obj.stateName != "" &&
      obj.countryName != ""
    ) {
      console.log(obj);
      const save: City = {
        ...obj,
        countryId: this.selectedcountyid,
        stateId: this.selectedstateid,
        countryName: "",
        stateName: "",
      };
      this.citiesService
        .addCity(save)
        .pipe(
          catchError((error) => {
            if (error.error.ErrorDetails.includes("UNIQUE KEY")) {
              Swal.fire({
                icon: "error",
                title: "error",
                text: "City already exists!",
                showConfirmButton: false,
                timer: 2000,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "error",
                text: "Please select Valid country and states!",
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

  Update(obj: any) {
    if (
      obj.cityCode === "" ||
      obj.cityName === "" ||
      obj.stateName === "" ||
      obj.countryName === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please fill the mandatory fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return true;
    }

    let updateParams: City;
    switch (true) {
      case this.selectedcountyid != null && this.selectedstateid != null:
        updateParams = {
          ...obj,
          countryId: this.selectedcountyid,
          stateId: this.selectedstateid,
          updatedBy:parseInt(this.userId$),
          countryName: "",
          stateName: "",
        };
        break;

      case this.selectedcountyid != null:
        updateParams = {
          ...obj,
          countryId: this.selectedcountyid,
          updatedBy:parseInt(this.userId$),
          countryName: "",
          stateName: "",
        };
        break;

      case this.selectedstateid != null:
        updateParams = {
          ...obj,
          stateId: this.selectedstateid,
          updatedBy:parseInt(this.userId$),
          countryName: "",
          stateName: "",
        };
        break;

      default:
        updateParams = {
          ...obj,
          countryName: "",
          stateName: "",
          updatedBy:parseInt(this.userId$)
        };
        break;
    }

    this.citiesService.updateCity(updateParams).subscribe((response) => {
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
          text: "Cities already exists!!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });

    return false;
  }

  oncancel(obj: any) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: any) {
    this.cities.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the City!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.citiesService
          .deleteCity(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The city you are trying to delete is already in use. Do you want to in-active this city ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.citiesService.isActiveCity(id).subscribe((res) => {
                    if (res.message === "SUCCESS") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire(
                        "Success",
                        "City has been in-activated successfully",
                        "success"
                      );
                    } else if (res.message === "In-Active") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire("Info", "City is already in-active !", "info");
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
              this.showAddRow = false;
              Swal.fire("Deleted!", "City has been deleted", "success");
            }
          });
      }
    });
  }

  // Delete(id:number){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Delete the City!..",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //     }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.citiesService.deleteCity(id).subscribe((res) => {
  //         this.getlist();
  //         this.showAddRow = false;
  //         Swal.fire(
  //           'Deleted!',
  //           'City has been deleted',
  //           'success'
  //         )
  //       });

  //     }
  //     })

  // }

  getlist() {
    this.citiesService.getCities(this.Livestatuscities).subscribe((result) => {
      this.cities = result;
    });
  }
  selectEvent(item: any) {
    this.selectedcountyid = item.countryId;
    this.states = [];
    this.commonService
      .getStatesForSelectedCountry(this.selectedcountyid)
      .subscribe((result) => {
        this.states = result;
      });
  }
  selectstatesevent(item: any) {
    this.selectedstateid = item.stateId;
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
