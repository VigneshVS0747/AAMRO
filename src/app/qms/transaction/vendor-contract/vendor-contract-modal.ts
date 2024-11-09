export class VendorContractDetails {
    vcffsDetailId: number;
    vendorContractFFSId: number;
    aamroLineItemCatId: number;
    vendorLineItem: string;
    calculationParameterId: number;
    calculationTypeId: number;
    unitValue: number;
    taxId: number;
    taxPercentage: number;
    minValue: number;
    remarks: string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    lineItemCategoryName: string;
    calculationParameter: string;
    calculationType: string;
    taxCodeName: string;
    vendorContractMappingModal:[]=[]
}

export class VendorContractMappingModals {
    vcffsMappingId: any;
    vcffsDetailId: number;
    aamroLineItemCatId: number;
    aamroLineItemId: number;
    calculationParameterId: number;
    calculationTypeId: number;
    valueInVendorCurrency: number;
    minValueInVendorCurrency: number;
    taxId: number;
    taxPercentage: number;
    remarks: string;
    livestatus: boolean;
    createdBy: number;
    createdDate: null;
    updatedBy: number;
    updatedDate: string;
    lineItemCategoryName: string;
    lineItemName: string;
    calculationParameter: string;
    calculationType: string;
    taxCodeName: string;
    Isedit:boolean;
    rowNumber:string;
    cancelId:string;
}