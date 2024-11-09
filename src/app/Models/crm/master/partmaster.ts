import { BrandDetails } from "./brandDetails";
import { ImageDetails } from "./imagedetails";

export class PartMaster{
    partId:number;
    partNumber:string;
    partName:string;
    modelNumber:string;
    countryId:number;
    partDescription:string;
    livestatus: boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    countryName:number;

  }
  export class PartMasterContainer{
    partMaster: PartMaster;
    brandDetails:BrandDetails[];
    imageDetails:ImageDetails[];
    message:string;
  }