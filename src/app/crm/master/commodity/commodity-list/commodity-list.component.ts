import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommodityService } from '../commodity.service';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/confirmation/delete-confirmation-dialog.component';
//import { catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { Commodity } from '../commodity.model';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from 'src/app/shared/api-error-handler.service';

@Component({
  selector: 'app-commodity-list',
  templateUrl: './commodity-list.component.html',
  styleUrls: ['./commodity-list.component.css']
})
export class CommodityListComponent implements OnInit, AfterViewInit {
  keyword = 'countryName';
  keywordstates = 'stateName';
  Livestatus = 1;
  commodities: Commodity[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;
  skip = 0;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Commodity>;

  displayedColumns: string[] =
    ['commodityCode',
      'commodityName',
      'commodityDescription',
      'livestatus',
      'createdBy',
      'createdDate',
      'updatedBy',
      'updatedDate',
      'edit',
      'delete'];
  commodity: Commodity[];
  userId$: string;
  // getlist: any;
  pagePrivilege: Array<string>;

  constructor(private dialog: MatDialog, 
    private _liveAnnouncer: LiveAnnouncer, 
    private commodityService: CommodityService, 
    private router: Router, 
    private notificationService: NotificationService,
    private UserIdstore: Store<{ app: AppState }>,
    private store: Store<{ privileges: { privileges: any } }>,
    private errorHandler: ApiErrorHandlerService
) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.commodities);
    this.getCommodities();
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  announceSortChange(sortCommodity: Sort) {
    if (sortCommodity.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortCommodity.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onDelete(commodity: Commodity) {

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message: "Are you sure you want to delete the commodity " + commodity.commodityName + "?", dialogTitle: "Confirm Delete"
        , buttonName: "Delete", showCancelButton: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commodityService.deleteCommodity(commodity.commodityId).subscribe((res) => {
          this.getCommodities();
          this.notificationService.ShowSuccess(res.message, "Logistics");
        },
          (error) => {
            this.notificationService.ShowError(JSON.stringify(error), "Logistics");
          });
      }
    });
  }

  getCommodities() {
    this.commodityService.getCommodities().subscribe(result => {
      this.commodities = result;
      this.dataSource.data = this.commodities;
    })
  }
  Add() {
    let skip = 0
    let take = this.pageSize
    this.pageChange({skip:skip,take:take});
    if (!this.showAddRow) {
      const newRow: Commodity = {
        commodityId: 0,
        commodityCode: '',
        commodityName: '',
        commodityDescription: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true
      };
      this.commodities = [newRow, ...this.commodities];
      this.showAddRow = true;
    }

  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
  }
  onDescriptionInput(event: Event, dataItem: Commodity) {
    const inputValue = (event.target as HTMLInputElement).value;

    // Enforce the maximum character limit
    if (inputValue.length <= 500) {
      dataItem.commodityDescription = inputValue;
    }
  }
  Save(obj: Commodity) {
    debugger
    if (obj.commodityCode != '' &&
      obj.commodityName != '') {
      this.commodityService.addCommodity(obj).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Added Sucessfully',
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
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill all the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }
  }



  Update(obj: any) {
    if (obj.commodityCode != '' &&
      obj.commodityName != ''
    ) {
      obj.UpdatedBy = parseInt(this.userId$);
      this.commodityService.updateCommodity(obj).subscribe((response) => {
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
    );
      return false;
    }
    else {
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
 
  oncancel(obj: any) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: any) {
    this.commodities.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }

  Delete(id: number) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "Delete the Commodity !",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.commodityService.deleteCommodity(id).subscribe((res) => {
    //       this.getlist();
    //       this.showAddRow = false;
    //       Swal.fire(
    //         'Deleted!',
    //         'Commodity has been deleted',
    //         'success'
    //       )
    //     });

    //   }
    // })






    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Commodity!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commodityService.deleteCommodity(id).pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Commodity you are trying to delete is already in use. Do you want to in-active this Commodity ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.commodityService.IsActiveCommodity(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    Swal.fire(
                      "Success",
                      "Commodity has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    Swal.fire("Info", "Commodity is already in-active !", "info");
                  }
                });
              }
            });
            return throwError(error); 
          })
        ).subscribe((res) => {
          this.getlist();
          Swal.fire(
            'Deleted!',
            'Commodity has been Deleted.',
            'success'
          )
        });
  
      }
    })

  }


  getlist() {
    this.commodityService.getCommodities().subscribe(result => {
      this.commodities = result;
      // console.log(this.commodities);

    })
  }

  ValidateField(item: any) {
    if (item !== '') {
      return false;
    } else {
      return true;
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

