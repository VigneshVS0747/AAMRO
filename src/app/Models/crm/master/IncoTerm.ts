export interface Incoterm {
    incoTermId: number;
    incoTermCode: string;
    incoTermDescription: string;
    effectiveFrom:any;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
    message:string;
  }