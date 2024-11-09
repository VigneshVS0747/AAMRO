export class JobTypeGeneral {
  jobTypeId: number;
  jobTypeCode: string ;
  jobTypeName: string ;
  jobCategoryId: number;
  //transportModeId: number ;
  incoTermId: number;
  partDetails: boolean;
  remarks: string ;
  termsandConditions: string ;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  incoTermCode: string ;
  jobCategory: string ;
  modeofTransport: string;
  JobCategory:string;
  packageDetails:boolean;
  }
  export interface JTModeofTransport {
    jtModeofTransportId: number;
    jobTypeId: number;
    modeofTransportId: number;
    createdBy: number;
    createdDate: Date; 
    updatedBy: number
    updatedDate: Date; 
  }
  
  export class JobTypeLineItem {
    jtypeLineItemId: number;
    jobTypeId: number;
    lineItemId: number;
    invoicingFlagId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    lineItemName: string;
    invoicingFlag: string;
    lineItemCategoryName:string;
    IseditLineItem:boolean;
    lineItemCode:string;
    newLineItem: boolean;
    lineItemCategoryId:number;
  }

  
  export class JobTypeStatus {
    jtypeStageId: number;
    jobTypeId: number;
    jobStage: string;
    preferenceOrder: string;
    milestoneFlag: boolean;
    statusId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    jobStageStatus: string;
    IseditStatus:boolean
    newStatus:boolean;
    jtPredefinedStage: any;
    jtPredefinedStageId: number;
  }
  
  export class JobTypeDocument {
    jtypeDocumentId: number;
    jobTypeId: number;
    documentId: number;
    mandatory:boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    documentName: string;
    documentCode: string;
    remarks:string;
    IseditDoc:boolean;
    newDoc:boolean;
  }
  
  // export class JobTypeTermsAndConditions {
  //   termsandConditionsId: number;
  //   jobTypeId: number;
  //   termsandConditions: string;
  //   liveStatus: boolean;
  //   createdBy: number;
  //   createdDate: Date;
  //   updatedBy: number;
  //   updatedDate: Date;
  // }

  export class JobTypeModelContainer
  {
    jobTypeGeneral: JobTypeGeneral;
    jobTypeLineItems: JobTypeLineItem[];
    jobTypeStatuses: JobTypeStatus[];
    jobTypeDocuments: JobTypeDocument[];
    jtModeofTransport: JTModeofTransport[];

  //  jobTypeTermsAndConditions: JobTypeTermsAndConditions;
  }
  export class StatusTypeInJobTypes {
    jobStageStatusId: number;
    jobStageStatus: string;
    jobStageStatusCode:string;
    liveStatus: boolean;
  }
  export class InvoicingFlags {
    invoicingFlagId: number;
    invoicingFlag: string;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
  }
 export class JobCategory {
    jobCategoryId: number;
    jobCategoryCode: string;
    jobCategory: string;
    livestatus: boolean; 
  } 
  // export class ModeofTransports {
  //   modeofTransportId: number;
  //   modeofTransport: string;
  //   modeofTransportCode: string;
  //   livestatus: boolean; 
  // } 