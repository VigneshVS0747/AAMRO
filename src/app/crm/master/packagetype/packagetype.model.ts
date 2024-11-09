export interface PackageType {
    Isedit: boolean;
    packageTypeId: number;
    packageTypeCode: string;
    packageTypeName: string;
    description: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; 
  }
