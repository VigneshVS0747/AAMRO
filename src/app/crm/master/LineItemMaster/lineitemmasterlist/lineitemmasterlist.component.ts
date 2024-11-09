import { Component, OnInit } from '@angular/core';
import { LineitemmasterService } from '../line-item-master/lineitemmaster.service';
import { LineItemMaster } from 'src/app/Models/crm/master/LineItemMaster';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-lineitemmasterlist',
  templateUrl: './lineitemmasterlist.component.html',
  styleUrls: ['./lineitemmasterlist.component.css']
})
export class LineitemmasterlistComponent implements OnInit {

  Livestatus=0;
  filter: any;
  LineItemMaster:LineItemMaster [] = [];
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

  constructor( private service:LineitemmasterService,
    private router: Router,
    private commonService: CommonService,
    private store: Store<{ privileges: { privileges: any } }>){

  }
  ngOnInit(): void {
   this.GetLineItemMaster();
   this.InitialiZPage();
   
  }

  GetLineItemMaster() {
    this.service.GetAllLineItemMaster(this.Livestatus).subscribe({
      next: (res) => {
        this.LineItemMaster = res;
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

  delete(id:number){
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Line Item!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          this.service.DeleteLineItem(id).pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Line Item you are trying to delete is already in use. Do you want to in-active this Line Item ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.service.isActiveLineItem(id).subscribe((res) => {
                    if (res.message === "SUCCESS") {
                      Swal.fire(
                        "Success",
                        "Line Item has been in-activated sucessfully",
                        "success"
                      );
                      this.GetLineItemMaster();
                    } else if (res.message === "In-Active") {
                      this.GetLineItemMaster();
                      Swal.fire("Info", "Line Item is already in-active !", "info");
                    }
                  });
                }
              });
              return throwError(error); // Re-throw the error to propagate it to the subscriber
            })
          ).subscribe(res=>{
            Swal.fire(
              'Deleted!',
              'Line Item has been deleted',
              'success'
            )
          });
          this.GetLineItemMaster();
        }
      })
      .catch((err) => {
        console.log(err);
      });
      
  }
}
