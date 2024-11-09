export class Documents {
    documentId: number;
    documentCode: string;
    documentName: string;
    remarks: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }