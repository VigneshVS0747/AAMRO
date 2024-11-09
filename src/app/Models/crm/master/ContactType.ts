export interface ContactType {
  contactTypeId: number;
  contactTypeCode: string
    contactTypeName: string;
    contactDescription: string;
    liveStatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }