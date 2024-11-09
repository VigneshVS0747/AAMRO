export interface Currency {
    currencyId: number;
    currencyCode: string;
    currencyName: string;
    currencySymbol: string;
    denominationMain: string;
    denominationSub: string;
    livestatus: boolean;
    companyCurrency:boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
  }