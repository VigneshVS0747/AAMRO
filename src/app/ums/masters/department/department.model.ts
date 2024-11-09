export interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number;
    updatedDate:Date | string;
    Isedit:boolean;
  }