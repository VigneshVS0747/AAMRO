import { Component, OnInit } from '@angular/core';
import { StoragetypeService } from '../storagetype.service';
import { StorageType } from 'src/app/Models/crm/master/storagetype';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-storagetypelist',
  templateUrl: './storagetypelist.component.html',
  styleUrls: ['./storagetypelist.component.css']
})
export class StoragetypelistComponent implements OnInit {
  Livestatus=0;
  filter: any;
  StorageMaster:StorageType [] = [];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor(private service:StoragetypeService,
    private router: Router,
    private dialog: MatDialog,
    private commonService: CommonService,
    private store: Store<{ privileges: { privileges: any } }>){

  }
  ngOnInit(): void {
   this.GetStorageMaster();
   this.InitialiZPage();
  }

  GetStorageMaster() {
    this.service.GetAllStorageMaster(this.Livestatus).subscribe({
      next: (res) => {
        this.StorageMaster = res;
        console.log("LineItemMaster==>", res);
      },
      error: (error) => {
        console.log("error==>", error);  
      },
    });
  }
  onFilterChange(filter: any) {
    this.service.setFilterState(filter);
  }

  InitialiZPage(){
    this.service.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.store.select("privileges").subscribe({
      next: (res) => {
        console.log("this.pagePrivilege res===>", res);
        this.pagePrivilege = res.privileges[this.router.url.substring(1)];
        console.log("this.pagePrivilege ===>", this.pagePrivilege);
      },
    });
  }


  delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the StorageType!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteStorage(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The StorageType you are trying to delete is already in use. Do you want to in-active this department ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.service
                    .IsActive(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.GetStorageMaster();
                        Swal.fire(
                          "Success",
                          "StorageType has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.GetStorageMaster();     
                        Swal.fire(
                          "Info",
                          "StorageType is already in-active !",
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
              this.GetStorageMaster();
              Swal.fire("Deleted!", "StorageType has been deleted", "success");
            }
          });
      }
    });
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
