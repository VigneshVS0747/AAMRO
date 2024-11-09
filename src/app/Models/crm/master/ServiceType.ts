export class ServiceType{
    serviceTypeId:number;
    serviceTypeCode:string;
    serviceTypeName:string;
    serviceDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    Isedit:boolean;
    message:string;
  }
