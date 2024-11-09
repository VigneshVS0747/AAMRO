import { Component, ElementRef, numberAttribute, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { Menus } from "src/app/Models/ums/menus.modal";
import { NofificationconfigurationService } from "src/app/services/ums/nofificationconfiguration.service";
import { ActService } from "../../masters/access-control-template/act.service";

import { CommonService } from "src/app/services/common.service";
import { Employee } from "../../masters/employee/employee.model";
import { ApprovalFilter } from "src/app/Models/ums/Approvalfilter.modal";
import { AuthorizationItem } from "src/app/Models/ums/authorizationitem.model";
import {
  Approvals,
  Approvalslist,
  Escalation,
} from "src/app/Models/ums/Approval.modal";
import { MatSelectChange } from "@angular/material/select";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Activity } from "src/app/Models/ums/Activity.modal";
import { ApprovalconfigurationService } from "src/app/services/ums/approvalconfiguration.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-approval-configuration",
  templateUrl: "./approval-configuration.component.html",
  styleUrls: ["./approval-configuration.component.css", "../../ums.styles.css"],
})
export class ApprovalConfigurationComponent implements OnInit {
  @ViewChild("exampleModal1") exampleModal1!: ElementRef;
  @ViewChild("ApprovalEntries") ApprovalEntries!: ElementRef;
  @ViewChild("ApprovalTable") ApprovalTable!: ElementRef;
  @ViewChild("EscalationPopup") EscalationPopup!: ElementRef;
  @ViewChild("EscalationEntries") EscalationEntries!: ElementRef;
  @ViewChild("EscalationButton") EscalationButton!: ElementRef;
  @ViewChild("EscalationPopuptrigger") EscalationPopuptrigger!: ElementRef;
  @ViewChild("ApprovalClick") ApprovalClick!: ElementRef;
  @ViewChild("EscalationEnriespopup") EscalationEnriespopup!: ElementRef;
  ApprovalFilter!: FormGroup;
  Approval!: FormGroup;
  Escalation!: FormGroup;
  ModuleName: Menus[] = [];
  MenuHeader: Menus[] = [];
  SubMenu: Menus[] = [];
  SelectedItems: number[] = [];
  Employees: Employee[] = [];
  ApprovalData: any[] = [];
  AuthorizationItemname: any[] = [];
  ApprovalFilterData: ApprovalFilter[] = [];
  EscalationData: any[] = [];
  EscalationByIndex: any[] = [];
  selectedModule: number | undefined;
  selectedMenuHeaders = new FormControl([]);
  selectedsubMenuHeaders = new FormControl([]);
  SelectAll!: boolean;
  IndexofApprovals!: number;
  IndexofApprovalEdit!: any;
  SelectedOptions: number[] = [];
  IndexofEscalationEdit!: any;
  Activity: Activity[] = [];
  SelectedActivity!: number;
  ApprovalId!: number;
  levelIdforEscalation!: number;
  Escalationfileterdata: any[] = [];
  Escalationfileterdata2: any[] = [];
  selectedIndex: number = -1;
  moduleId!: number;
  menuheaderId!: number;
  subMenuId!: number;
  activityId!: number;
  isByLevel!: boolean;
  livestatus!: boolean;
  Form1!: boolean;
  Form2!: boolean;
  showsave!: boolean;
  showupdate!: boolean;
  showreset!: boolean;
  disablefields: boolean = false;
  add: string;
  Livestaus = 1;
  escalationID: number;
  escalationId: number;
  EditedApprovals:any;
  showescalation:boolean = false;
  approvalId: number;
  disable: boolean;
  editedescalation:any;
  selectedEmployee: any[]=[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private Approvalservice: ApprovalconfigurationService,
    private FB: FormBuilder,
    private commonService: CommonService,
    private service: NofificationconfigurationService,
    private actService: ActService
  ) {}
  ngOnInit(): void {
    this.Form1 = true;
    this.Form2 = false;
    this.showsave = true;
    this.showupdate = false;
    this.showreset = true;
    //**Load Modules**//
    this.Modules();
    //**Load Employees**//
    this.getemployees();
    //**FormBuilder Declarations**//
    this.ApprovalFilterFromControl();
    this.ApprovalFromControl();
    this.EscalationFormControl();
    //**Load AuthorizationItems**//
    this.AuthorizationItems();

    //** Edit Mode **//
    this.EditMode();

    //** View Mode **//
    this.ViewMode();
  }

