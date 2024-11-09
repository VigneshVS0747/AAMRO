export interface Login {
  employeeCode: string;
  employeePassword: string;
  employeeId:string;
  message: string;
  menuAuth: Array<MenuAuth>;
  jwtToken:string;
  refreshToken:string;
  mfa:boolean;
  locked:boolean
}
export interface MenuAuth {
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
  eview: boolean;
  menuHeaders: string;
  menuName: string;
  menuUrl: string;
  moduleName: string;
  images:string;
}


export interface CheckPassword {
  employeeCode:string; 
  existpassword: string;
  password:string;
  repeatpassword: string;
  message:string;
}

export interface ForegetPassword {
  userId:string; 
  message:string;
}

export interface forgetPasswordChange {
  employeeCode:string; 
  password:string;
  repeatpassword: string;
  message:string;
}