export class StorageType{
    storageTypeId:number;
    storageTypeCode:string;
    storageTypeName:string;
    storageDescription:string;
    mintemperature:number;
    maxtemperature:number;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    message:string;
  }
