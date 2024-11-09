export class QuotationGeneral {
    quotationId: number;
    quotationNumber: string;
    quotationFullNumber: string;
    quotationDate :Date;
    quotationAgainstId: number ;
    refNumberId: number ;
    customerCategoryId : number ;
    customerId : number ;
    customerAddressId: number ;
    customerContactId: number ;
    salesOwnerId: number ;
    salesExecutiveId: number ;
    billCurrencyId: number ;
    exchangeRate: number ;
    quoteValidTo: Date ;
    revisionNo:number;
    quoteStatusId: number ;
    closedReasonId: number ;
    closedRemarks: string ;
    approvalStatusId: number ;
    clientResponseId: number ;
    jobCategoryId: number ;
    jobTypeId : number ;
    quoteDisplayTypeId:number;
    lineItemDisplay:string;
    modeofTransportId: number ;
    interestLevelId: number ;
    informationSourceId: number ;
    referenceDetail: string ;
    expectedClosingDate: Date ;
    statusId : number ;
    validityPeriod: number ;
    remarks: string ;
    tags: string ;
    originCountryId: number ;
    destCountryId: number ;
    loadingPortId: number ;
    destinationPortId: number ;
    originLocationId: number ;
    destLocationId: number ;
    trailerTypeId: number ;
    transportTypeId: number ;
    pickUpLocation: string ;
    deliveryPlace: string ;
    shipmentTypeId: number ;
    containerTypeId: number ;
    cargoTypeId: number ;
    incoTermId: number ;
    temperatureReq: string ;
    commodityId: number ;
    storageUomId: number ;
    storageValue: number ;
    packageNos: number ;
    termsandConditions:string;
    createdBy : number ;
    createdDate :Date;
    updatedBy: number ;
    updatedDate : Date;
    isrevision:boolean;
    transitTime:string;
    routing:string;
    qAgainst?: string;
    enquiryNumber?: string;
    employeeName?: string;
    salesExecutiveName?: string;
    currencyName?: string;
    qStatus?: string;
    reasonName?: string;
    approvalStatus?: string;
    countryName?: string;
    jobCategory?: string;
    jobTypeName?: string;
    informationSourceName?: string;
    trailerTypeName?: string;
    transportType?: string;
    shipmentType?: string;
    containerTypeName?: string;
    customerCategory?: string;
    cargoType?: string;
    uomName?: string;
    customerName?: string;
    name?: string;
    vendorName?:string;
    contractNumber?:any;
  }

  export class Quotevaliditycloser {
    quotations:QuotationGeneral[];
  }
export class QPackage {
    quotationPackageId: number;
    quotationId: number;
    packageTypeId: number;
    commodityId: number;
    height: number;
    length: number;
    breadth: number;
    cbm: number;
    packWeightKg: number;
    chargePackWtKg: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    packageTypeName: string;
    commodityName: string;
  }


  export class qCommodity {
    qCommodityId: number;
    quotationId: number;
    commodityId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }


  export class qIncoTerm {
    qIncoId: number;
    quotationId: number;
    incoTermId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    incoTermDescription: string;
  }
  export class qContact {
    customerContactId: number;
    quotationId: number;
    contactId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
  }




  export class qTransportMode {
    qTransportModeId: number;
    quotationId: number;
    transportModeId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    modeOfTransport: string;
  }


  export class vendorQuotationFilter {
    lineItemCategory?: string;
    country?: number;
    vendorType:string;
    filterType?:string;
    mapped:boolean;
    lineitem:number
  }

  export class vendorQuotationFilterList {
    vendorId?: number;
    vendorName?: string;
    vendorType?: string;
    SourceFrom?: string;
    refNumber?: string;
    refNumberId?:number;
    validFrom?:Date;
    validTo?:Date;
    contractStatus?:string;
  }

  export class QlineItem {
    qLineItemId: number;
    quotationId: number;
    lineItemId: number | null;
    lineItemCode: string;
    lineItemCategoryId: number;
    lineItemCategoryName: string;
    lineItemDescription: string;
    lineItemName: string;
    serviceInId?: number | null;
    countryName: any;
    isVendor: boolean;
    vendorId: number  | null;;
    vendorName: string;
    sourceFromId:number  | null;;
    sourceFrom: string;
    refNumberId:number  | null;
    refNumber: string;
    vendorCurrencyId:number  | null;
    currencyName:string;
    calculationParameterId?: number  | null;;
    calculationParameter: string;
    calculationTypeId?: number  | null;;
    calculationType: string;
    valueInCustomerCurrency: number  | null;
    valueInCompanyCurrency: number  | null;
    minValueInCustomerCurrency: number  | null;
    minValueInCompanyCurrency:number  | null;
    customerExchangeRate:number  | null;
    taxId?: number  | null;;
    taxCodeName: string;
    taxPercentage: number  | null;;
    remarks: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    isAmendPrice:boolean;
    quotationLineItemVendorValues?:QLIVendorValue;
  }

  export class QLIVendorValue {
    qLIVendorValueId: number;
    qLineItemId: number;
    sourceFromId: number;
    refNumberId?: number; // Nullable property
    currencyId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    sourceFrom:string;
    refNumber:string;
    currencyName:string;
    quotationLineItemVendorValueDetails: QLIVendorValueDetail[];
}

export class QLIVendorValueDetail {
    qLIVendorValueDetailId: number;
    qLIVendorValueId: number | null;
    aamroLineItemCatId: number;
    vendorLineItem: number| null;
    calculationParameterId: number | null;
    calculationTypeId: number | null;
    valueInVendorCurrency: number | null;
    valueInCompanyCurrency: number | null;
    minValueInVendorCurrency: number | null;
    minValueInCompanyCurrency: number | null;
    exchangeRate: number | null;;
    taxId: number | null;
    taxPercentage: number | null;
    remarks?: string; // Nullable property
    createdBy:number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;

    lineItemCategoryName?: string;
    calculationParameter?: string;
    taxCodeName?: string;
    calculationType?: string;
}
export class quotationDocument {
    qDocumentId: number;
    quotationId: number;
    documentId: number;
    documentName: string;
    remarks?: string; // Nullable property
    createdBy: number;
    createdDate: Date;
    docname:string;
}

export class changeExchange{
 fromCurrencyName: string;
  toCurrencyName: string; 
 exchangeRate : number;
 convertedValue : number;
}

export class Exchange{
  fromCurrencyId:number;
   toCurrencyId: number; 
   value : any;
 }

export class QuotationContainer {
    quotation:QuotationGeneral;
    quotationContact:qContact[];
    quotationIncoTerms:qIncoTerm[];
    quotationCommodities:qCommodity[];
    quotationTransportMode:qTransportMode[];
    quotationPackages:QPackage[];
    quotationDocuments:quotationDocument[];
    quotationLineItems:QlineItem[];
}