export class LineItemMaster{
    lineItemId:number;
    lineItemCode:string;
    lineItemName:string;
    lineItemCategoryId:number;
    lineItemCategoryName:string;
    invoicingFlagId:number;
    invoicingFlag:string;
    sapReferenceCode:string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    message:string;
  }
