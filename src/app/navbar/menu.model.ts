export interface MenuItem {
  menuId: number;
  menuName: string;
  images:string;
  parentId: number;
  menuUrl: string;
  createdDate: string;
  moduleName: string;
  submenus?: MenuItem[];
  showSubMenu: false;
}
export interface DynamicMenu {
  moduleName: string;
  menuHeaders: string;
  submenus: SubMenu[];
}
interface SubMenu {
  menuId: number;
  menuName: string;
  images:string;
  parentId: number;
  menuUrl: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  submenus: Partial<SubMenu[]>;
}
