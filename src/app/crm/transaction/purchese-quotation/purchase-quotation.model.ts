export class PurchaseQuotation {
    purchaseQuoteId: number;
    pqNumber: string;
    pqSeqNo: number;
    pqDate: any;
    pqAgainstId: number;
    refNumberId: number;
    refNumber:string;
    vendorTypeId: number;
    vendorId: number;
    vendorName:string;
    validDate: any;
    vendorCurrencyId: number;
    jobCategoryId:number;
    jobTypeId: number;
    remarks: string;
    tags: string;
    originCountryId: number;
    destCountryId: number;
    loadingPortId: number;
    destinationPortId: number;
    originLocationId: number;
    destLocationId: number;
    trailerTypeId: number;
    transportTypeId: number;
    pickUpLocation: string;
    deliveryPlace: string;
    shipmentTypeId: number;
    containerTypeId: number;
    cargoTypeId: number;
    temperatureReq: string;
    vendorRemarks: string;
    storageUomId: number;
    valuePerUom: number;
    packageNos: number;
    statusId: number;
    termsandConditions: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    pqAgainst: string;
    currencyName: string;
    originCountryName: string;
    destCountryName: string;
    originLocationName: string;
    destLocationName: string;
    trailerTypeName: string;
    transportType: string;
    containerTypeName: string;
    shipmentType: string;
    cargoType: string;
    uomName: string;
    pqStatus: string;
    modeofTransport:string;
    approvalStatusId:number
    approvalStatus:string
    selected:boolean;
    reasonId:any;
    reasonName:any;
    closedRemarks:any;
  }
  
  export class PqIncoTerm {
    pqIncoId: number;
    purchaseQuoteId: number;
    incoTermId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    incoTermDescription: string;
  }
  
  export class PqCommodity {
    pqCommodityId: number;
    purchaseQuoteId: number;
    commodityId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }
  
  export class PqTransportMode {
    pqTransportModeId: number;
    purchaseQuoteId: number;
    transportModeId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    modeOfTransport: string;
  }
  
  export class PqPackage {
    pqPackageId: number;
    purchaseQuoteId: number;
    packageTypeId: number;
    commodityId: number| null;
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
  
  export class PqPrice {
    pqPriceId: number;
    purchaseQuoteId: number;
    categoryId: number;
    vendorLineItemDesc: string;
    calculationParameterId: number;
    calculationTypeId: number;
    value: number;
    taxId: number;
    minValue: number;
    remarks: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    calculationParameter: string;
    calculationType: string;
    taxCodeName: string;
    lineItemCategoryName: string;
    taxPer:number;
    pqMapping:[]=[]
  }
export class PqDocument {
    pqDocumentId: number;
    purchaseQuoteId: number;
    documentId: number;
    documentName: string;
    remarks: string;
    createdBy: number;
    createdDate: Date;
    documentTypeName: string;
    IseditDoc:boolean;
    newDoc:boolean;
    files:string;
  }
  export class PQvaliditycloser {
    pqList:PurchaseQuotation[];
  }
  export class PQModelContainer {
    purchaseQuotation: PurchaseQuotation;
    pqIncoTerm: PqIncoTerm[];
    pqCommodity: PqCommodity[];
    pqTransportMode: PqTransportMode[];
    pqPackage: PqPackage[];
    pqPrice: PqPrice[];
    pqDocument: PqDocument[];
  }
  export interface PQMapping {
    pqMappingId: number;
    pqPriceId: number;
    lineItemId: number;
    value: number;
    createdBy: number;
    createdDate: Date;
    updatedBy?: number | null;
    updatedDate?: Date | null;
    lineItemName:string;
    lineItemCategoryName:string;
    IseditLineItem:boolean;
    newLineItem:boolean;
  }
  export class PortofLoading{
    loadingPortId: number;
    loadingPortName: string;
  }
  export class PortofDestination
  {
    destinationPortId: number;
    destinationPortIdName: string;
  }

  export class VendorList
  {
    vendorId: number;
    vendorName: string;
    vendorCode:string;
    type:string;
  }


  export class PQcompare
  {
    purchaseQuotation: PurchaseQuotation[];
    pqPrice: PqPrice[];
  }
  