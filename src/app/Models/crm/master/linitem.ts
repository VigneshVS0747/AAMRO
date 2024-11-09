export class lineitem{
    lineItemCategoryId:number;
    lineItemCategoryCode:string;
    lineItemCategoryName:string;
    lineItemCategoryDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    Isedit:boolean;
    message:string;
    sapRefCode:string;
  }
