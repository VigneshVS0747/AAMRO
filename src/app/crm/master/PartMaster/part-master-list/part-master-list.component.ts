import { Component, OnInit } from '@angular/core';
import { PartmasterService } from '../partmaster.service';
import { PartMaster } from 'src/app/Models/crm/master/partmaster';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { DescriptiondialogComponent } from 'src/app/dialog/description-dialog/descriptiondialog/descriptiondialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-part-master-list',
  templateUrl: './part-master-list.component.html',
  styleUrls: ['./part-master-list.component.css']
})
export class PartMasterListComponent implements OnInit {
  Livestatus=0;
  PartMaster:PartMaster[]=[];
  filter: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

constructor(private service:PartmasterService,
  private router: Router,
  private dialog: MatDialog,
  private store: Store<{ privileges: { privileges: any } }>){

}


  ngOnInit(): void {

    this.InitialiZPage();
    this.GetAllPartMaster();
   
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


  GetAllPartMaster(){

    this.service.GetAllPartMaster(this.Livestatus).subscribe(res=>{
      this.PartMaster =res;
    });

  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Part!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.service
          .DeletePartMaster(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The part you are trying to delete is already in use. Do you want to in-active this Part ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.service
                    .IsActivePartMaster(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.GetAllPartMaster();
                        Swal.fire(
                          "Success",
                          "Part has been in-activated sucessfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.GetAllPartMaster();
                        Swal.fire(
                          "Info",
                          "Department is already in-active !",
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
              this.GetAllPartMaster();
              Swal.fire("Deleted!", "Part has been deleted", "success");
            }
          });
      }
    });
  }

  onFilterChange(filter: any) {
    this.service.setFilterState(filter);
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
