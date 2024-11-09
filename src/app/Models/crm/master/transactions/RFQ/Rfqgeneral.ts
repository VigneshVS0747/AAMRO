export class Rfqgeneral {
    rfqId: number;
    rfqNumber: string;
    rfqDate: Date;
    rfqAgainst: number;
    rfqAgainstName:string;
    refNumber:string;
    orgincountryName:string;
    jobCategoryName:string;
    jobTypeName:string;
    destCountryname:string;
    originLocationname:string;
    destLocationName:string;
    trailerTypeName:string;
    shipmentType:string;
    containerTypeName:string;
    cargoType:string;
    storageUomName:string;
    transportType:string;
    refNumberId: number;
    expectedQuoteDate: Date;
    remarks: string;
    tags: string;
    jobCategoryId: number;
    jobTypeId: number;
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
    cargoTypeid:number;
    commodityId:[];
    incoTermId:[];
    transportModeId:[];
    temperatureReq: string;
    vendorRemarks: string;
    storageUomId: number;
    valuePerUom: number;
    packageNos: number;
    statusId: number;
    statusname:string
    createdBy: number;
    createdDate: string;
    updatedBy: number;
    updatedDate: string;
    // approvalStatusId:number
    // approvalStatus:string
  }


  export class RfqIncoTerm {
    rfqIncoId: number;
    rfqId: number;
    incoTermId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    incoTermDescription: string;
  }
  
  export class RfqCommodity {
    rfqcommodityId: number;
    rfqId: number;
    commodityId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }


  export class RfqPackage {
    RfqPackageId: number;
    RfqId: number;
    packageTypeId: number;
    packageTypeName:string;
    commodityId: number;
    commodityName:string;
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
}

export class Rfqtransportmode {
    rfqTransportModeId: number;
    RfqId: number;
    transportModeId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }

  export class RfqDocument {
    rfqDocumentId: number;
    rfqId: number;
    documentId: number;
    documentName: string;
    docname:string;
    remarks: string;
    createdBy: number;
    createdDate: Date | string;
  }

  export class RfqLineItem {
    rfqLineItemId: number;
    rfqId: number;
    lineItemId: number;
    createdBy: number;
    createdDate: Date | string;
  }
  export class vendorfilter {
    vendorId: number;
    potentialvendorId: number;
    countryId: number;
    serviceTypeId:string;
    flag:string
    createdBy: number;
    createdDate: Date | string;
  }


 export class vendorfilterList {
    rfqVendorId: number;
    rfqId: number;
    vendorId: number;
    vendorName: number;
    vendorCode:string;
    vendorType: string;
    active:boolean;
    createdBy:number;
    updatedBy:number;
  }

  export class RFQcombine {
    rFQs:Rfqgeneral ;
    rfqTransportModes:Rfqtransportmode[];
    rfqLineItems:RfqLineItem[];
    rfqCommoditys:RfqCommodity[];
    rfqVendors:vendorfilterList[];
    rfqVendorContacts:VendorContactList[];
    rfqIncoTerms:RfqIncoTerm[];
    rfqPackages:RfqPackage[];
    rfqDocuments:RfqDocument[];
  }
  export class VendorContactList {
    rfqVendorContactId:number;
    rfqVendorId:number;
    contactId:number;
    contactTypeId?: number;
    contactPerson?: string;
    departmentId?: number;
    contactPersonPhone?: string;
    contactPersonEmail?: string;
    designation:string;
    primaryContact?: boolean;
    departmentName?: string;
    contactTypeName?: string;
    active:boolean;
    createdBy:number;
    updatedBy:number;

  }
  
  export class VendorAddressList {
    rfqVendorAddressId:number;
    rfqVendorId:number;
    addressId:number;
    addressTypeId?: number;
    addressName?: string;
    countryId?: number;
    countryName?: string;
    cityId?: number;
    cityName?: string;
    primaryAddress?: boolean;
    active:boolean;
    createdBy:number;
    updatedBy:number;
  }