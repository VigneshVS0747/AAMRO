import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Activity } from "src/app/Models/ums/Activity.modal";
import { ApprovalconfigurationService } from "src/app/services/ums/approvalconfiguration.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-approval-configuration-list",
  templateUrl: "./approval-configuration-list.component.html",
  styleUrls: ["./approval-configuration-list.component.css"],
})
export class ApprovalConfigurationListComponent implements OnInit {
  ApprovalActivity: Activity[] = [];
  filter: any;
  pagePrivilege: Array<string>;
  //kendo pagination//
  sizes = [10,20, 50];
  buttonCount = 2
  pageSize =10;
  constructor(
    private service: ApprovalconfigurationService,
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
    this.service.GetAllApprovalActivity().subscribe((result) => {
      this.ApprovalActivity = result;
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
        text: "Delete the Approvals!..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.DeleteApprovalsBySubmenuid(id).subscribe((res) => {
            Swal.fire("Deleted!", "Approval has been deleted.", "success");
            this.service.GetAllApprovalActivity().subscribe((result) => {
              this.ApprovalActivity = result;
            });
          });
        }
      });
    }
  }
}
