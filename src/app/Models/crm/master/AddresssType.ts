export interface AddressType {
    addresstypeId: number;
    addresstypeCode: string;
    addresstypeName: string;
    addressCategoryId:number;
    addressCategory:string;
    description: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }