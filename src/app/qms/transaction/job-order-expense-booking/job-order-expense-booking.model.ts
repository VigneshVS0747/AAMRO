export interface JOCostBookingGeneral {
    joCostBookingId: number;
    costBookingDate: any;
    referenceNumber:string;
    jobOrderId: number;
    totalinCompanyCurrency: number;
    isDraft: boolean;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    jobOrderNumber?: string;
    jobOrderDate?: any;
    customerName?: string;
    jobTypeName?: string;
    salesOwner?: string;
    jobOwner?: string;
    jobStage?: string;
    jobStageStatus?: string;
  }
  
  export interface JOCostBookingDetail {
    joCostBookingDetailId: number;
    joCostBookingId: number;
    joLineitemId: number | null;
    groupCompanyId: number | null;
    regionId: number | null;
    serviceInId: number | null;
    isVendor: boolean | null;
    isAmendPrice:boolean;
    isFullyInvoiced:boolean;
    vendorId?: number | null;
    sourceFromId?: number | null;
    refNumberId?: number | null;
    currencyId: number | null;
    calculationParameterId: number | null;
    calculationTypeId: number | null;
    rate: number | null;
    quantity: number | null;
    value: number | null;
    taxId: number | null;
    taxValue: number | null;
    minValue: number | null;
    totalInVendorCurrency?: number | null;
    exchangeRate: number | null;
    totalInCompanyCurrency?: number | null;
    
    remarks?: string;
    apInvoiceRefNo?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    lineItemName?: string;
    lineItemCategoryName?: string;
    lineItemCode?: string;
    companyName?: string;
    regionName?: string;
    countryName?: string;
    vendorName?: string;
    sourceFrom?: string;
    calculationParameter?: string;
    calculationType?: string;
    taxCodeName?: string;
    currencyName?:string;
    taxPer?:string;
    refNumber?:string;
    selected:boolean;
    jocbDocument:[];
    createdByEmp:string;
    updatedByEmp:string;
    partiallyBooked: boolean;
  }
  
  export interface JOCostBookingDocument {
    jocbDocumentId: number;
    joCostBookingId: number;
    documentId: number;
    documentName: string;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    documentTypeName?: string;
    IseditDoc:boolean;
    newDoc:boolean;
    files:string;
  }
  export interface VendorFilter {
    vendorId: number;
    vendorType?: string;
    vendorName?: string;
    vendorCode?: string;
  }
  
  export interface VendorIdbyValue {
    vendorId: number;
    id:number;
    refNumber?: string;
    validFrom?:Date;
    validTo?:Date;
    contractStatus?:string;
  }
  export interface VendorIdbyCurrency {
    vendorId: number;
    id:number;
    refNumber?: string;
    currencyName:string;
    currencyId:number;
  }
  export interface JOCBLineItem {
    apInvoiceRefNumber?: string;
    invoicedAmount?: string;
    invoicedDate?: Date | null;
    vendorBillNumber?: string;
    billDate: Date;
}
  
  
  export interface JOCBModelContainer {
    jocbGeneral: JOCostBookingGeneral;
    jocbDetail: JOCostBookingDetail[];
    //jocbDocument: JOCostBookingDocument[];
  }
  