import { EnqPackage } from "./EnquiryPackage";

export class Enquiry {
    enquiryId: number;
    enquiryNumber: string;
    enquiryDate: Date;
    expiryDate: Date;
    customerCategoryId:number;
    customerName: string;
    customerId: number;
    email: string;
    phone: string;
    addressId: number;
    contactId:number[];
    salesOwnerId: number;
    salesExecutiveId: number;
    jobCategoryId: number;
    jobTypeId: number;
    modeofTransportId: number;
    interestLevelId: number;
    informationSourceId: number;
    referenceDetail: string;
    expectedClosingDate:Date;
    statusId: number;
    reasonId: number;
    closedRemarks: string;
    validityPeriod:number;
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
    pickUpLocation: number;
    deliveryPlace: string;
    shipmentTypeId: number;
    containerTypeId: number;
    cargoTypeid: number;
    incoTermId:number[];
    temperatureReq: string;
    commodityId:number[];
    storageUomId: number;
    valuePerUom: string;
    packageNos: string;
    createdBy: number;
    createdDate: string;
    updatedBy: number;
    updatedDate: string;
    selected:boolean;
    salesOwnerName?: string;
    salesExecutiveName?: string;
    jobCategory?: string;
    jobTypeName?: string;
    modeofTransport?: string;
    interestlevel?: string;
    informationSourceName?: string;
    enquiryStatus?: string;
    trailerTypeName?: string;
    shipmentType?: string;
    containerTypeName?: string;
    customercategory?: string;
    addressName?: string;
    reasonName?: string;
    transportType?: string;
    cargoType?: string;
    uomName?: string;
    approvalStatusId: number;
    approvalStatus: string;
    OriginCountryName: string;
  }

  export class Enquiryvaliditycloser {
    enquiry:Enquiry[];
  }
  export class EnquirySalesfunnel {
    number:string;
    type:string;
    date:string;

  }
  export class EnqIncoTerm {
    enquiryIncoId: number;
    enquiryId: number;
    incoTermId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    incoTermDescription: string;
  }
  
  export class EnqCommodity {
    enquirycommodityId: number;
    enquiryId: number;
    commodityId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }

  export class EnqContact {
    enquiryContactId: number;
    enquiryId: number;
    contactId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }

  export class EnqDocument {
    enquiryDocumentId: number;
    enquiryId: number;
    documentId: number;
    documentName: string;
    remarks: string;
    createdBy: number;
    createdDate: Date;
  }
  export class Enqtransportmode {
    enqTransportModeId: number;
    enquiryId: number;
    transportModeId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    commodityName: string;
  }
  
  export class EnquiryCombine{
    enquiryGeneral:Enquiry ;
    contacts:EnqContact[];
    commodity:EnqCommodity[];
    incoTerms:EnqIncoTerm[];
    enqTransportModes:Enqtransportmode[];
    package:EnqPackage[];
    documents:EnqDocument[];
}
