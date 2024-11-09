export interface Infosource {
  informationSourceId: number;
  informationSourceCode: string;
  informationSourceName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }