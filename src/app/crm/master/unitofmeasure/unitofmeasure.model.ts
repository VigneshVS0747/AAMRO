export interface UOM {
    uomId: number;
    uomCode: string;
    uomName: string;
    uomDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
    message:string;
  }