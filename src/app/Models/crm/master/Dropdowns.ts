export interface Intrestlevel {
  interestlevelId: number;
  interestlevel: string;
}
export interface ModeofFollowUp {
  modeofFollowUpId: number;
  modeofFollowUp: string;
  liveStatus: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export interface groupCompany
{
  groupCompanyId: number;
  companyCode: string;
  companyName: string;
  address: string;
  countryId: number;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export interface StatusTypeInPC {
  pcStatusId: number;
  pcStatus: string;
}
export interface StatusTypeInC {
  cStatusId: number;
  cStatus: string;
}
export interface BillingCurrencys {
  billingCurrencyId: number;
  billingCurrency: string;
  billingCurrencyCode: string;
  liveStatus: boolean;
}

export interface StatsuTypeInPVs {
  pvStatusId: number;
  pvStatus: string;
  liveStatus: boolean;
  PVStatusCode: string;
}
export class CVTypeModel {
  cvTypeId: number;
  cvType: string;
  liveStatus: boolean;
  cvTypeCode: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export class ReportingStageModel {
  reportingStageId: number;
  reportingStage: string;
  reportingStageCode: string;
  liveStatus: boolean;
}
export class PQAgainst {
  pqAgainstId: number;
  pqAgainst: string;
  livestatus: boolean;
  pqAgainstCode: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export class CargoTypes {
  cargoTypeId: number;
  cargoType: string;
}
export class Transport {
  transportTypeId: number;
  transportType: string;
}

export class ShipmentTypes {
  shipmentTypeId: number;
  shipmentType: string;
}
export class RFQStatus {
  rfqStatusId: number;
  rdqStatus: string;
}
export class PQStatus {
  pqStatusId: number;
  pqStatus: string;
}

  export interface ModeofFollowUp {
    modeofFollowUpId: number;
    modeofFollowUp: string;
    liveStatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
  }
  export interface StatusTypeInPC {
    pcStatusId: number;
    pcStatus: string;
  }
  export interface StatusTypeInC {
    cStatusId: number;
    cStatus: string;
  }
  export interface BillingCurrencys {
    billingCurrencyId: number;
    billingCurrency: string;
    billingCurrencyCode: string;
    liveStatus: boolean;
  }
  export class FollowupBaseDoc {
    followupBaseDocId: number;
    followupBaseDoc: string;
    livestatus: boolean;
    followupBaseDocCode: string | null;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number;
    updatedDate: Date | string;
}
export class FollowupStatus {
  followUpStatusId: number;
  followUpStatus: string;
  livestatus: boolean;
  followupBaseDocCode: string | null;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number;
  updatedDate: Date | string;
}

export class ModeofTransports {
  modeofTransportId: number;
  modeofTransport: string;
  modeofTransportCode: string;
  livestatus: boolean; 
} 
export class JobModeofTransports {
  modeofTransportId: number;
  modeofTransport: string;
  modeofTransportCode: string;
  livestatus: boolean; 
} 
export class CalculationParameters {
  calculationParameterId: number;
  calculationParameter: string | null;
  calculationTypeId: number;
  calculationType: string | null;
}
export class CalculationTypes {
  calculationTypeId: number;
  calculationType: string | null;
}

export interface RfqAgainst {
  rfqAgainstId: number;
  rfqAgainst: string;
  rfqAgainstCode: string | null;
  liveStatus: boolean;
}
export class VendorRankings {
  vendorRankingId: number;
  vendorRanking: string;
}
export class VendorStatus {
  vStatusId: number;
  vStatus: string;
}
export class AddressCategorys
{
  addressCategoryId: number;
  addressCategory:string;
}
export class cDocument
{
  cDocumentId: number;
  documentId:number;
  documentName:string;
}
export class DocumentChecklists
{
  screenId: number;
  screen:string;
  menuId:number;
}
export class ServiceSector
{
  serviceSectorId: number;
  serviceSector:string;
  serviceSectorCode:string;
}
export class ApprovalStatusModel
{
  approvalStatusId: number;
  approvalStatus:string;
}

export class quotationAgainst {
  qAgainstId: number;
  qAgainst: string;
  qAgainstCode: string;
  livestatus: boolean;
}



export class quotationStatus {
  qStatusId: number;
  qStatus: string;
  qStatusCode: string;
  livestatus: boolean;
}

export class quotationCRStatus {
  qcrStatusId: number;
  qcrStatus: string;
  qcrStatusCode: string;
  livestatus: boolean;
}

export class sourceFrom {
  sourceFromId: number;
  sourceFrom: string;
  sourceFromCode: string;
  livestatus: boolean;
}

export class ExchangeModel {
  exchangeId: number;
  exchangeDate: Date;
  currencyId: number;
  branchId: number;
  exchangerate: number;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export interface DefaultSettings {
  settingId: number;
  settingName?: string;
  tableName?: string;
  defaultColumnName?: string;
  defaultValueId: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
export class Dropdown {
  id: number;
  name: string;
}