  EditMode(){
    
    if(this.router.url =="/ums/activity/approvalconfiguration/edit/"+this.route.snapshot.params['id']){
      const ActivityId=this.route.snapshot.params['id'];
      if(ActivityId!=null){
        this.Form1=false;
        this.Form2=true;
        this.showsave=false;
        this.showupdate=true;
        this.showreset=true;
        this.disablefields=false;
        this.disable=false;
        this.Approvalservice.GetApprovalsByActivityId(ActivityId).subscribe(result=>{
          this.ApprovalData=result;
          console.log("Approvaldata00000",result);
  
          this.ApprovalData = this.ApprovalData.map(item => {
            return {
              ...item,
              userId: item.userId.split(',').map((id: string | number) => +id)
            };
          });
          console.log("Approvaldata...................>",this.ApprovalData);
          if(this.ApprovalData.length > 0){
            
          }
        });
  
        this.Approvalservice.GetHeaderByActivityId(ActivityId).subscribe(result=>{
          console.log("resultheader",result);
          this.moduleId = result.moduleId;
          this.menuheaderId = result.menuheaderId;
          this.subMenuId=result.subMenuId;
          this.approvalId = result.approvalId
          //this.=result.subMenuId;
          this.isByLevel =result.isByLevel;
          this.livestatus=result.livestatus;
  
          this.selectmodule(result.moduleId);
          
          this.selectsubmenu(result.menuheaderId);
          //this.selectactivity(result.menuheaderId,result.subMenuId);
  
          const approvalId = result.approvalId;
          console.log('Approval ID:', approvalId);
          this.ApprovalId=approvalId;
        });
  
      }
  
    }
    
  }
  ViewMode() {
    if (
      this.router.url ==
      "/ums/activity/approvalconfiguration/view/" + this.route.snapshot.params["id"]
    ) {
      const ActivityId = this.route.snapshot.params["id"];
      if (ActivityId != null) {
        this.Form1 = false;
        this.Form2 = true;
        this.showsave = false;
        this.showupdate = false;
        this.showreset = false;
        this.disablefields = true;
        this.disable=true;
        this.Approvalservice.GetApprovalsByActivityId(ActivityId).subscribe(
          (result) => {
            this.ApprovalData = result;
            console.log("Approvaldata", result);

            this.ApprovalData = this.ApprovalData.map((item) => {
              return {
                ...item,
                userId: item.userId
                  .split(",")
                  .map((id: string | number) => +id),
              };
            });
            console.log("Approvaldata", this.ApprovalData);
          }
        );

        this.Approvalservice.GetHeaderByActivityId(ActivityId).subscribe(
          (result) => {
            console.log("GetHeaderByActivityId------->", result);
            this.moduleId = result.moduleId;
            this.menuheaderId = result.menuheaderId;
            this.subMenuId = result.subMenuId;
            this.approvalId = result.approvalId
            //this.activityId = result.activityId;
            this.isByLevel = result.isByLevel;
            this.livestatus = result.livestatus;

            this.selectmodule(result.moduleId);

            this.selectsubmenu(result.menuheaderId);
            this.selectactivity(result.menuheaderId, result.subMenuId);

            const approvalId = result.approvalId;
            console.log("Approval ID:", approvalId);
            this.ApprovalId = approvalId;
          }
        );
      }
    }
  }
  selectmodule(moduleId: number) {
    this.service.Getmenuheaderbyid(moduleId).subscribe((result) => {
      this.MenuHeader = result;
    });
  }
  selectsubmenu(submenuid: number) {
    const Value = submenuid;
    const auth = {
      headerid: [Value],
      submenuid: [0],
    };
    this.actService.Getsubmenubyid(auth).subscribe((result) => {
      this.SubMenu = result;
    });
  }
  selectactivity(headerid: number, submenu: number) {
    const value = headerid;
          const value2 = submenu;
          const auth = {
            headerid:[value],
            submenuid: [value2],
          };
          console.log("auth------>",auth);
          this.service.GetActivitybyheaderidForApprovals(auth).subscribe(result => {
            this.Activity = result;
            console.log("Activitydropdown------>",result);
          });
  }
  Modules() {
    this.service.GetAllModules().subscribe((result) => {
      this.ModuleName = result;
    });
  }
  OnChangeModule(event: MatSelectChange) {
    const MenuHeaderId = event.value;
    this.selectedModule = MenuHeaderId;
    this.service.Getmenuheaderbyid(MenuHeaderId).subscribe((result) => {
      this.MenuHeader = result;
    });
  }
  onchangeheader() {
    const Value = this.selectedMenuHeaders.value;
    const auth = {
      headerid: [Value],
      submenuid: [0],
    };
    this.actService.Getsubmenubyid(auth).subscribe((result) => {
      this.SubMenu = result;
    });
  }
  selectAllOptions(event: MatCheckboxChange) {
    this.SelectAll = event.checked;
    if (event.checked) {
      this.SelectedItems = this.SubMenu.map((option) => option.menuId);
    } else {
      this.SelectedItems = [];
    }
  }
  getemployees() {
    this.commonService.getEmployees(this.Livestaus).subscribe((result) => {
      this.Employees = result;
      console.log("Employee==>", result);
    });
  }
  ApprovalFilterFromControl() {
    this.ApprovalFilter = this.FB.group({
      approvalId: [0],
      isByLevel: [false, Validators.required],
      livestatus: [true, Validators.required],
      subMenuId: ["", Validators.required],
      createdBy: [1],
      UpdatedBy: [0],
    });
  }
  ApprovalFromControl() {
    this.Approval = this.FB.group({
      levelId:[0],
      levelNumber:[this.ApprovalData.length+1,Validators.required],
      authorizationItemId:['',Validators.required],
      isReportingManager:[false,Validators.required],
      noOfApproval:['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      noOfRejection:['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      userId:['',Validators.required],
      createdBy:[1],
      UpdatedBy:[0]
    })
  }
  EscalationFormControl() {
    this.Escalation = this.FB.group({
      escalationID: [0],
      sequenceOrder: [this.EscalationData.length + 1, Validators.required],
      userId: ["", Validators.required],
      escalationDuration: ["", Validators.required],
      frequency: ["", Validators.required],
      isReportingManager: [false],
      isNotifytoRoute: [false],
      createdBy: [1],
      UpdatedBy: [0],
    });
  }
  AddtoiLstApprovalFilter() {
    this.ApprovalFilterData.push(this.ApprovalFilter.value);
    this.exampleModal1.nativeElement.click();
  }
  AuthorizationItems(){
    this.service.GetAuthorizationitem(this.Livestaus).subscribe(result=>{
      this.AuthorizationItemname = result

      console.log("AuthorizationItemname----------------------->",result)
     })
  }
  onSelectionChange(data: MatSelectChange) {
    this.SelectedOptions.push(data.value);

    // const isItemExists = this.ApprovalData.some(item => item.authorizationItemId === data.value);

    // if (isItemExists) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Duplicate",
    //     text: "Please choose Another ",
    //     confirmButtonColor: "#007dbd",
    //     showConfirmButton: true,
    //   })
    //   this.Approval.get('authorizationItemId')?.setValue('');
    // }

    // return isItemExists;
  }
  getSelectedModule(selectedIds: number): string {
    const selectedModule = this.ModuleName.filter(
      (module) => module.menuId === selectedIds
    );
    return selectedModule.map((module) => module.menuName).join(", ");
  }
  getSelectedMenuname(selectedIds: number): string {
    const selectedModule = this.SubMenu.filter(
      (module) => module.menuId === selectedIds
    );
    return selectedModule.map((module) => module.menuName).join(", ");
  }
  getSelectedEmployeeNames(selectedIds: number[]): string {
    const selectedEmployees = this.Employees.filter((employee) =>
      selectedIds.includes(employee.employeeId)
    );
    return selectedEmployees
      .map((employee) => employee.employeeName)
      .join(", ");
  }
  getSelectedAuthorizationItemName(selectedId: number): string {
    const selectedAuthItem = this.AuthorizationItemname.find(
      (item) => item.authorizationItemID === selectedId
    );
    return selectedAuthItem ? selectedAuthItem.authorizationItemName : "";
  }
  AddApprovals() {
    if (this.Approval.valid) {
      if (this.route.snapshot.params["id"] != null) {
        if (this.IndexofApprovalEdit != null) {
          const notificationvalue = {
            approvalId: this.ApprovalId,
            ...this.Approval.value,
          };
          this.ApprovalData.splice(
            this.IndexofApprovalEdit,
            0,
            notificationvalue
          );
          if(this.escalationId!=null){
            this.selectedIndex = this.IndexofApprovalEdit;
          }
          this.Approval.reset();
          this.ApprovalEntries.nativeElement.click();
          this.ApprovalTable.nativeElement.click();
        } else {
          const notificationvalue = {
            approvalId: this.ApprovalId,
            ...this.Approval.value,
          };
          if(this.escalationId!=null){
            this.selectedIndex = this.IndexofApprovalEdit;
          }
          this.ApprovalData.push(notificationvalue);
          this.Approval.reset();
          this.IndexofApprovalEdit = null;
          this.ApprovalEntries.nativeElement.click();
          this.ApprovalTable.nativeElement.click();
        }
      } else {
        if (this.IndexofApprovalEdit != null) {
          const notificationvalue = {
            approvalId: this.ApprovalId,
            createdBy: 1,
            updatedBy: 0,
            ...this.Approval.value,
          };
          this.ApprovalData.splice(
            this.IndexofApprovalEdit,
            0,
            notificationvalue
          );
          this.Approval.reset();
          this.IndexofApprovalEdit = null;
          this.ApprovalEntries.nativeElement.click();
          this.ApprovalTable.nativeElement.click();
        } else {
          const notificationvalue = {
            approvalId: this.ApprovalId,
            ...this.Approval.value,
          };
          this.ApprovalData.push(notificationvalue);
          this.Approval.reset();
          this.IndexofApprovalEdit = null;
          this.ApprovalEntries.nativeElement.click();
          this.ApprovalTable.nativeElement.click();
        }
      }
    } else {
      this.Approval.markAllAsTouched();
      this.validateall(this.Approval);
    }
  }
  private validateall(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateall(control);
      }
    });
  }
  Addescalation() {
    if (this.Escalation.valid) {
      if (this.route.snapshot.params["id"]) {
        if(this.IndexofEscalationEdit!=null){
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 1,
            levelId: this.levelIdforEscalation,
            ...this.Escalation.value,
          };
          this.EscalationData.splice(this.IndexofEscalationEdit, 0, Escalationvalue);
        }else{
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 1,
            levelId: this.levelIdforEscalation,
            ...this.Escalation.value,
          };
          this.EscalationData.push(Escalationvalue);
        }
        this.EscalationEntries.nativeElement.click();
        this.EscalationPopuptrigger.nativeElement.click();
      } else {
        if (this.IndexofEscalationEdit != null) {
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 0,
            ...this.Escalation.value,
          };
          this.EscalationData.splice(
            this.IndexofEscalationEdit,
            0,
            Escalationvalue
          );
          this.Escalation.reset();
          this.IndexofEscalationEdit= null
          this.EscalationEntries.nativeElement.click();
          this.EscalationPopuptrigger.nativeElement.click();
        } else {
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 0,
            ...this.Escalation.value,
          };
          this.EscalationData.push(Escalationvalue);
          this.Escalation.reset();
          this.IndexofEscalationEdit= null
          this.EscalationEntries.nativeElement.click();
          this.EscalationPopuptrigger.nativeElement.click();
        }
      }
    } else {
      this.Escalation.markAllAsTouched();
      this.validateall(this.Escalation);
    }
  }

  AddEscalationDetails() {
    this.EscalationFormControl();
  }
  AddtoApproval() {
    this.showescalation = true;
    if (this.EscalationData.length > 0) {
      this.EscalationByIndex[this.IndexofApprovals]=[];
      this.EscalationByIndex[this.IndexofApprovals].push(...this.EscalationData);
      this.Escalation.reset();
      this.selectedIndex = this.IndexofApprovals;
    }else {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Please add atleast one Escalation...!",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }
    
    this.ApprovalTable.nativeElement.click();
  }
 
  AddtoMainApproval() {
    this.ApprovalTable.nativeElement.click();
  }
  AddApprovalEntries() {
    if (this.route.snapshot.params["id"]) {
      this.ApprovalFromControl();
      this.ApprovalClick.nativeElement.click();
    } else {
      if (this.SelectedActivity != null) {
        this.ApprovalFromControl();
        this.ApprovalClick.nativeElement.click();
      } else {
        Swal.fire({
          icon: "error",
          title: "Select Submenu",
          text: "Please select at least one submenu",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
        this.ApprovalFilter.markAllAsTouched();
        this.validateall(this.ApprovalFilter);
      }
    }
  }
  ShowEscalation(i: number, levelid: number) {
    this.IndexofApprovals = i;
    this.levelIdforEscalation = levelid;
    while (this.EscalationByIndex.length <= i) {
      this.EscalationByIndex.push([]);
    }
    if (this.EscalationByIndex[i]) {
      const EscalationByindex = this.EscalationByIndex[i];
      if(EscalationByindex.length==0 && levelid == null ){
        this.EscalationData = EscalationByindex;
      }else if(EscalationByindex.length==0){
        this.Approvalservice.GetEscalationByLevelId(levelid).subscribe(
          (result) => {
            this.EscalationData = result;
            this.EscalationData = this.EscalationData.map((item) => {
              return {
                ...item,
                userId: item.userId.split(",").map((id: string | number) => +id),
                createdBy: item.createdBy,
                updatedBy: item.updatedBy,
              };
            });
          }
        );
      }else{
        this.EscalationData = EscalationByindex;
      }
      
    }
     
    if (levelid != null && this.showescalation == false ) { 
      this.Approvalservice.GetEscalationByLevelId(levelid).subscribe(
        (result) => {
          this.EscalationData = result;
          this.EscalationData = this.EscalationData.map((item) => {
            return {
              ...item,
              userId: item.userId.split(",").map((id: string | number) => +id),
              createdBy: item.createdBy,
              updatedBy: item.updatedBy,
            };
          });
        }
      );
    }
  }


  SaveApprovals() {
    if (this.ApprovalData.length > 0) {
      const ApprovalApiCall = {
        approvalHeader: this.ApprovalFilter.value,
        approvalConfigurations: this.ApprovalData,
        escalationConfigurations: this.EscalationByIndex,
      };
      console.log("ApprovalApiCall", ApprovalApiCall);
  
      this.Approvalservice.CreateApprovals(ApprovalApiCall).subscribe({
        next: (res) => {
          if (res.message == "SUCCESS") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Saved Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.ApprovalFilter.reset();
            this.Approval.reset();
            this.Escalation.reset();
            this.ApprovalData = [];
            this.EscalationData = [];
            this.router.navigate(["/ums/activity/approvalconfiguration"]);
          }
        },
        error: (error) => {
          console.log("error==>", error);
  
          if (error.error.ErrorDetails.includes("UNIQUE KEY")) {
            this.commonService.displayToaster(
              "error",
              "Error",
              "The menu has already mapped!!!"
            );
          }
        },
      });
    }
    else{
      Swal.fire({
        icon: "error",
        title: "error",
        text: "please add atleast one approvals...",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    
  }
  Update() {
    if (this.ApprovalData.length > 0) {
      const appheader={
        ...this.ApprovalFilter.value,
        subMenuId:this.subMenuId,
        approvalId:this.approvalId,
        isByLevel:this.isByLevel,
        livestatus:this.livestatus
      }
  
      const ApprovalUpadte = {
        approvalHeader: appheader,
        approvalConfigurations: this.ApprovalData.map((item) => ({
          ...item,
          createdBy: 1,
          updatedBy: 1,
        })),
        escalationConfigurations:this.EscalationByIndex,
      };
      console.log("ApprovalUpadte----------->", ApprovalUpadte);
      
      this.Approvalservice.CreateApprovals(ApprovalUpadte).subscribe({
        next: (res) => {
          if (res.message == "SUCCESS") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Updated Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            this.ApprovalFilter.reset();
            this.Approval.reset();
            this.Escalation.reset();
            this.ApprovalData = [];
            this.EscalationData = [];
            this.router.navigate(["/ums/activity/approvalconfiguration"]);
          }
        },
        error: (error) => {
          console.log("error==>", error);
          if (error.error.ErrorDetails.includes("UNIQUE KEY")) {
            this.commonService.displayToaster(
              "error",
              "Error",
              "The menu has already mapped!!!"
            );
          }
        },
      });
    }   

  }
  isDuplicate(item: any, array: any) {
    return array.includes(item);
  }

  EditApprovals(i: number, item: Approvals, levelid: number) {
    this.EditedApprovals=item;
    this.IndexofApprovalEdit = i;
    if (levelid != null) {
      this.ApprovalData.splice(i, 1);
      this.escalationId=item.escalationID,
      this.Approval = this.FB.group({
        
        levelId:[item.levelId],
        approvalId:[item.approvalId],
        levelNumber:[item.levelNumber,Validators.required],
        authorizationItemId:[item.authorizationItemId,Validators.required],
        isReportingManager:[item.isReportingManager,Validators.required],
        noOfApproval:[item.noOfApproval,[Validators.required, Validators.pattern('^[0-9]+$')]],
        noOfRejection:[item.noOfRejection,[Validators.required, Validators.pattern('^[0-9]+$')]],
        userId:[item.userId,Validators.required],
      })

    }else{
      if(i!=null){
        this.ApprovalData.splice(i, 1);
        this.escalationId=item.escalationID,
        this.Approval = this.FB.group({
          levelNumber:[item.levelNumber,Validators.required],
          authorizationItemId:[item.authorizationItemId,Validators.required],
          isReportingManager:[item.isReportingManager,Validators.required],
          noOfApproval:[item.noOfApproval,[Validators.required, Validators.pattern('^[0-9]+$')]],
          noOfRejection:[item.noOfRejection,[Validators.required, Validators.pattern('^[0-9]+$')]],
          userId:[item.userId,Validators.required],
        })
      }
    }
  }
  EditEscalation(i: number, item: Escalation) {
    this.editedescalation=item;
    this.IndexofEscalationEdit = i;
    if (item.escalationID != 0) {
      this.EscalationPopup.nativeElement.click();
      this.EscalationData.splice(i, 1);
      this.Escalation = this.FB.group({
        
        escalationID: [item.escalationID],
        sequenceOrder: [item.sequenceOrder, Validators.required],
        userId: [item.userId, Validators.required],
        escalationDuration: [item.escalationDuration, Validators.required],
        frequency: [item.frequency, Validators.required],
        isReportingManager: [item.isReportingManager],
        isNotifytoRoute: [item.isNotifytoRoute],
      });
    } else {
      if (i != null) {
        this.EscalationPopup.nativeElement.click();
        this.EscalationData.splice(i, 1);
        this.Escalation = this.FB.group({
          escalationID: [item.escalationID],
          sequenceOrder: [item.sequenceOrder, Validators.required],
          userId: [item.userId, Validators.required],
          escalationDuration: [item.escalationDuration, Validators.required],
          frequency: [item.frequency, Validators.required],
          isReportingManager: [item.isReportingManager],
          isNotifytoRoute: [item.isNotifytoRoute],
        });
      }
    }


   }
   onSelectionsubmenu(event:MatSelectChange){
          const value = this.selectedMenuHeaders.value;
          const value2 = event.value;
          const auth = {
            headerid:[value],
            submenuid: [value2],
          };
          this.service.GetActivitybyheaderidForApprovals(auth).subscribe(result => {
            this.Activity = result;
            console.log("Activity",result);
          });
   }
   onSelectionsubmenuid(event:MatSelectChange){
    this.SelectedActivity=event.value;

   }

  DeleteApprovals(i: number, levelid: number) {
      if (levelid != null) {
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
            this.Approvalservice.DeleteApprovals(levelid).subscribe((res) => {
              Swal.fire("Deleted!", "Approval has been deleted.", "success");
            });
            this.ApprovalData.splice(i, 1);
            for (let j = i; j < this.ApprovalData.length; j++) {
              this.ApprovalData[j].levelNumber--; // Decrease levelid by 1
            }
            
          }
        });
      }else{
        this.ApprovalData.splice(i, 1);
        this.EscalationByIndex.splice(i, 1);
        for (let j = i; j < this.ApprovalData.length; j++) {
          this.ApprovalData[j].levelNumber--; // Decrease levelid by 1
        }
      }
  }
  DeleteEscalation(i: number, EscalationID: number) {
      if (EscalationID != 0) {
        Swal.fire({
          title: "Are you sure?",
          text: "Delete the Escalation!..",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.Approvalservice.DeleteEscalationApprovals(
              EscalationID
            ).subscribe((res) => {
              Swal.fire("Deleted!", "Escalation has been deleted.", "success");
            });
            this.EscalationData.splice(i, 1);
            for (let j = i; j < this.EscalationData.length; j++) {
              this.EscalationData[j].sequenceOrder--; // Decrease levelid by 1
            }
          }
        });
      }
     else {
       this.EscalationData.splice(i, 1);
        for (let j = i; j < this.EscalationData.length; j++) {
          this.EscalationData[j].sequenceOrder--; // Decrease levelid by 1
        }  
    }
  }
  reset(){
    window.location.reload();
  }
 
  onInputNoOfApproval(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
    this.Approval.controls['noOfApproval'].setValue(input.value);
}
onInputNoOfRejection(event: any): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
        this.Approval.controls['noOfRejection'].setValue(input.value);
    }

    Close(){
      if(this.IndexofApprovalEdit !=-1 && this.EditedApprovals !=null){
        this.ApprovalData.splice(this.IndexofApprovalEdit, 0, this.EditedApprovals);
  
        this.IndexofApprovalEdit='',
        this.EditedApprovals=null;
      }
    }
    cancel(){
      this.Close();
    }
  
     CancelEscalation(){
      if(this.IndexofEscalationEdit !=-1 && this.editedescalation !=null){
        this.EscalationData.splice(this.IndexofEscalationEdit, 0, this.editedescalation);
  
        this.IndexofEscalationEdit =-1;
        this.editedescalation=null;
        this.EscalationEntries.nativeElement.click();
        this.EscalationPopuptrigger.nativeElement.click();
      }  
    }
  
    closeEscaltion(){
      this.CancelEscalation();
    }

    selctedemployee(event:any){
      // var Userid = this.Approval.get("userId")?.value.length;
      // var apps = this.Approval.get("noOfApproval")?.value;
      // if( Userid <= parseInt(apps)){
      // }else{
      //   this.commonService.displayToaster(
      //     "error",
      //     "Error",
      //     `Please select ${apps} Employees only`
      //   );
      // }
       var inputValue = event.value;
      const matchedValues = this.ApprovalData.some(data => 
        data.userId.some((userId:any) => inputValue.includes(userId))
      );
      if (matchedValues) {
        if(inputValue.length > this.selectedEmployee.length){
          inputValue.splice(0,1);
          this.Approval.controls['userId'].patchValue(inputValue);
        Swal.fire({
          icon: "info",
          title: "Warning",
          text: "Already Exist!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
      }
      else{
        this.Approval.controls['userId'].patchValue("");
        Swal.fire({
          icon: "info",
          title: "Warning",
          text: "Already Exist!",
          confirmButtonColor: "#007dbd",
          showConfirmButton: true,
        });
      }
    }
    else{
      this.selectedEmployee = inputValue;
    }
    }
    
}
