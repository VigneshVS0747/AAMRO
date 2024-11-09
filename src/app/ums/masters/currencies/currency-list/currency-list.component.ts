import { Component, ViewChild } from "@angular/core";
import { Currency } from "../currency.model";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { DeleteConfirmationDialogComponent } from "src/app/dialog/confirmation/delete-confirmation-dialog.component";
import { CurrenciesService } from "../currencies.service";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { catchError, throwError } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-currency-list",
  templateUrl: "./currency-list.component.html",
  styleUrls: ["./currency-list.component.css", "../../../ums.styles.css"],
})
export class CurrencyListComponent {
  currencies: Currency[] = [];
  Livestaus = 0;
  filter: any;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Currency>;

  displayedColumns: string[] = [
    "currencyCode",
    "currencyName",
    "currencySymbol",
    "mainDenomination",
    "subDenomination",
    "livestatus",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    "edit",
    "delete",
  ];
  showAddRow: boolean;
  pagePrivilege: Array<string>;
   //kendo pagination//
   sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;

  constructor(
    private currenciesService: CurrenciesService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private notificationService: NotificationService,
    private store: Store<{ privileges: { privileges: any } }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.currenciesService.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.dataSource = new MatTableDataSource(this.currencies);
    this.getCurrencies();
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }

  onFilterChange(filter: any) {
    this.currenciesService.setFilterState(filter);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortCurrency: Sort) {
    if (sortCurrency.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortCurrency.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCurrency() {
    this.router.navigate(["/ums/master/currencies/create"]);
  }

  // onDelete(currency: Currency) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Delete Currency!..",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.currenciesService
  //         .deleteCurrency(currency.currencyId)
  //         .subscribe((res) => {
  //           this.getCurrencies();
  //           Swal.fire("Deleted!", "Currency has been deleted", "success");
  //         });
  //     }
  //   });
  // }

  onDelete(currency: Currency) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Currency!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.currenciesService
          .deleteCurrency(currency.currencyId)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The currency you are trying to delete is already in use. Do you want to in-active this currency ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.currenciesService
                    .IsActiveCurrency(currency.currencyId)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getCurrencies();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Currency has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getCurrencies();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Currency is already in-active !",
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
              this.getCurrencies();
              this.showAddRow = false;
              Swal.fire("Deleted!", "Currency has been deleted", "success");
            }
          });
      }
    });
  }
  getCurrencies() {
    this.commonService.getCurrencies(this.Livestaus).subscribe((result) => {
      this.currencies = result;
      this.dataSource.data = this.currencies;
    });
  }
}
