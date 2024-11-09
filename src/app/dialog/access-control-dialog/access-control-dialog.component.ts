import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/services/common.service";
import { AuthorizationMatrix } from "src/app/ums/admin/user/user.model";
import {
  AccessControlTemplate,
  AccessControlTemplateMenus,
  DialogueAccessControls,
} from "src/app/ums/masters/access-control-template/act.model";

@Component({
  selector: "app-access-control-dialog",
  templateUrl: "./access-control-dialog.component.html",
  styleUrls: ["./access-control-dialog.component.css"],
})
export class AccessControlDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogueAccessControls,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AccessControlDialogComponent>
  ) {}
  selectedAccessControl!: AccessControlTemplate;
  isCreatedFlag: boolean = true;
  acts: AccessControlTemplate[] = [];
  ams: AuthorizationMatrix[] = [];
  selectedAuthorizationId!: number;
  Livestatus = 1;

  ngOnInit() {
    console.log("many models");

    this.initializeForm();
  }

  initializeForm() {
    console.log("data===>", this.data);
    this.commonService.getActs().subscribe((data) => {
      this.acts = data;
      this.dynamicInitialization();
    });

    this.commonService
      .getAuthorizationMatrix(this.Livestatus)
      .subscribe((data) => {
        this.ams = data;
      });
  }

  dynamicInitialization() {
    console.log("this.data====", this.data);
    if (!this.data) return;
    let selectedId = this.data.accessControlId;
    this.selectedAuthorizationId = this.data.selectedAuthorizationId;
    console.log("this.acts====", this.acts);
    let selectAccessControlId = this.acts.filter(
      (ele) => ele.accessControlId === selectedId
    );
    this.selectedAccessControl = selectAccessControlId[0];
    console.log("aaaaaaaaaaaaaaaaaaa====", selectAccessControlId);
    console.log("selectedId====", selectedId);
  }

  formSubmit() {
    let returnData = {
      selectedAccessControl: this.selectedAccessControl,
      selectedAuthorizationId: this.selectedAuthorizationId,
    };
    this.dialogRef.close(returnData);
  }
}
