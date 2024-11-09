export interface Commodity {
    Isedit: boolean;
    commodityId: number;
    commodityCode: string;
    commodityName: string;
    commodityDescription: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date;
    updatedBy: number|null;
    updatedDate:Date; 
  }
