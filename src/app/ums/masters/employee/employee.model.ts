export interface Employee {
    employeeId: number;
    employeeCode: string;
    employeeName: string;
    departmentId: number;
    departmentName: string;
    reportingTo: number;
    reportingName: string;
    designationId: number;
    designationName: string;
    branchId: number;
    branchName: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    email: string;
    contactNumber: string;
    doj:Date|null;
    address: string;
    empSignature: string;
    livestatus: boolean;
    createdBy: number;
    createdDate:Date | string;
    updatedBy: number|null;
    updatedDate:Date | string;
  }