export interface Permit {
    permitId: number;
    permitCode: string;
    permitName: string;
    countryId: number;
    countryName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }
