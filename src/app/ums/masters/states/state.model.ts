export interface State {
    stateId: number;
    stateCode: string;
    stateName: string;
    countryId: number;
    countryName: string;
    saprefno:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }
