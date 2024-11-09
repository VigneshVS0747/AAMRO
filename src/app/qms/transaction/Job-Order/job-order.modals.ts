export class JobOrderDetails {
    jobOrderId: number;
    jobOrderNumber: string;
    jobOrderDate: any;
    jobOrderAgainstId: number;
    refNumberId?: number;
    referenceNumber1: string;
    referenceNumber2?: string;
    customerId: number;
    customerAddressId: number;
    customerContactId: number;
    billCurrencyId: number;
    exchangeRate?: any;
    jobCategoryId: number;
    jobTypeId: number;
    salesOwnerId: number;
    salesExecutiveId: number;
    jobOwnerId: number;
    jobOrderStageId: number;
    jobOrderStatusId: number;
    jobClosingDate?: any;
    cancelReasonId?: number | null;
    cancelRemarks?: string;
    billOfEntry?: string;
    remarks?: string;
    tags?: string;
    originCountryId: number;
    destCountryId: number;
    loadingPortId?: number | null;
    destinationPortId?: number | null;
    originLocationId?: number | null;
    destLocationId?: number | null;
    pickUpLocation?: string ;
    deliveryPlace?: string;
    transitTime?: string;
    routing?: string;
    temperatureReq?: string;
    cargoTypeId?: number | null;
    incoTermId: number | null;
    flightNumber?: any;
    flightName?: any;
    mawbNumber?: any;
    mblNumber?: any;
    wmsOrderNumber?: any;
    rmaNumber?: any;
    wmsOrderStatus?: any;
    packageNos?: any;
    overallCIFValue?: any;
    cifCurrencyId?: any;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    isJOExpenseBooking: any;
    isJORevenueBooking: any;


    customerName?: string;
    contractNumber?: string;
    addressName?: string;
    jobTypeName?: string;
    employeeName?: string;
    jobStage?: string;
    jobStageStatus?: string;
    jobOwnerName?: string;
    joAgainst?: string;
    contactPerson?: string;
    currencyName?: string;
    jobCategory?: string;
    salesOwner?: string;
    salesExecutive?: string;
    reasonName?: string;
    originCountry?: string;
    destinationCountry?: string;
    originLocation?: string;
    destinationLocation?: string;
    cargoType?: string;
    incoTermDescription?: string;
    incoTermCode?:any;
    cifCurrencyName?:any;
}

export class JOTransportModeModal {
    joTransportModeId: number;
    jobOrderId: number;
    transportModeId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
}

export class JOCommodityModal {
    joCommodityId: number;
    jobOrderId: number;
    commodityId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
}

export class JOAirModeModal {
    joAirModeId: number;
    jobOrderId: number;
    hawbNumber: string |null;
    shipper: string |null;
    consignee: string |null;
    notifyparty: string |null;
    etd?: any |null; // Optional
    eta?: any |null; // Optional
    stageId: any |null;
    statusId: any |null;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    rowNumber: any;
    jobStage: string |null;
    jobStageStatus:string |null;
    preferenceOrder: any;
    joAirStatusHistoryModal:[]=[];
}

export class JOSeaModeModal {
    joSeaModeId: number;
    jobOrderId: number;
    hblNumber: string;
    shipmentTypeId: number;
    containerTypeId: number;
    containerNumber: string;
    shipper: string;
    consignee: string;
    notifyparty: string;
    vesselName?: string;
    sealNumber?: string;
    voyageNumber?: string;
    etd?: Date;
    eta?: Date;
    stageId: number;
    statusId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    rowNumber: any;
    jobStage: string |null;
    jobStageStatus:string |null;
    shipmentType: any;
    containerTypeName: any;
    preferenceOrder: any;
    joSeaStatusHistoryModal:[]=[];
}

export class JORoadModeModal {
    joRoadModeId: number;
    jobOrderId: number;
    trackingNumber: string;
    transportTypeId: number;
    trailerTypeId: number;
    etd?: Date;
    eta?: Date;
    stageId: number;
    statusId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    rowNumber:any;
    transportType: string |null;
    trailerTypeName:string |null;
    jobStage: string |null;
    jobStageStatus:string |null;
    preferenceOrder: any;
    joRoadStatusHistoryModal:[]=[];
}

export class JOPartDetailModal {
    joPartDetailId: number;
    jobOrderId: number;
    partId: number;
    hsCodeDestinationId: number;
    hsCodeOriginId?: number;
    partCIFValue: any;
    dutypercent: any;
    dutyValue: any;
    additionalTaxPercent: any;
    additionalTaxValue: any;
    eccnNumber?: string;
    quantity: any;
    netWeight: any;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    partName:any;
    partNumber:any;
    hsDestination:any;
    hsOrigin:any;
    partDescription:any;
    rowNumber:any;
}

export interface JOPackageModal {
    joPackageId: number;
    jobOrderId: number;
    packageTypeId: number;
    commodityId?: number;
    height?: number;
    length?: number;
    breadth?: number;
    cbm?: number;
    packWeightKg?: number;
    chargePackWtKg?: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    packageTypeName:string;
    commodityName:string;
}

export class JOLineItemModal {
    joLineItemId: number;
    jobOrderId: number;
    lineItemCategoryId: number;
    lineItemId: number;
    isVendor: boolean;
    vendorId?: number;
    regionId: number;
    serviceInId: number;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    rowNumber:any;
    lineItemName: any;
    lineItemCode: any;
    lineItemCategoryName: any;
    vendorName: any;
    countryName: any;
    regionName: any;
    refNumber: any;
    sourceFrom: any;
    sourceFromId: any;
    refNumberId: any;
}

export class JOLIVendorModal {
    jolIVendorValueId: number;
    joLineItemId: number;
    sourceFromId: number;
    refNumberId?: number;
    aamroLineItemCatId: number;
    vendorLineItem: string;
    calculationParameterId: number;
    calculationTypeId: number;
    valueInVendorCurrency: number;
    valueInCompanyCurrency: number;
    minValueInVendorCurrency: number;
    minValueInCompanyCurrency: number;
    taxId: number;
    taxPercentage: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
}

export class JODocumentModal {
    joDocumentId: number;
    jobOrderId: number;
    documentId: number;
    mandatory: boolean;
    isCollected: boolean;
    collectedDate?: Date;
    documentName: string;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    documentTypeName: string;
    IseditDocCheck: boolean;
    files: string;
    rowNumber:any;
}

export class JOStatusHistoryModal {
    joStatusHisId: number;
    jobOrderId: number;
    date: Date;
    stageId: number;
    statusId: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
}

export class joAirStatusHistoryModal {
    joAirStatusHisId: number;
    jobOrderId: number;
    joAirModeId: number;
    date: Date;
    stageId: number;
    statusId: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    preferenceOrder: any;
}

export class joSeaStatusHistoryModal {
    joSeaStatusHisId: number;
    jobOrderId: number;
    joSeaModeId: number;
    date: Date;
    stageId: number;
    statusId: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    preferenceOrder: any;
}

export class joRoadStatusHistoryModal {
    joRoadStatusHisId: number;
    jobOrderId: number;
    joRoadModeId: number;
    date: Date;
    stageId: number;
    statusId: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    preferenceOrder: any;
}



export class joborderstatus {
    joStatusId: number  |null;
    jobOrderId: number|null;
    jobTypeId:number|null;
    modeofTransportId:number|null;
    refNumberId:number|null;
    date: Date |null;
    jobOrderStageId: number|null;
    jobOrderStatusId: number|null;
    remarks?: string|null;
    createdBy: number|null;
    createdDate: Date|null;
    updatedBy: number|null;
    updatedDate: Date|null;

   modeofTransport:string|null;
   jobStageStatus :string|null;
   jobStage :any;
   number :string|null;
}

export class joborderstauslist{

    joborderstatus:joborderstatus[] ;
}
