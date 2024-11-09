export class PotentialCustomer {
     potentialCustomerId: number;
     potentialCustomerCode: string;
     customerName: string;
     aliasName: string;
     customerEmail: string;
     customerPhone: string;
     countryName:string;
     companyWebsite: string;
     billingCurrencyId: number;
     customerCurrencyId: number;
     industryId: number;
     salesOwnerId: number;
     salesExecutiveId: number;
     customerRankingId: number;
     informationSourceId: number;
     referenceDetails:string;
     pcStatusId: number;
     //approvalStatusId: Number;
     interestlevelId: number;
     serviceId:number;
     modeofFollowUpId: number;
     customerRemarks: string;
     tags: string;
     liveStatus: boolean;
     createdBy: number;
     createdDate: Date;
     updatedBy: number;
     updatedDate: Date;
     informationSourceName: string;
     rankName: string;
     industryName: string;
     billingCurrency: string;
     currencyName: string;
     salesExecutiveName: string;
     salesOwnerName: string;
     pcStatus: string;
     intrestlevel: string;
     modeofFollowUp: string;
     ServiceTypeName: string;
     Id:number;
     code:string;
     name:string;
     approvalStatus:string
}

export class PotentialCustomerContact {
     pcContactId: number;
     potentialCustomerId: number;
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

export class PotentialCustomerAddress {
     pcAddressId: number;
     potentialCustomerId: number;
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
     Id:number;
     name:string
}

export class PotentialCustomerDocument {
     pcDocumentId: number;
     potentialCustomerId: number;
     documentId: number;
     remarks: string;
     createdBy: number;
     createdDate: Date;
     documentName: string;
     documentTypeName: string;
     IseditDoc:boolean;
     newDoc:boolean;
     files:string;
}
export class pcLineItemCategory {
     pcLineItemCategoryId: number;
     potentialCustomerId: number;
     lineItemCategoryId: number;
     createdBy: number;
     createdDate: Date;
     updatedBy: number;
     updatedDate: Date;
   }

export class PotentialCustomerContainer {
   potentialCustomer: PotentialCustomer;
   potentialCustomerContacts: PotentialCustomerContact[];
   potentialCustomerAddresses: PotentialCustomerAddress[];
   potentialCustomerDocuments: PotentialCustomerDocument[];
   pcLineItemCategory: pcLineItemCategory[];

}
