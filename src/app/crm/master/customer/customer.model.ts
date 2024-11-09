export class Customer {
  customerId: number;
  potentialCustomerId: number;
  customerCode: string;
  customerName: string;
  aliasName: string;
  customerEmail: string;
  customerPhone: string;
  countryName:string;
  companyWebsite: string;
  customerTypeId: number;
  billingCurrencyId: number;
  customerCurrencyId: number;
  industryId: number ;
  salesOwnerId: number;
  salesExecutiveId: number ;
  serviceTypeId:number;
  jobNotificationStageId: number;
  liveStatus: boolean;
  customerRemarks: string;
  referenceDetails:string;
  tags: string;
  creditLimit: number ;
  creditDays: number ;
  tradeLicenseNumber: string;
  tradeLicenseExpiryDate: Date ;
  trn: string;
  informationSourceId: number ;
  cStatusId: number;
  modeofFollowUpId: number ;
  customerRankingId: number ;
  sapRefCode: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  cvType: string;
  billingCurrency: string;
  currencyName: string;
  industryName: string;
  salesOwnerName: string;
  salesExecutiveName: string;
  rankName: string;
  reportingStage: string;
  informationSourceName: string;
  cStatus: string;
  modeOfFollowUp: string;
  ServiceTypeName:string;
  Id:number;
  name:string;
  closedRemarks:string;
  approvalStatusId:number;
  reasonId:number;
  approvalStatus:number;
  reasonName:number;
  }
  
  export class CustomerContact {
    cContactId: number;
    customerId: number;
    contactTypeId: number;
    contactPerson: string;
    departmentId: number;
    designation: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    primaryContact: boolean;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    contactTypeName: string;
    departmentName: string;
  }
  
  export class CustomerAddress {
    cAddressId: number;
    customerId: number;
    addressTypeId: number;
    addressName: string;
    countryId: number;
    stateId: number;
    cityId: number;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    primaryAddress: boolean;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    addresstypeName: string;
    countryName: string;
    stateName: string;
    cityName: string;
  }
  
  // export class CustomerDocument {
  //   cDocumentId: number;
  //   customerId: number;
  //   documentId: number;
  //   remarks: string;
  //   createdBy: number;
  //   createdDate: Date;
  //   documentName: string;
  //   documentTypeName:string;
  //   IseditDoc:boolean;
  //   newDoc:boolean;
  //   files:string;
  // }
  export class DocumentChecklist {
    CDocumentId: number;
    customerId: number;
    documentId: number;
    mandatory: boolean;
    isCollected: boolean;
    collectedDate?: Date|null;
    remarks: string;
    documentName: string;
    createdBy: number;
    createdDate: Date;
    documentTypeName: string;
    IseditDocCheck: boolean;
    files: string;
  }
  
  export class CustomerServices {
    cServiceId: number;
    customerId: number;
    serviceSectorId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    serviceSector: string;
  }
  export class cLineItemCategory {
    cLineItemCategoryId: number;
    CustomerId: number;
    lineItemCategoryId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
  }
  
  export class CustomerContainer {
    customer: Customer;
    customerServices: CustomerServices[];
    customerContact: CustomerContact[];
    customerAddress: CustomerAddress[];
    cLineItemCategory: cLineItemCategory[];
    documentChecklist: DocumentChecklist[];
  
    constructor() {
      this.customer = new Customer();
      this.customerServices = [];
      this.customerContact = [];
      this.customerAddress = [];
      this.cLineItemCategory = [];
      this.documentChecklist=[]
    }
  }
  