import { Component, OnInit } from "@angular/core";
import { Authorizationmatrix } from "../../../Models/ums/authorizationmatrix.modal";
import { AuthmatlistService } from "../../../services/ums/authmatlist.service";
import { CommonService } from "src/app/services/common.service";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

@Component({
  selector: "app-authorizationmatrixlist",
  templateUrl: "./authorizationmatrixlist.component.html",
  styleUrls: [
    "./authorizationmatrixlist.component.css",
    "../../ums.styles.css",
  ],
})
export class AuthorizationmatrixlistComponent implements OnInit {
  Authmatrix: Authorizationmatrix[] = [];
  Livestaus = 0;
  filter: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private service: AuthmatlistService,
    private commonService: CommonService,
    private store: Store<{ privileges: { privileges: any } }>,
    private router: Router
  ) {}
  //IN THIS POPULATE DATA TO GRID//
  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.service.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.getAuthorizationMatrix();
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

  getAuthorizationMatrix() {
    this.service.GetAuthorizationmatrix(this.Livestaus).subscribe((result) => {
      this.Authmatrix = result;
      console.log(result);
    });
  }

  // deleteAuthorizationMatrix(id: number) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Delete the authorization matrix",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   })
  //     .then((result) => {
  //       console.log(result);
  //       if (result.isConfirmed) {
  //         this.service.DeleteAuthorizationmatrix(id).subscribe({
  //           next: (res: any) => {
  //             this.getAuthorizationMatrix();
  //             this.commonService.displayToaster(
  //               "success",
  //               "Success",
  //               "Authorization matrix has been deleted"
  //             );
  //           },
  //           error: (err) => {
  //             this.commonService.displayToaster(
  //               "error",
  //               "Error",
  //               "Something went wrong"
  //             );
  //           },
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  deleteAuthorizationMatrix(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Authorization Matrix!..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteAuthorizationmatrix(id)
          .pipe(
            catchError((error) => {
              Swal.fire({
                icon: "error",
                title: "Not able to delete",
                text: "The Authorization Matrix you are trying to delete is already in use. Do you want to in-active this currency ?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.service
                    .IsActiveAuthmatrix(id)
                    .subscribe((res) => {
                      if (res.message === "SUCCESS") {
                        Swal.fire(
                          "Success",
                          "Authorization Matrix has been in-activated successfully",
                          "success"
                        );
                        this.getAuthorizationMatrix();
                      } else if (res.message === "In-Active") {
                        Swal.fire(
                          "Info",
                          "Authorization Matrix is already in-active !",
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
              this.getAuthorizationMatrix();
              Swal.fire("Deleted!", "Authorization Matrix has been deleted", "success");
            }
          });
      }
    });
  }
}
