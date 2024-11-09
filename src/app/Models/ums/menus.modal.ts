export interface Menus {
  menuId: number;
  menuName: string;
  parentId: number;
  menuUrl: string;
  livestatus: string;
  createdby: number;
  createddate: Date;
  updatedby: number;
  updateddate: Date;
}

export enum ActionPrivileges {
  edelete = "delete",
  eadd = "create",
  eedit = "edit",
  eview = "view",
}

export enum EndPoints {
  eadd = "create",
  eedit = "edit",
  eview = "view",
}
