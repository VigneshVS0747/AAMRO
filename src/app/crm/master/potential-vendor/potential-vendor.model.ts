export class PotentialVendor {
    potentialVendorId: number;
    potentialVendorCode: string | null;
    vendorName: string;
    aliasName: string | null;
    vendorEmail: string | null;
    vendorPhone: string | null;
    countryName:string;
    companyWebsite: string | null;
    billingCurrencyId: number;
    vendorCurrencyId: number;
    yearOfOperation: number;
    vendorRemarks: string | null;
    tags: string | null;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number | null;
    updatedDate: Date | null;
    billingCurrency: string | null;
    currencyName: string | null;
    pvStatus: string;
    pvStatusId: number;
    currencyId: number;
    countryId: any;
  }
  
  export class PotentialVendorServices {  
    pvServiceId: number;
    potentialVendorId: number;
    countryId: number;
    remarks: string;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date ;
    updatedBy: number ;
    updatedDate: Date ;
    countryName:string | null;
    IseditServices:boolean;
    newServices: boolean;
    LineItemCategoryId:number;
    serviceTypeName: string | null;
    lineItemCategorys:number[];
    lineItemCategorysIdsArray: string;
  }
  
  export class PotentialVendorServiceDetails {
    
    pvServiceDetailsId: number;
    pvServiceId: number;
    LineItemCategoryId: number;
    createdBy: number;
    createdDate: Date | string;
    updatedBy?: number | null;
    updatedDate: Date | string;
    serviceTypeName:string
  }
  
  export class PotentialVendorContact {
    pvContactId: number;
    potentialVendorId: number;
    contactTypeId: number | null;
    contactPerson: string | null;
    departmentId: number | null;
    designation: string | null;
    contactPersonPhone: string | null;
    contactPersonEmail: string | null;
    primaryContact: boolean;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    contactTypeName: string | null;
    departmentName: string | null;
  }
  
  export class PotentialVendorAddress {
    pvAddressId: number;
    potentialVendorId: number;
    addressTypeId: number;
    addressName: string | null;
    countryId: number | null;
    stateId: number | null;
    cityId: number | null;
    addressLine1: string | null;
    addressLine2: string | null;
    phoneNumber: string | null;
    primaryAddress: boolean;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    addresstypeName: string | null;
    countryName: string | null;
    stateName: string | null;
    cityName: string | null;
  }
  
  export class PotentialVendorDocument {
    pvDocumentId: number;
    potentialVendorId: number;
    documentId: number;
    remarks: string | null;
    createdBy: number;
    createdDate: Date;    
    documentName: string;
    documentTypeName:string;
    IseditDoc: boolean;
    newDoc: boolean;
    statusTypeInJobType:string;
    files:string;
  }

  export class PotentialVendorContainer {
    potentialVendor: PotentialVendor;
    potentialVendorServices:PotentialVendorServices[];
    //potentialVendorServiceDetails:PotentialVendorServiceDetails[];
    potentialVendorContacts: PotentialVendorContact[];
    potentialVendorAddresses: PotentialVendorAddress[];
    potentialVendorDocuments: PotentialVendorDocument[];
 }
  