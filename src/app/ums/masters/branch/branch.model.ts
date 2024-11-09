export interface Branch {
    branchId: number;
    branchCode: string;
    branchName: string;
    aliasName: string;
    branchType: number;
    contactPerson: string;
    contactNumber: string;
    branchAddressLine1: string;
    branchAddressLine2: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    currencyId: number;
    currencyName: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
  }