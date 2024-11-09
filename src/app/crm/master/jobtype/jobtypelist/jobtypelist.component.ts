import { Component } from '@angular/core';
import { JobtypeserviceService } from '../jobtypeservice.service';
import { JobTypeGeneral } from '../jobtypemodel.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-jobtypelist',
  templateUrl: './jobtypelist.component.html',
  styleUrls: ['./jobtypelist.component.css']
})
export class JobtypelistComponent {
  //kendo pagination//
  sizes = [10, 20, 50];
  buttonCount = 2
  pageSize = 10;

constructor( private jobTypeService: JobtypeserviceService,
  private store: Store<{ privileges: { privileges: any } }>, 
  private router: Router){}
jobTypeGeneral: JobTypeGeneral[]=[]
filter: any;
pagePrivilege: Array<string>;

ngOnInit(){
this.getAllJobType(); 
}

getAllJobType(){
  this.jobTypeService.getAllJobTypes().subscribe(result=>{
  this.jobTypeGeneral=result;
  });
  this.store.select("privileges").subscribe({
    next: (res) => {
      console.log("this.pagePrivilege res===>", res);
      this.pagePrivilege = res.privileges[this.router.url.substring(1)];
      console.log("this.pagePrivilege ===>", this.pagePrivilege);
    },
  });
}

onFilterChange(filter: any) {
  this.jobTypeService.setFilterState(filter);
}
onview(item: any){
  if(item){
    this.jobTypeService.isView=true;
    this.jobTypeService.isEdit=false;
    this.jobTypeService.setItemId(item.jobTypeId);
    this.router.navigate(["/crm/master/jobtype/create"]);
  }
}
 add(){
  this.router.navigate(["/crm/master/jobtype/create"]);
  this.jobTypeService.isView=false;
  this.jobTypeService.isEdit=false;
  this.jobTypeService.setItemId(0)
 }
 onEdit(item: any){
  this.jobTypeService.setItemId(item.jobTypeId);
  this.jobTypeService.isEdit=true;
  this.jobTypeService.isView=false;
  this.router.navigate(['/crm/master/jobtype/create']);
}
// onDelete(item: any){
// this.jobTypeService.GeneralDelete(item.jobTypeId).subscribe(res=>{
//   Swal.fire({
//     icon: "success",
//     title: "Success",
//     text: "Deleted Sucessfully",
//     showConfirmButton: false,
//     timer: 2000,
//   });
//   this.getAllJobType();
// });
// }

onDelete(item: any)
{
  Swal.fire({
    title: 'Are you sure?',
    text: "Delete the Job Type!..",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.jobTypeService.GeneralDelete(item.jobTypeId).pipe(
        catchError((error) => {
          Swal.fire({
            icon: "error",
            title: "Not able to delete",
            text: "The Job Type you are trying to delete is already in use. Do you want to in-active this Job Type ?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
          }).then((result) => {
            if (result.isConfirmed) {
              this.jobTypeService.isActiveJobType(item.jobTypeId).subscribe((res) => {
                if (res.message === "SUCCESS") {
                  this.getAllJobType();
                  Swal.fire(
                    "Success",
                    "Job Type has been in-activated sucessfully",
                    "success"
                  );
                } else if (res.message === "In-Active") {
                  this.getAllJobType();
                  Swal.fire("Info", "Job Type is already in-active !", "info");
                }
              });
            }
          });
          return throwError(error); // Re-throw the error to propagate it to the subscriber
        })
      ).subscribe((res) => {
        this.getAllJobType();
        Swal.fire(
          'Deleted!',
          'Job Type has been Deleted.',
          'success'
        )
      });

    }
  })
}
}
