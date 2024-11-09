import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { packagetypeService } from '../packagetype.service';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/confirmation/delete-confirmation-dialog.component';
//import { catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { PackageType } from '../packagetype.model';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/UserIdStore/UserId.reducer';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-packagetype-list',
  templateUrl: './packagetype-list.component.html',
  styleUrls: ['./packagetype-list.component.css']
})
export class PackagetypeListComponent {
  Livestatus = 1;
  packagetype: PackageType[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  pagePrivilege: Array<string>;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<PackageType>;

  displayedColumns: string[] =
    ['PackagetypeCode',
      'PackagetypeName',
      'Description',
      'livestatus',
      'createdBy',
      'createdDate',
      'updatedBy',
      'updatedDate',
      'edit',
      'delete']
  userId$: string;
    //kendo pagination//
    sizes = [10, 20, 50];
    buttonCount = 2
    pageSize = 10;
    skip = 0;
  constructor(private dialog: MatDialog,
     private _liveAnnouncer: LiveAnnouncer, 
     private PackagetypeService: packagetypeService, 
     private router: Router, 
     private notificationService: NotificationService,
     private UserIdstore: Store<{ app: AppState }>,
     private store: Store<{ privileges: { privileges: any } }>
     ) { }

  ngOnInit(): void {
    this.GetUserId();
    this.dataSource = new MatTableDataSource(this.packagetype);
    this.getAllpackagetype();
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

  announceSortChange(sortPackagetype: Sort) {
    if (sortPackagetype.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortPackagetype.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onDelete(Packagetype: PackageType) {
debugger
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        message: "Are you sure you want to delete the Packagetype " + Packagetype.packageTypeName + "?", dialogTitle: "Confirm Delete"
        , buttonName: "Delete", showCancelButton: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.PackagetypeService.deletepackagetype(Packagetype.packageTypeId).subscribe((res) => {
          this.getAllpackagetype();
          this.notificationService.ShowSuccess(res.message, "Logistics");
        },
          (error) => {
            this.notificationService.ShowError(JSON.stringify(error), "Logistics");
          });
      }
    });
  }

  getAllpackagetype() {
    this.PackagetypeService.getAllpackagetype().subscribe(result => {
      this.packagetype = result;
      this.dataSource.data = this.packagetype;
    })
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
      const newRow: PackageType = {
        packageTypeId: 0,
        packageTypeCode: '',
        packageTypeName: '',
        description: '',
        livestatus: true,
        createdBy: parseInt(this.userId$),
        createdDate: this.Date,
        updatedBy: parseInt(this.userId$),
        updatedDate: this.Date,
        Isedit: true
      };
      this.packagetype = [newRow, ...this.packagetype];
      this.showAddRow = true;
    }

  }
  Save(obj: PackageType) {
    debugger
    if (obj.packageTypeCode != '' && 
        obj.packageTypeName != '') {
  this.PackagetypeService.addpackagetype(obj).
        pipe(
          catchError((error) => {
            Swal.fire({
              icon: 'info',
              title: 'info',
              text: 'Package Type already exists!',
              showConfirmButton: false,
              timer: 2000
            })
            throw error;
          })
        ).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Added Sucessfully',
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
        text: 'Please fill all the mandatory fields',
        showConfirmButton: false,
        timer: 2000
      })
      return true;
    }
  }

  
 
  Update(obj: any) {
    if (obj.packageTypeCode != '' && 
        obj.packageTypeName != '' 
        )  {
      obj.updatedBy=parseInt(this.userId$);
      this.PackagetypeService.updatepackagetype(obj).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Package Type is already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          throw error;
        })
      ).subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
        this.showAddRow = false;
      });
      return false;}
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
onDescriptionInput(event: Event, dataItem:PackageType ) {
  const inputValue = (event.target as HTMLInputElement).value;

  // Enforce the maximum character limit
  if (inputValue.length <= 500) {
    dataItem.description = inputValue;
  }
}
  oncancel(obj: any) {
    obj.Isedit = false;
    this.getlist();
    this.showAddRow = false;
  }

  Edit(obj: any) {
    this.packagetype.forEach(element => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }

  Delete(id: number) {
    debugger
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete the Package Type!..",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.PackagetypeService.deletepackagetype(id).pipe(
          catchError((error) => {
            Swal.fire({
              icon: "error",
              title: "Not able to delete",
              text: "The Package Type you are trying to delete is already in use. Do you want to in-active this Package Type ?",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                this.PackagetypeService.isActivePackagetype(id).subscribe((res) => {
                  if (res.message === "SUCCESS") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire(
                      "Success",
                      "Package Type has been in-activated sucessfully",
                      "success"
                    );
                  } else if (res.message === "In-Active") {
                    this.getlist();
                    this.showAddRow = false;
                    Swal.fire("Info", "Package Type is already in-active !", "info");
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
            'Package Type has been deleted',
            'success'
          )
        });

      }
    })
  }
  getlist() {
    this.PackagetypeService.getAllpackagetype().subscribe(result => {
      this.packagetype = result;
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
