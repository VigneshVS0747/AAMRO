export interface Designation {
    designationId: number;
    designationCode: string;
    designationName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }

  