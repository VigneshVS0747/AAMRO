export interface Country {
    countryId: number;
    countryCode2L: string;
    countryCode3L: string;
    countryName: string;
    saprefno:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }