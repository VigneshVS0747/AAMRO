import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/services/common.service";
import { AuthorizationMatrix } from "src/app/ums/admin/user/user.model";

@Component({
  selector: "app-authorization-matrix-dialog",
  templateUrl: "./authorization-matrix-dialog.component.html",
  styleUrls: ["./authorization-matrix-dialog.component.css"],
})
export class AuthorizationMatrixDialogComponent {
  selectedAuthorizationId!: number;
  ams: AuthorizationMatrix[] = [];
  isReadOnly: boolean = false;
  Livestatus=1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AuthorizationMatrixDialogComponent>
  ) {}

  ngOnInit() {
    /*const removedAuthorizationId = this.data.removed;*/
    this.isReadOnly = this.data.isReadOnly;
    // console.log("this.isReadOnly", this.isReadOnly  );

    this.selectedAuthorizationId =
      this.data.selectedAuthorizationId; /*.selected;*/
    //alert(removedAuthorizationId + ":" + this.selectedAuthorizationId);
    console.log("this.data--->", this.data);

    this.commonService.getAuthorizationMatrix(this.Livestatus).subscribe((data) => {
      console.log("data ====>", data);
      this.ams = data; //data.filter((item) => item.authorizationMatrixID !== removedAuthorizationId);
    });
  }
}
