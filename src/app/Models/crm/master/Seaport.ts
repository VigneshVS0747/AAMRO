export class Seaport{
    SeaportId: number;
    SeaportCode: string;
    SeaportName: string;
    CountryId: number;
    CountryName: string;
    StateId: number;
    StateName: string;
    CityId: number;
    PortTypeId:number;
    PortType:string
    CityName: string;
    Latitude: string;
    Longitude: string;
    Livestatus: boolean;
    CreatedBy: number;
    CreatedDate: Date | string;
    UpdatedBy: number|null;
    UpdatedDate: Date | string;
    Id:number;
    name:string;
  }

export class PortType{
  portTypeId: number;
  portType: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
}