export class Vendor {
    VendorId: number;
    PotentialVendorId:number;
    VendorCode: string;
    VendorName: string;
    AliasName?: string | null; // Nullable property
    VendorEmail: string;
    VendorPhone:number;
    countryName:string;
    CompanyWebsite?:string;
    VendorTypeId: number;
    BillingCurrencyId: number;
    VendorCurrencyId: number;
    YearOfOperation: number;
    VendorRemarks?: string | null; // Nullable property
    Tags?: string;
    CreditLimit?: number|null;
    CreditDays?: number|null;
    TradeLicenseNumber?: string|null;
    TradeLicenseExpiryDate?: Date| null;
    TRN?: string;
    VendorRankingId?: number|null;
    SAPRefCode?: string;
    VStatus:string
    VStatusId: number;
    CreatedBy: number;
    CreatedDate: Date| string;
    UpdatedBy?: number | null; // Nullable property
    UpdatedDate: Date| string;
    approvalStatusId:number
    approvalStatus:string
    checkbox:boolean;
    reasonId:any;
    reasonName:any;
    closedRemarks:any;
}

export class VContact{
    vContactId: number;
    vendorId: number;
    contactTypeId: number;
    contactPerson: string;
    departmentId: number | null;
    contactTypeName: string;
    departmentName: string;
    designation: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    primaryContact: boolean;

    liveStatus:boolean;
    createdBy: number;
    createdDate: Date| string;
    updatedBy?: number | null; // Nullable property
    updatedDate: Date| string;
}

export class VAddress{
    vAddressId:number;
    vendorId:number;
    addressTypeId:number;
    addressName:string;
    countryId:number | null;
    stateId:number | null;
    cityId:number | null;
    addressLine1:string;
    addressLine2:string;
    phoneNumber:string;
    primaryAddress:boolean;
    addresstypeName:string;
    countryName:string;
    stateName:string;
    cityName:string;

    liveStatus:boolean;
    CreatedBy:number;
    CreatedDate: Date| string;
    UpdatedBy?: number | null; // Nullable property
    UpdatedDate: Date| string;
}
export class VDocument{
    vDocumentId:number;
    vendorId:number;
    documentId:number;
    documentName:string;
    documentTypeName:string;
    mandatory:boolean;
    isCollected:boolean;
    collectedDate?: Date|null;
    remarks:string | null;
    createdBy:number;
    createdDate:Date;
   
}

export class VService {
    vServiceId: number;
    vendorId: number;
    countryId: number;
    remarks: string;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date ;
    updatedBy: number ;
    updatedDate: Date ;
    countryName:string
    IseditServices:boolean;
    newServices: boolean;
    LineItemCategoryId:number;
    serviceTypeName: string ;
    lineItemCategorys:number[];
    lineItemCategorysIdsArray: string;
  }

  export class VServiceDetails {
    vServiceDetailsId: number;
    vServiceId: number;
    LineItemCategoryId: number;
    createdBy: number;
    createdDate: Date | string;
    updatedBy?: number | null;
    updatedDate: Date | string;
    serviceTypeName:string
  }

export class VendorModelContainer
  {
    vendors: Vendor;
    vContacts: VContact[];
    vAddresses: VAddress[];
    vDocuments: VDocument[];
    vService: VService[];
    // vServiceDetails: VServiceDetails[];

  }

export class VendorType
{
    CVTypeId:number;
    CVType:string;
    Livestatus:boolean;
    CVTypeCode: string;
}
export class VendorRanking{
    VendorRankingId:number;
    VendorRanking:string;
    VendorRankingCode:string;
    Livestatus:boolean;
}