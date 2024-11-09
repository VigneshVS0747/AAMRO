export interface UOMConversion {
   // selectedValueToUOM: string;
    uomConversionId: number;
   // selectedValueToUOM: string;
    uomName: string;
    uomToName: string;

   //uomCodee:string;
   uomCode: string;

    uomFromId:number;
    uomToId:number;
    conversionRate:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }