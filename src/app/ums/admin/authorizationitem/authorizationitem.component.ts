import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthorizationItem } from "../../../Models/ums/authorizationitem.model";
import { AuthorizationitemService } from "../../../services/ums/authorizationitem.service";
import { Brand } from "src/app/Models/ums/brand.modal";
import { jobtype } from "src/app/Models/ums/Jobtype.modal";
import { Branch } from "../../masters/branch/branch.model";
import { customer } from "src/app/Models/ums/customer.modal";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
@Component({
  selector: "app-authorizationitem",
  templateUrl: "./authorizationitem.component.html",
  styleUrls: ["./authorizationitem.component.css", "../../ums.styles.css"],
})
export class AuthorizationitemComponent implements OnInit {
  gridData: any[] = [];
  authmatrix: AuthorizationItem[] = [];
  newRow: Branch[] = [];
  jobtype: jobtype[] = [];
  Brand: Brand[] = [];
  newcust: customer[] = [];
  showAddRow: boolean | undefined;
  Date = new Date();
  Livestatus = 0;
  filter: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private FB: FormBuilder,
    private router: Router,
    private service: AuthorizationitemService,
    private route: ActivatedRoute,
    private store: Store<{ privileges: { privileges: any } }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.service.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.service.GetAuthorizationitems(this.Livestatus).subscribe((result) => {
      this.gridData = result;
    });

    this.authmatrix.push();
    this.service.Getbranch().subscribe((result) => {
      this.newRow = result;
    });

    this.service.Getcustomer().subscribe((result) => {
      this.newcust = result;
    });

    this.service.Getjobtype().subscribe((resp) => {
      this.jobtype = resp;
    });

    this.service.Getbrand().subscribe((resp) => {
      this.Brand = resp;
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
    this.service.setFilterState(filter);
  }
  // add(){

  //   this.router.navigate(['/ums/branch/create']);
  // }

  Save(obj: any) {
    console.log(obj);
    this.service
      .createAuthoriazationitem(obj)
      .pipe(
        catchError((error) => {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Authorization Item already exists!",
            showConfirmButton: false,
            timer: 2000,
          });
          window.location.reload();
          throw error;
        })
      )
      .subscribe((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getlist();
      });
  }

  Update(obj: any) {
    console.log(obj);
    this.service.UpdateAuthorizationitem(obj).subscribe((response) => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Updated Successfully",
        showConfirmButton: false,
        timer: 2000,
      });
      this.getlist();
    });
  }
  oncancel(obj: any) {
    obj.Isedit = false;
    setTimeout(function () {
      window.location.reload();
    }, 5);
  }

  Edit(obj: any) {
    this.gridData.forEach((element) => {
      element.Isedit = false;
    });
    obj.Isedit = true;
  }

  Delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Authorization Item!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.service
          .DeleteAuthorizationitembyId(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Authorization Item you are trying to delete is referred. Do you want to in-active this authorization item ? ",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log("Yes");
                  this.service
                    .IsActiveAuthorizationitembyId(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Success",
                          "Authorization Item has been in-activated successfully",
                          "success"
                        );
                      } else if (res.message === "In-Active") {
                        this.getlist();
                        this.showAddRow = false;
                        Swal.fire(
                          "Info",
                          "Authorization Item is already in-active !",
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
              Swal.fire(
                "Deleted!",
                "Authorization Item has been deleted",
                "success"
              );
            }
          });
      }
    });
  }
  getlist() {
    this.service.GetAuthorizationitems(this.Livestatus).subscribe((result) => {
      this.gridData = result;
    });
  }
}
