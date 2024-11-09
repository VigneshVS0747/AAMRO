export interface TaxCode {
    taxCodeId: number;
    txCode: string;
    taxCodeName: string;
    taxType: string;
    taxPer: string;
    effectiveDate : Date|null;
    countryId: number;
    countryName: string;
    livestatus:boolean;
    createdby: number;
    createddate:Date | string;
    updatedby:number | null;
    updateddate:Date | string,   
  }