export interface AuthorizationItem {
    authorizationItemId:number | null;
    authorizationItemName: string;
    brandId: number;
    brandName: string;
    customerId: number;
    customerName: string;
    jobTypeId: number;
    jobtypeName: string;
    warehouseId: number;
    warehouseName: string;
    livestatus:string;
    createdby: number;
    createddate:Date;
    updatedby:number;
    updateddate:Date,   
    Isedit:boolean;
    message:string;
  }
