import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { catchError } from "rxjs";
import { notificationconfiguration } from "src/app/Models/ums/notificationconfiguration.modal";
import { NofificationconfigurationService } from "src/app/services/ums/nofificationconfiguration.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-notificationconfigurationlist",
  templateUrl: "./notificationconfigurationlist.component.html",
  styleUrls: ["./notificationconfigurationlist.component.css"],
})
export class NotificationconfigurationlistComponent implements OnInit {
  NotificationActivity: notificationconfiguration[] = [];
  filter: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private service: NofificationconfigurationService,
    private router: Router,
    private store: Store<{ privileges: { privileges: any } }>
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.service.getFilterState().subscribe((filter) => {
      this.filter = filter;
    });
    this.service.GetAllNotificationActivity().subscribe((result) => {
      this.NotificationActivity = result;
      console.log("NotificationActivity", result);
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

  onDelete(id: number) {
    if(id!=null){
      Swal.fire({
        title: "Are you sure?",
        text: "Delete the Activity!..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.DeleteActivity(id).subscribe((res) => {
            Swal.fire("Deleted!", "Activity has been deleted.", "success");
            this.service.GetAllNotificationActivity().subscribe((result) => {
              this.NotificationActivity = result;
            });
          });
        }
      });
    }
  }

}
