import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Country } from "../country.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { CountriesService } from "../countries.service";
import { NotificationService } from "src/app/services/notification.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/UserIdStore/UserId.reducer";
import { PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-country-list",
  templateUrl: "./country-list.component.html",
  styleUrls: ["./country-list.component.css", "../../../ums.styles.css"],
})
export class CountryListComponent implements OnInit, AfterViewInit {
  countries: Country[] = [];
  showAddRow: boolean | undefined;
  Livestaus = 0;
  Date = new Date();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("submitButton") submitButton!: ElementRef;
  @ViewChild("cancelButton") cancelButton!: ElementRef;
  dataSource!: MatTableDataSource<Country>;
  pagePrivilege: Array<string>;
  skip = 0;
  displayedColumns: string[] = [
    "countryCode2L",
    "countryCode3L",
    "countryName",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  userId$:string;
  constructor(
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private countriesService: CountriesService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>,
    private UserIdstore: Store<{ app: AppState }>
  ) { }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.dataSource = new MatTableDataSource(this.countries);

    this.commonService.getCountries(this.Livestaus).subscribe((res) => {
      this.countries = res.map((country) => {
        return {
          ...country,
          createdDate: new Date(country.createdDate.toString()),
          updatedDate: new Date(country.updatedDate.toString()),
        };
      });

      this.dataSource.data = this.countries;
      console.log(this.countries)
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
    console.log("this.userId$",this.userId$);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortCountry: Sort) {
    if (sortCountry.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortCountry.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCountry() {
    this.router.navigate(["/ums/country/create"]);
  }

  onDelete(country: Country) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message:
          "Are you sure you want to delete the country " +
          country.countryName +
          "?",
        dialogTitle: "Confirm Delete",
        buttonName: "Delete",
        showCancelButton: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.countriesService.deleteCountry(country.countryId).subscribe(
          (res) => {
            this.getCountries();
            // this.notificationService.ShowSuccess(res.message, "Logistics");
            this.commonService.displayToaster(
              "success",
              "Success",
              res.message
            );
          },
          (error) => {
            // this.notificationService.ShowError(
            //   JSON.stringify(error),
            //   "Logistics"
            // );
            this.commonService.displayToaster(
              "error",
              "Error",
              JSON.stringify(error)
            );
          }
        );
      }
    });
  }

  getCountries() {
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.countries = result;
      this.dataSource.data = this.countries;
    });
  }

  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: Country = {
        countryId: 0,
        countryCode2L: "",
        countryCode3L: "",
        countryName: "",
        saprefno:"",
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true,
      };
      this.countries = [newRow, ...this.countries];
      this.showAddRow = true;
    }
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  Save(obj: Country) {
    if (
      obj.countryName != "" &&
      obj.countryCode2L != "" &&
      obj.countryCode3L != ""
    ) {
      console.log(obj);
      this.countriesService
        .addCountry(obj)
        .pipe(
          catchError((error) => {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: "Country already exists!",
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

  Update(obj: Country) {
    if (
      obj.countryName != "" &&
      obj.countryCode2L != "" &&
      obj.countryCode3L != ""
    ) {
      const Country = {
        ...obj,
        updatedBy:parseInt(this.userId$)
      }
      console.log(obj);
      this.countriesService.updateCountry(Country).subscribe((response) => {
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
            text: "Country already exists!!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
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
  oncancel(obj: any) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: any) {
    this.showAddRow = false;
    this.countries.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
    this.showAddRow = false;
  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the country!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.countriesService
          .deleteCountry(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The country you are trying to delete is already in use. Do you want to in-active this country ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.countriesService.IsActiveCountry(id).subscribe((res) => {
                    if (res.message === "SUCCESS") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire(
                        "Success",
                        "Country has been in-activated successfully",
                        "success"
                      );
                    } else if (res.message === "In-Active") {
                      this.getlist();
                      this.showAddRow = false;
                      Swal.fire(
                        "Info",
                        "Country is already in-active !",
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
              this.showAddRow = false;
              Swal.fire("Deleted!", "Country has been deleted", "success");
            }
          });
      }
    });
  }
  getlist() {
    this.commonService.getCountries(this.Livestaus).subscribe((result) => {
      this.countries = result;
    });
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
