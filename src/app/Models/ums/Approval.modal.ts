export interface Approvals {
    levelId:number,
    levelNumber:number,
    escalationID:number,
    approvalId:number,
    authorizationItemId:number,
    isReportingManager:boolean,
    noOfApproval:string,
    noOfRejection:string,
    userId:number[]

  }

  export interface Approvalslist {
    levelId:number,
    levelNumber:number,
    authorizationitemId:number,
    isReportingManager:boolean,
    noOfApproval:string,
    noOfRejection:string,
    userId:string

  }

  export interface Escalation {
    escalationID:number,
    sequenceOrder:number,
    userId:number[],
    escalationDuration:string,
    frequency:number,
    isReportingManager:boolean,
    isNotifytoRoute:boolean
  }