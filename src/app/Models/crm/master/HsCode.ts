export class HsCode {
  HSCodeId: number;
  HSCode: string;
  HSCodeDescription: string;
  ECCN?: string | null; // Nullable property
  HSCodeCategoryId: number;
  hsCodeCategoryName?: string;
  CountryId: number;
  CountryName?: string;
  Livestatus: boolean;
  Remarks?: string | null; // Nullable property
  CreatedBy: number;
  CreatedDate: Date | string;
  UpdatedBy?: number | null; // Nullable property
  UpdatedDate: Date | string;
}

export class HsCodePermit {
  hsCodePermitId: number;
  hsCodeId: number;
  permitId: number;
  permitCode: string;
  permitName: string;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
  IseditPermit: boolean;
  newPermit: boolean;
}

export class HsCodePart {
  hSCodePartId: number;
  hSCodeId: number;
  partId: number | null;
  duty: number| null;
  tax: number| null;
  addTax: number| null;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
  IseditPart: boolean;
  partName: string;
  partNumber: string| null;
  newPart: boolean;
}

export class HsCodeDocument {
  HSCodeDocumentId: number;
  HSCodeId: number;
  DocumentId: number;
  livestatus: boolean;
  CreatedBy: number;
  CreatedDate: Date | string;
  UpdatedBy: number | null;
  UpdatedDate: Date | string;
  IseditDoc: boolean;
  documentName: string;
  documentCode: string;
  remarks: string;
  newDoc: boolean;
}

export class HsCodeModelContainer {
  hsCodes: HsCode;
  hsCodePermits: HsCodePermit[];
  hsCodeParts: HsCodePart[];
  hsCodeDocuments: HsCodeDocument[];
}

export class HsCodeCategory {
  hsCodeCategoryId: number;
  hsCodeCategoryCode: string;
  hsCodeCategoryName: string;
  description: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
}

export class Permitdetails {
  permitId: number;
  permitCode: string;
  permitName: string;
  countryId: number;
  countryName: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
}

export class Partdetails {
  PartId: number;
  PartNumber: number;
  partNumber: number
  PartName: string;
  PartDescription: string;
  Livestatus: boolean;
  CreatedBy: number;
  CreatedDate: Date | string;
  UpdatedBy: number | null;
  UpdatedDate: Date | string;
}

export class Documents {
  documentId: number;
  documentCode: string;
  documentName: string;
  remarks: string;
  livestatus: boolean;
  createdBy: number;
  createdDate: Date | string;
  updatedBy: number | null;
  updatedDate: Date | string;
  Isedit: boolean;
}