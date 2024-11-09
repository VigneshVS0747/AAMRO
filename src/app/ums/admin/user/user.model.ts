export interface UserHeader {
  userId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  authorizationId: number;
  authorizationMatrixName: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
  menus?: UserMenus[];
}

export interface UserMenus {
  userMenusId: number;
  userId: number;
  menuId: number;
  menuName: string;
  actionView: boolean;
  actionAdd: boolean;
  actionEdit: boolean;
  actionDelete: boolean;
  actionPrint: boolean;
  actionExport: boolean;
  actionCancel: boolean;
  actionReject: boolean;
  actionApp: boolean;
  actionAppEdit: boolean;
  actionAppHis: boolean;
  actionAuditLog: boolean;
  authorizationView: UserMenusAction;
  authorizationAdd: UserMenusAction;
  authorizationEdit: UserMenusAction;
  authorizationDelete: UserMenusAction;
  authorizationPrint: UserMenusAction;
  authorizationExport: UserMenusAction;
  authorizationCancel: UserMenusAction;
  authorizationReject: UserMenusAction;
  authorizationApp: UserMenusAction;
  authorizationAppEdit: UserMenusAction;
  authorizationAppHis: UserMenusAction;
  authorizationAuditLog: UserMenusAction;

  //isGoldenFlag:boolean;
}

export interface ChangedActionInfo {
  authorizationId: number;
  actionId: number;
  menuId: number;
  userId: number;
  menuActionId: number;
  actionName: string;
}
export interface ActionStatus {
  accessControlId: number;
  accessMenusId: number;
  eadd: boolean;
  eafterApprove: boolean;
  eappHis: boolean;
  eapprove: boolean;
  eauditLog: boolean;
  ecancel: boolean;
  edelete: boolean;
  eedit: boolean;
  eexport: boolean;
  eprint: boolean;
  ereject: boolean;
  eview: boolean;
  menuId: number;
  menuName: string;
}
export interface actionFields {
  status: boolean;
  authorizationId: number;
  actionId: number;
}

export interface UserData {
  actionStatus: Array<ActionStatus>;
  changedActionInfo: Array<ChangedActionInfo>;
  authorizationId: number;
  createdBy: number;
  updatedBy: number;
  createdDate: string;
  updatedDate: string;
  employeeCode: string;
  employeePassword: string;
  employeeId: number;
  livestatus: boolean;
  userId: number;
  mfa:boolean;
  locked:boolean
}
export interface UserMenuObject {
  accessControlId: number;
  accessMenusId: number;
  eadd: boolean | actionFields;
  eafterApprove: boolean | actionFields;
  eappHis: boolean | actionFields;
  eapproval: boolean | actionFields;
  eauditLog: boolean | actionFields;
  ecancel: boolean | actionFields;
  edelete: boolean | actionFields;
  eedit: boolean | actionFields;
  eexport: boolean | actionFields;
  eprint: boolean | actionFields;
  ereject: boolean | actionFields;
  eview: boolean | actionFields;
  menuId: number;
  menuName: string;
  userMenusId: number;
  userId: number;
}
export interface ActionStatus {
  eadd: boolean;
  eafterApprove: boolean;
  eappHis: boolean;
  eapprove: boolean;
  eauditLog: boolean;
  ecancel: boolean;
  edelete: boolean;
  eedit: boolean;
  eexport: boolean;
  eprint: boolean;
  ereject: boolean;
  eview: boolean;
  menuId: number;
  menuName: string;
  userMenusId: number;
}
export interface ChangedActionInfo {
  eadd: actionFields;
  eafterApprove: actionFields;
  eappHis: actionFields;
  eapprove: actionFields;
  eauditLog: actionFields;
  ecancel: actionFields;
  edelete: actionFields;
  eedit: actionFields;
  eexport: actionFields;
  eprint: actionFields;
  ereject: actionFields;
  eview: actionFields;
  menuId: number;
  menuName: string;
}
export interface UserMenusAction {
  menuActionId: number;
  userMenusId: number;
  actionId: number;
  authorizationId: number;
}

export interface UserFormModel {
  selectedEmployeeIdModel: number;
  selectedEmployeeIdModelName: string;
}

export interface AuthorizationMatrix {
  authorizationMatrixID: number;
  authorizationMatrixName: string;
  liveStatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
}

export interface UserPayload {
  employeeId: number;
  employeeName: string | number;
  authorizationId: number;
  createdby: number;
  updatedby: number;
  actionStatus: ActionStatus[];
  changedActionInfo: ChangedActionInfo[];
  userId: number;
  employeeCode: string;
  employeePassword: string;
  livestatus: boolean;
  mfa:boolean;
  locked:boolean
}
export class passwordRemainder {
  userId?: number;
  lastUpdatedate?: Date;
  createdDate?: Date;
  nextUpdate?: Date;
  daysRemaining?: number;
  reminderMessage?: string;
}