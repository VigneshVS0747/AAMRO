import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Activity } from "src/app/Models/ums/Activity.modal";
import { AuthorizationItem } from "src/app/Models/ums/authorizationitem.model";
import { Menus } from "src/app/Models/ums/menus.modal";
import { NofificationconfigurationService } from "../../../services/ums/nofificationconfiguration.service";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Employee } from "../../masters/employee/employee.model";
import { NotificationService } from "src/app/services/notification.service";
import { CommonService } from "src/app/services/common.service";
import { notificationconfiguration } from "src/app/Models/ums/notificationconfiguration.modal";
import { ActivatedRoute, Router } from "@angular/router";
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { ActService } from "../../masters/access-control-template/act.service";

const atLeastOneCheckboxSelectedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const isPopupSelected = control.get("isPopup")?.value;
  const isMessageSelected = control.get("isMessage")?.value;
  const isMailSelected = control.get("isMail")?.value;

  if (!isPopupSelected && !isMessageSelected && !isMailSelected) {
    return { atLeastOneCheckboxSelected: true };
  }

  return null;
};

@Component({
  selector: "app-notificationconfiguration",
  templateUrl: "./notificationconfiguration.component.html",
  styleUrls: [
    "./notificationconfiguration.component.css",
    "../../ums.styles.css",
  ],
})
export class NotificationconfigurationComponent
  implements OnInit, AfterViewInit {
  @ViewChild("exampleModal1") exampleModal1!: ElementRef;
  @ViewChild("exampleModal2") exampleModal2!: ElementRef;
  @ViewChild("exampleModal3") exampleModal3!: ElementRef;
  @ViewChild("dismiss") dismiss!: ElementRef;
  @ViewChild("exampleModal") exampleModal!: ElementRef;
  @ViewChild("myModal", { static: true }) myModal!: ElementRef;
  notification!: FormGroup;
  Escalation!: FormGroup;
  condition: boolean = true;
  showsave: boolean = true;
  Shownotification: boolean = false;
  showUpdate: boolean = true;
  showError: boolean = false;
  isTableVisible: boolean = true;
  showedit: boolean = false;
  form1: boolean = true;
  form2: boolean = true;
  Module: Menus[] = [];
  isDisabled = false;
  menuheader: Menus[] = [];
  employees: Employee[] = [];
  selectedModule: number | undefined;
  selectedHeader!: number;
  Activity: Activity[] = [];
  authname: any[] = [];
  tableData: any[] = [];
  EscalationData: any[] = [];
  Totaldata: any[] = [];
  Sequence: number[] = [];
  SelectedDisable: any[] = [];
  Activityid!: number;
  selected: any[] = [];
  indexofnotification: any;
  valueForZerothIndex: any[] = [];
  showtable: boolean = false;
  selectedIndex: number = -1;
  selectedActivity: number = -1;
  title: string = " New Notification Configuration";
  menuname: any;
  ActivityName: string | undefined;
  Menuname: string | undefined;
  NotificationIdforEscalation!: number;
  intexofnotifi!: any;
  Mode: string = "";
  Escalationbutton: string = "";
  SavenotificationId!: number;
  Escalationfileterdata: any[] = [];
  Escalationfileterdata2: any[] = [];
  EscalationDatacheck: any[] = [];
  indexofescalation!: number;
  hasEscalationData: boolean = false;
  selectedActivityIndex!: number;
  submenu: any[] = [];
  selectedsubmenu: any;
  selectedMenuHeaders = new FormControl([]);
  selectedsubMenuHeaders = new FormControl([]);
  selectAll: any;
  selectedItems: any[] = [];
  select: string[] = [];
  notunique: number[] = [];
  unchange: any[] = [];
  unique: string[] = [];
  populatestoredmenu: any[] = [];
  showbutton!: boolean;
  showpopup!: boolean;
  maxValue!: number;
  disablefields: boolean = false;
  Livestatus = 1;
  escalationId: any;
  buttonfind: boolean;
  editedEscalationItem: any;
  EditedNotificationItem: any;
  showescalation:boolean = false;

  constructor(
    private router: Router,
    private actService: ActService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private notificationService: NotificationService,
    private FB: FormBuilder,
    private service: NofificationconfigurationService,
    public dialog: MatDialog
  ) { }
  ngAfterViewInit(): void {
    if (this.route.snapshot.params["id"]) {
      this.exampleModal1.nativeElement.click();
    }
  }

  ngOnInit() {
    this.showUpdate = false;
    this.disablefields = false;
    this.showsave = true;
    var Path1 = this.router.url;
    if (
      Path1 ==
      "/ums/activity/notificationconfiguration/view/" + this.route.snapshot.params["id"]
    ) {
      this.disablefields = true;
      this.showUpdate = false;
      this.showsave = false;
      this.buttonfind = true;
      this.GetActivityByNotification();
    }
    var Path2 = this.router.url;
    if (
      Path2 ==
      "/ums/activity/notificationconfiguration/edit/" + this.route.snapshot.params["id"]
    ) {
      this.disablefields = false;
      this.showUpdate = true;
      this.showsave = false;
      this.buttonfind = true;
      this.GetActivityByNotification();
      //this.checkescalation();
    }
    this.service.GetAllModules().subscribe((result) => {
      this.Module = result;
      console.log(result);
    });
    this.notification = this.FB.group(
      {
        authorizationItemId: ["", Validators.required],
        userId: ["", Validators.required],
        isPopup: [false],
        isMessage: [false],
        isMail: [false],
        isReportingManager: [false, Validators.required],
      },
      { validators: [atLeastOneCheckboxSelectedValidator] }
    );
    this.Escalation = this.FB.group({
      sequenceOrder: ["", Validators.required],
      userIdescalation: ["", Validators.required],
      escalationtime: ["", Validators.required],
      timetype: ["", Validators.required],
      isReportingManagerescalation: [false],
      isNotifytoRoute: [false],
    });
    this.Authorizationitems();
    this.condition = true;
    this.form1 = false;
    this.form2 = false;
  }

  GetActivityByNotification() {
    this.service
      .GetActivityByNotification(this.route.snapshot.params["id"])
      .subscribe((result) => {
        this.tableData = result;
        console.log("result===>", result);
        this.tableData = this.tableData.map((item) => {
          return {
            ...item,
            userId: item.userId.split(",").map((id: string | number) => +id),

          };
        });
        this.tableData.forEach((item) => {
          this.Menuname = item.menuName;
          this.ActivityName = item.activityName;
        });

        console.log("array===>", this.tableData);
        this.isTableVisible = true;
        console.log("GetActivityByNotification", result);
      });
  }
  show() {
    this.showpopup = true;
    this.showbutton = false;
  }
  Authorizationitems() {
    this.service.GetAuthorizationitem(this.Livestatus).subscribe((result) => {
      this.authname = result;
    });
    this.getemployees();
  }
  Addnotificationdetails() {
    this.notification = this.FB.group(
      {
        authorizationItemId: ["", Validators.required],
        userId: ["", Validators.required],
        isPopup: [false],
        isMessage: [false],
        isMail: [false],
        isReportingManager: [false],
        createdBy: [1],
        updatedBy: [0],
      },
      { validators: [atLeastOneCheckboxSelectedValidator] }
    );
  }
  Addescalationdetails() {
    this.Escalation = this.FB.group({
      sequenceOrder: [this.EscalationData.length + 1, Validators.required],
      userIdescalation: ["", Validators.required],
      escalationtime: ["", Validators.required],
      timetype: ["", Validators.required],
      isReportingManagerescalation: [false],
      isNotifytoRoute: [false],
      createdBy: [1],
      updatedBy: [0],
    });
  }
  getemployees() {
    this.commonService.getEmployees(this.Livestatus).subscribe((result) => {
      this.employees = result;
    });
  }
  onchangemodule(event: any) {
    console.log(event.value);
    const menuheaderid = event.value;
    this.selectedModule = menuheaderid;
    this.service.Getmenuheaderbyid(menuheaderid).subscribe((result) => {
      this.menuheader = result;
      console.log(result);
    });
  }
  onchangeheader(event: any) {
    const value = this.selectedMenuHeaders.value;
    console.log(value);
    const auth = {
      headerid: value,
      submenuid: [0],
    };
    this.actService.Getsubmenubyid(auth).subscribe((result) => {
      this.submenu = result;
    });
    this.selectAll = false;
  }

  Addtolist() {
    if (this.selectAll === true) {
      if (this.select.length > 0) {
        if (this.unchange.length > 0) {
          var data = (this.unique = this.select.filter(
            (value: any) => !this.unchange.includes(value)
          ));
          console.log("uniquedta===>", data);
          const value = this.selectedMenuHeaders.value;
          const value2 = this.unique;
          const auth = {
            headerid: value,
            submenuid: value2,
          };
          this.service.GetActivitybyheaderid(auth).subscribe((result) => {
            this.populatestoredmenu = result;
            this.Activity.push(...this.populatestoredmenu);
            console.log("result===>", this.populatestoredmenu);
            this.Activity.forEach((item) => {
              this.unchange.push(item.menuId);
            });
          });

          this.showtable = true;
          this.showbutton = true;
          this.showpopup = false;
          this.submenu = [];
          this.menuheader = [];
        } else {
          const value = this.selectedMenuHeaders.value;
          const value2 = this.select;
          const auth = {
            headerid: value,
            submenuid: value2,
          };
          this.service.GetActivitybyheaderid(auth).subscribe((result) => {
            this.populatestoredmenu = result;
            this.Activity.push(...this.populatestoredmenu);
            console.log("result===>", this.populatestoredmenu);
            this.Activity.forEach((item) => {
              this.unchange.push(item.menuId);
            });
          });

          this.showtable = true;
          this.showbutton = true;
          this.showpopup = false;
          this.submenu = [];
          this.menuheader = [];
        }
      }
    } else {
      if (
        this.notunique.length === this.unchange.length &&
        this.notunique.every((value, index) => value === this.unchange[index])
      ) {
      } else {
        const value = this.selectedMenuHeaders.value;
        const value2 = this.notunique;
        const auth = {
          headerid: value,
          submenuid: value2,
        };
        this.service.GetActivitybyheaderid(auth).subscribe((result) => {
          this.populatestoredmenu = result;
          this.Activity.push(...this.populatestoredmenu);
          this.Activity.forEach((item) => {
            this.unchange.push(item.menuId);
            console.log("this.unchange===>", this.unchange);
          });
        });

        this.showtable = true;
        this.showbutton = true;
        this.showpopup = false;
        this.submenu = [];
        this.menuheader = [];
      }
    }
    this.selectedMenuHeaders.reset(); // Use the appropriate method to reset the FormControl
    this.selectedItems = [];
  }

  getactivityid(
    MenuName: any,
    Activityname: any,
    activityId: number,
    i: number
  ) {
    this.selectedActivityIndex = i;
    this.Activityid = activityId;
    this.isTableVisible = true;

    //get current names//
    this.Menuname = MenuName;
    this.ActivityName = Activityname;

    if (activityId != null) {
      this.service.GetActivityByNotification(activityId).subscribe((result) => {
        this.tableData = result;
        this.tableData = this.tableData.map((item) => {
          return {
            ...item,
            userId: item.userId.split(",").map((id: string | number) => +id),
          };
        });
        if (this.tableData.length > 0) {
          this.showUpdate = false;
          this.showsave = false;
        } else {
          this.showsave = true;
          this.showUpdate = false;
        }
      });
    }
  }

  Onsubmit() {
    this.isDisabled = true;
    if (this.notification.valid) {
      if (this.route.snapshot.params["id"]) {
        if (this.intexofnotifi != null) {
          const notificationvalue = {
            activityId: this.route.snapshot.params["id"],
            ...this.notification.value,
          };
          this.tableData.splice(this.intexofnotifi, 0, notificationvalue);
          if (this.escalationId != null) {
            this.selectedIndex = this.intexofnotifi;
          }
          this.intexofnotifi = null;
          this.notification.reset();
          this.exampleModal1.nativeElement.click();
          this.exampleModal.nativeElement.click();
        } else {
          const notificationvalue = {
            activityId: this.route.snapshot.params["id"],
            ...this.notification.value,
          };
          this.tableData.push(notificationvalue);
          this.notification.reset();
          this.exampleModal1.nativeElement.click();
          this.exampleModal.nativeElement.click();
        }
      } else {
        if (this.intexofnotifi != null) {
          const notificationvalue = {
            activityId: this.Activityid,
            createdBy: 1,
            updatedBy: 0,
            ...this.notification.value,
          };
          this.tableData.splice(this.intexofnotifi, 0, notificationvalue);
          this.intexofnotifi = null;
          this.notification.reset();
          this.exampleModal1.nativeElement.click();
          this.exampleModal.nativeElement.click();
        } else {
          const notificationvalue = {
            activityId: this.Activityid,
            ...this.notification.value,
          };
          this.tableData.push(notificationvalue);
          this.notification.reset();
          this.intexofnotifi = null;
          this.exampleModal1.nativeElement.click();
          this.exampleModal.nativeElement.click();
        }
      }
    } else {
      this.notification.markAllAsTouched();
      this.validateall(this.notification);
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
  deleteItem(item: any, id: number, i: number) {
    if (i != null) {
      this.tableData.splice(i, 1);
      this.valueForZerothIndex.splice(i, 1);
    }
    if (this.tableData.length === 0) {
      this.isTableVisible = false;
    }
    if (id != null) {
      Swal.fire({
        title: "Are you sure?",
        text: "Delete the Notification!..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.DeleteAllNotification(id).subscribe((res) => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
        } else {

        }
      });
    }
  }
  DeleteEscalation(id: number, i: number) {
    if (id != null) {
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
          this.service.DeleteEscalationandUsers(id).subscribe((res) => {
            Swal.fire("Deleted!", "Escalation has been deleted.", "success");
            this.EscalationData.splice(i, 1);
            for (let j = i; j < this.EscalationData.length; j++) {
              this.EscalationData[j].sequenceOrder--; // Decrease levelid by 1
            }
          });
        }
      });
    } else {
      this.EscalationData.splice(i, 1);
      for (let j = i; j < this.EscalationData.length; j++) {
        this.EscalationData[j].sequenceOrder--; // Decrease levelid by 1
      }
    }
  }
  edit(item: any, i: number, notificationid: number) {
    this.EditedNotificationItem = item;
    this.escalationId = item.escalationId;
    this.exampleModal1.nativeElement.click();
    this.SavenotificationId = notificationid;
    this.intexofnotifi = i;
    if (item.notificationId != null) {
      this.isTableVisible = false;
      this.showedit = false;
      const index = this.tableData.findIndex(
        (data) => data.notificationId === item.notificationId
      );
      if (index !== -1) {
        this.tableData.splice(index, 1);
      }
      if (typeof item.userId === "string") {
        const userIdArray = item.userId
          .split(",")
          .map((id: string | number) => +id);
        this.notification = this.FB.group(
          {
            userNotificationID: [item.userNotificationID],
            activityId: [item.activityId],
            notificationId: [item.notificationId],
            authorizationItemId: [
              item.authorizationItemId,
              Validators.required,
            ],
            userId: [userIdArray, Validators.required],
            isPopup: [item.isPopup],
            isMessage: [item.isMessage],
            isMail: [item.isMail],
            isReportingManager: [item.isReportingManager, Validators.required],
          },
          { validators: [atLeastOneCheckboxSelectedValidator] }
        );
        this.tableData.splice(index, 0, item);
      } else {
        this.notification = this.FB.group(
          {
            userNotificationID: [item.userNotificationID],
            activityId: [item.activityId],
            notificationId: [item.notificationId],
            authorizationItemId: [
              item.authorizationItemId,
              Validators.required,
            ],
            userId: [item.userId, Validators.required],
            isPopup: [item.isPopup],
            isMessage: [item.isMessage],
            isMail: [item.isMail],
            isReportingManager: [item.isReportingManager, Validators.required],
          },
          { validators: [atLeastOneCheckboxSelectedValidator] }
        );
      }
    } else {
      this.isTableVisible = false;
      this.showedit = false;
      if (i != null) {
        this.tableData.splice(i, 1);
      }
      this.notification = this.FB.group(
        {
          authorizationItemId: [item.authorizationItemId, Validators.required],
          userId: [item.userId, Validators.required],
          isPopup: [item.isPopup],
          isMessage: [item.isMessage],
          isMail: [item.isMail],
          isReportingManager: [item.isReportingManager, Validators.required],
        },
        { validators: [atLeastOneCheckboxSelectedValidator] }
      );
    }
  }

  addescalation() {
    if (this.Escalation.valid) {
      if (this.route.snapshot.params["id"]) {
        if(this.indexofescalation!=null){
          this.showedit = true;
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 1,
            notificationId: this.NotificationIdforEscalation,
            ...this.Escalation.value,
          };
          this.EscalationData.splice(this.indexofescalation, 0, Escalationvalue);
  
          this.exampleModal2.nativeElement.click();
          this.exampleModal3.nativeElement.click();
        }else{
          this.showedit = true;
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 1,
            notificationId: this.NotificationIdforEscalation,
            ...this.Escalation.value,
          };
          this.EscalationData.push(Escalationvalue);
  
          this.exampleModal2.nativeElement.click();
          this.exampleModal3.nativeElement.click();
        }
       
      } else {
        if(this.indexofescalation!=null){
          this.showedit = true;
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 0,
            ...this.Escalation.value,
          };
          this.EscalationData.splice(this.indexofescalation, 0, Escalationvalue);
          this.exampleModal2.nativeElement.click();
          this.exampleModal3.nativeElement.click();
        }else{
          this.showedit = true;
          const Escalationvalue = {
            createdBy: 1,
            updatedBy: 0,
            ...this.Escalation.value,
          };
          this.EscalationData.push(Escalationvalue);
          this.exampleModal2.nativeElement.click();
          this.exampleModal3.nativeElement.click();
        }    
      }
    } else {
      this.Escalation.markAllAsTouched();
      this.validateall(this.Escalation);
    }
  }

  editescalation(item: any, i: number) {
    this.editedEscalationItem = item
    this.exampleModal2.nativeElement.click();
    this.indexofescalation = i;
    if (item.escalationId != null) {
      this.showedit = false;
      if (i != null) {
        this.EscalationData.splice(i, 1);
      }
      if (typeof item.userIdescalation === "string") {
        const userIdArray = item.userIdescalation
          .split(",")
          .map((id: string | number) => +id);
        this.Escalation = this.FB.group({
          escalationId: [item.escalationId],
          sequenceOrder: [item.sequenceOrder, Validators.required],
          userIdescalation: [userIdArray, Validators.required],
          escalationtime: [item.escalationtime],
          timetype: [item.timetype],
          isReportingManagerescalation: [item.isReportingManagerescalation],
          isNotifytoRoute: [item.isNotifytoRoute],
        });
      } else {
        this.Escalation = this.FB.group({
          escalationId: [item.escalationId],
          sequenceOrder: [item.sequenceOrder, Validators.required],
          userIdescalation: [item.userIdescalation, Validators.required],
          escalationtime: [item.escalationtime],
          timetype: [item.timetype],
          isReportingManagerescalation: [item.isReportingManagerescalation],
          isNotifytoRoute: [item.isNotifytoRoute],
        });
      }
    } else {
      this.showedit = false;
      if (i != null) {
        this.EscalationData.splice(i, 1);
      }
      this.Escalation = this.FB.group({
        sequenceOrder: [item.sequenceOrder, Validators.required],
        userIdescalation: [item.userIdescalation, Validators.required],
        escalationtime: [item.escalationtime],
        timetype: [item.timetype],
        isReportingManagerescalation: [item.isReportingManagerescalation],
        isNotifytoRoute: [item.isNotifytoRoute],
      });
    }
  }
  showesc(i: number, NotificationId: number) {
    this.indexofnotification = i;
    this.NotificationIdforEscalation = NotificationId;
    this.showedit = true;

    while (this.valueForZerothIndex.length <= i) {
      this.valueForZerothIndex.push([]);
    }

    if (this.valueForZerothIndex[i]) {
      const valueForZerothIndex = this.valueForZerothIndex[i];
      if(valueForZerothIndex.length==0 && NotificationId == null ){
        this.EscalationData = valueForZerothIndex;
      }else if (valueForZerothIndex.length==0){
        this.service
        .GetEscalationByNotification(NotificationId)
        .subscribe((result) => {
          this.EscalationData = result;
          this.EscalationData = this.EscalationData.map((item) => {
            return {
              ...item,
              userIdescalation: item.userIdescalation
                .split(",")
                .map((id: string | number) => +id),
              createdBy: item.createdBy,
              updatedBy: item.updatedBy,
            };
          });
        });
      }else{
        this.EscalationData = valueForZerothIndex;
      }
    }

    if (NotificationId != null && this.showescalation == false ) {
      this.service
        .GetEscalationByNotification(NotificationId)
        .subscribe((result) => {
          this.EscalationData = result;
          this.EscalationData = this.EscalationData.map((item) => {
            return {
              ...item,
              userIdescalation: item.userIdescalation
                .split(",")
                .map((id: string | number) => +id),
              createdBy: item.createdBy,
              updatedBy: item.updatedBy,
            };
          });

          this.EscalationData.forEach((item) => {
            this.Sequence.push(item.sequenceOrder);
          });
          console.log("This.sequence", this.Sequence);
        });
    }
  }

  Addtonotificationlist() {
    this.showescalation = true;
    if (this.EscalationData.length > 0) {
      this.valueForZerothIndex[this.indexofnotification] = [];
      this.valueForZerothIndex[this.indexofnotification].push(...this.EscalationData);
      this.exampleModal2.nativeElement.click();
      this.exampleModal1.nativeElement.click();
      this.showedit = false;
      this.Escalation.reset();
      this.selectedIndex = this.indexofnotification;

    } else {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Please add atleast one Escalation...!",
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
    }

  }
  isDuplicate(item: any, array: any) {
    return array.includes(item);
  }
  Save() {
    if (this.tableData.length > 0) {
      const notification = {
        notificationconfiguration: this.tableData,
        escalationprocess: this.valueForZerothIndex,
      };
      this.service.Addnotification(notification).subscribe((result) => {
        if (result.message == "SUCCESS") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Added Successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.service
            .Updateiconnotification(this.Activityid)
            .subscribe((result) => { });
          this.selectedActivity = this.selectedActivityIndex;
          this.isTableVisible = false;
          this.dismiss.nativeElement.click();
          this.router.navigate(["/ums/activity/notificationconfiguration"]);
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "please add atleast one notification...",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  Update() {

    const notificationUpadte = {
      notificationconfiguration: this.tableData.map((item) => ({
        ...item,
        createdBy: 1,
        updatedBy: 1,
      })),
      escalationprocess: this.valueForZerothIndex,
    };
    this.service.Addnotification(notificationUpadte).subscribe((result) => {
      if (result.message == "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        this.service
          .Updateiconnotification(this.Activityid)
          .subscribe((result) => { });
        this.selectedActivity = this.selectedActivityIndex;
        this.isTableVisible = false;
        this.dismiss.nativeElement.click();
        this.router.navigate(["/ums/activity/notificationconfiguration"]);
      }
    });

  }

  onSelectionChange(data: any) {
    this.selected.push(data.value);

    const isItemExists = this.tableData.some(
      (item) => item.authorizationItemId === data.value
    );

    if (isItemExists) {
      Swal.fire({
        icon: "error",
        title: "Duplicate",
        text: `The AuthorizationItem you have already added to ${this.Menuname}-Menu and ${this.ActivityName}-Activity Please select New one....!`,
        confirmButtonColor: "#007dbd",
        showConfirmButton: true,
      });
      this.notification.get("authorizationItemId")?.setValue("");
    }

    return isItemExists;
  }
  getSelectedEmployeeNames(selectedIds: number[]): string {
    const selectedEmployees = this.employees.filter((employee) =>
      selectedIds.includes(employee.employeeId)
    );
    return selectedEmployees
      .map((employee) => employee.employeeName)
      .join(", ");
  }

  getSelectedAuthorizationItemName(selectedId: number): string {
    const selectedAuthItem = this.authname.find(
      (item) => item.authorizationItemID === selectedId
    );
    return selectedAuthItem ? selectedAuthItem.authorizationItemName : "";
  }
  getSelecteduserNames(selectedIds: number[]): string {
    const selectedEmployees = this.employees.filter((employee) =>
      selectedIds.includes(employee.employeeId)
    );
    return selectedEmployees
      .map((employee) => employee.employeeName)
      .join(", ");
  }

  selectAllOptions(event: any): void {
    var data = (this.selectAll = event.checked);
    if (event.checked) {
      this.selectedItems = this.submenu.map((option) => option.menuId);
      this.selectedItems.forEach((item) => {
        this.select.push(item);
      });
    } else {
      this.selectedItems = [];
    }
  }
  onSelectionsubmenu(event: any) {
    this.showbutton = false;
    this.notunique = event.value.filter(
      (value: any) => !this.unchange.includes(value)
    );
  }
  Close() {
    if (this.intexofnotifi != -1 && this.EditedNotificationItem != null) {
      this.tableData.splice(this.intexofnotifi, 0, this.EditedNotificationItem);

      this.intexofnotifi = '',
        this.EditedNotificationItem = null;
    }
  }
  cancel() {
    this.Close();
  }
  CancelEscalation() {
    if (this.indexofescalation != -1 && this.editedEscalationItem != null) {
      this.EscalationData.splice(this.indexofescalation, 0, this.editedEscalationItem);

      this.indexofescalation = -1;
      this.editedEscalationItem = null;
      //this.showescalation=false;
    }
  }
  closeEscaltion() {
    this.CancelEscalation();
  }
}
