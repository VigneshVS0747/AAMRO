import { ModeofTransports } from "src/app/Models/crm/master/Dropdowns";

export class SalesOpportunity {
  salesOppId: number;
  seaFreight: string;
  airFreight: string;
  customClearance: string;
  transportation: string;
  ioreor: string;
  warehousing: string;
  customerRemarks: string;
  tags: string;
  jobsPerMonth: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  customerName: any;
  customerId: number;
  serviceType: any;
}
export class SOIncoTerms {
  sOIncoId: number;
  salesOppId: number;
  incoTermId: number;
  incoTermDescription: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number | null;
  updatedDate: Date;
}
export class SOCommodity {
  sOCommodityId: number;
  salesOppId: number;
  commodityId: number;
  commodityName?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
}
export class SOTransportModeModel {
  sOTransportModeId: number;
  salesOppId: number;
  modeofTransportId: number;
  modeofTransport: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number | null;
  updatedDate: Date | null;
}


export class SOService {
  sOServiceId: number;
  salesOppId: number;
  serviceSectorId: number;
  serviceSector?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
}
export class SOOrigin {
  soOriginId: number;
  salesOppId: number;
  countryId: number;
  countryName?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
}
export class SODestination {
  sODestinationId: number;
  salesOppId: number;
  countryId: number;
  countryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
}


export class SalesOpportunityContainer {
  salesOpportunity: SalesOpportunity;
  soIncoterms: SOIncoTerms[];
  sOCommodity: SOCommodity[];
  sOTransportMode: SOTransportModeModel[];
  sOService: SOService[];
  sOOrigin: SOOrigin[];
  sODestination: SODestination[];

}
