export interface ContainerType {
    containerTypeId: number;
    containerTypeCode: string;
    containerTypeName: string;
    description:string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
    Isedit:boolean;
  }
