export class PurchaseInvoice {
    purchaseInvoiceId: number;
    invoiceNumber: string;
    vendorId: number;
    billNumber?: string;
    billDate?: any;
    dueDate: any;
    billingCurrencyId: number;
    exchangeRate?: any | null;
    invAmount: any;
    addressId: number;
    contactId: number;
    groupCompanyId: number;
    statusId: number;
    totalinVendorCurrency: number;
    totalinCompanyCurrency: number;
    remarks?: string;
    sapInvoiceNo?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    vendorName:string;
    currencyName :string;
    status :any;
    addressName:string;
    contactPerson:string;
    companyName:string;
}


export interface PILineItemDetail {
    purchaseInvDetailId: number;
    purchaseInvoiceId: number;
    joLineitemId: number | null;
    regionId: number | null;
    sourceFromId: number;
    refNumberId?: number; // Nullable property
    currencyId: number;
    calculationParameterId: number | null;
    calculationTypeId: number | null;
    rate: number | null;
    quantity: number | null;
    value: number | null;
    taxId: number | null;
    taxValue: number | null;
    minValueInVendorCurrency: number | null;
    totalInVendorCurrency?: number | null;
    exchangeRate: number | null;
    totalInCompanyCurrency?: number | null;
    remarks?: string;
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
    jobOrderId: number;
    jobOrderNumber: string;
    refNumber:string;
    pInLineItemVendorValue?:QLIVendorValue;
    jobOrderDate:Date | null;
    joCostBookingId:number | null;
  }


  export class PIDocument {
    pIDocumentId: number;
    purchaseInvoiceId: number;
    documentId: number;
    documentName: string;
    remarks?: string; // Nullable property
    createdBy: number;
    createdDate: Date;
    docname:string;
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
    piVendorValueDetails: PIVendorValueDetail[];
}
export class PIVendorValueDetail {
    pILIVendorValueId: number;
    purchaseInvDetailId: number | null;
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

export class PIContainer {
    purchaseInvoiceGeneral:PurchaseInvoice;
    purchaseInvoiceDetails:PILineItemDetail[];
    purchaseInvoiceDocuments:PIDocument[];
}