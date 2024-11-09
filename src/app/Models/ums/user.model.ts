export interface UserHeader {
    userId: number;
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    authorizationId: number;
    authorizationMatrixName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    menus?: UserMenus[];
}

export interface UserMenus{
    userMenusId: number;
    userId: number;
    menuId: number;
    menuName: string;
    actionView:boolean;
    actionAdd:boolean;
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
    authorizationView:UserMenusAction;
    authorizationAdd:UserMenusAction;
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

  export interface UserMenusAction{
    menuActionId: number
    userMenusId: number;
    actionId : number;
    authorizationId : number;
  }

  export interface AuthorizationMatrix{
    authorizationMatrixID:number;
    authorizationMatrixName:string;
    liveStatus:boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
  }
