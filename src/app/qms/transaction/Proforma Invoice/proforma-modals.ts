export class ProformaInvoiceGeneral {
    proformaInvoiceId: number;
    proInvoiceNumber: string;
    proInvoiceDate: any;
    dueDate: any;
    sapInvoiceNo?: string;
    customerId: number;
    custBillingCurrencyId: number;
    exchangeRate?: any;
    addressId: number;
    contactId: number;
    statusId: number;
    approvalStatusId?: number;
    closeReasonId?: number;
    invoicedAmtTotinComCurr: number;
    invoicedAmtTotinCusCurr: number;
    remarks?: any;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;

    customerName?: string;
    currencyName?: string;
    addressName?: string;
    contactPerson?: string;
    piStatus?: string;
    approvalStatus?: string;
    reasonName?: string;
    closeRemark?: string;
}

export class ProformaInvDetail {
    proformaInvDetailId: number;
    proformaInvoiceId: number;
    revenueLineitemId: number;
    jobOrderId: number;
    aliasName: string;
    invoiceAmtinCusCurr: number;
    exchangeRate: number;
    invoiceAmtinComCurr: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    rowNumber?: any;
}

