export interface Reason{
    reasonId:number;
    reasonCode:string;
    reasonName:string;
    reasonFlag:string;
    reasonFlagId:number;
    remarks:string;
    livestatus:boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date | string;
    Isedit:boolean;
}
export interface ReasonFlag{
    reasonFlagId:number;
    reasonFlag: string;
    livestatus:boolean;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number|null;
    updatedDate: Date| string
}