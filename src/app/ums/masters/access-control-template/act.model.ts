export interface AccessControlTemplate {
  accessControlId: number;
  accessControlCode: string;
  accessControlName: string;
  livestatus: boolean ;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
  menus?: AccessControlTemplateMenus[];
}

export interface DialogueAccessControls {
  accessControlId: number;
  selectedAuthorizationId: number;
}
export interface AccessControlTemplateMenus {
  accessMenusId: number;
  accessControlId: number;
  menuId: number;
  menuName: string;
  eview: boolean;
  eadd: boolean;
  eedit: boolean;
  edelete: boolean;
  eprint: boolean;
  eexport: boolean;
  ecancel: boolean;
  ereject: boolean;
  eapprove: boolean;
  eafterApprove: boolean;
  eappHis: boolean;
  eauditLog: boolean;
  selectall:boolean;
}
