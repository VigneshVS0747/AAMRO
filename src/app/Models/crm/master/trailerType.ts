export class TrailerType{
    trailerTypeId:number;
    trailerTypeCode:string;
    trailerTypeName:string;
    trailerDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    Isedit:boolean;
    message:string;
  }
