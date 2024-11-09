export interface City {
    cityId: number;
    cityCode: string;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    saprefno:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }
