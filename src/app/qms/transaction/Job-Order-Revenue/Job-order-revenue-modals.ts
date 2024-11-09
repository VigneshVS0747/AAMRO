export class JORevenueBookingGeneral {
    joRevenueBookingId: number;
    revenueBookingDate: any;
    referenceNumber:string;
    jobOrderId: number;
    custBillingCurrencyId: number;
    exchangeRate: number;
    remarks?: string;
    totalinCompanyCurrency: number;
    totalinCustomerCurrency: number;
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
    currencyName:string;
}

export class JORevenueBookingDetail {
    joRevenueBookingDetailId: number;
    joRevenueBookingId: number;
    revenueLineitemId: number;
    joLineitemId?: number;
    aliasName: string;
    regionId: number;
    serviceInId: number;
    sourceFromId: number | null;
    refNumberId: number| null;
    isAmendPrice: boolean;
    isFullyInvoiced:boolean;
    minValue: number;
    calculationParameterId: number| null;
    calculationTypeId: number | null;
    unitPrice: number;
    quantity: number;
    taxableValue: number;
    taxId: number |null;
    taxPercentage: number;
    taxValue: number;
    totalInCustomerCurrency: number;
    exchangeRate: number;
    totalInCompanyCurrency: number;
    multiInvoice: boolean;
    proformaInvoiceRefNo?: string;
    proformaInvoiceRefNoId?: string;
    invoicedAmount?: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    refNumber:string
    regionName: string;
    calculationType: string;
    calculationParameter: string;
    taxCodeName: string;
    clientSourceFrom: string;
    lineItemName: string;
    lineItemCode: string;
    lineItemCategoryName: string;
    countryName:string;
    selected:boolean;
    actualExpense:number;
    createdByEmp:string;
    updatedByEmp:string;
    partiallyBooked:boolean;
}
export interface ContractOrQuotation {
    clientSourceFrom?: string;
    refNumberId: number;
    refNumber?: string;
    calculationParameterId: number;
    calculationParameter?: string;
    calculationTypeId: number;
    calculationType?: string;
    unitPrice?: string;
    taxId: number;
    taxPercentage?: string;
    minValue?: string;
    taxCodeName?:string;
}
export interface JORBLineItem {
    proformaInvoiceId:number;
    proInvoiceRefNumber?: string;
    invoicedAmount?: number;
    invoicedDate?: Date | null;
}
  
export interface JORBModelContainer {
    jorbGeneral: JORevenueBookingGeneral;
    jorbDetail: JORevenueBookingDetail[];
  }
