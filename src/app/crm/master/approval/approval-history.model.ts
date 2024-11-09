export interface ApprovalHistory {
    approvalHistoryId: number;
    screenId: number;
    referenceId: number;
    cycle: number;
    levelId: number;
    approverId: number;
    date: Date;
    statusId: number;
    remarks?: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    screen:string;
    employeeName: string;
    levelNumber: number;
    approvalStatus: string;

  }
  export interface ApprovalDashboard {
    approvalDashboardId: number;
    screenId: number;
    referenceId: number;
    levelId: number;
    liveStatus: boolean;
    requestedId: number;
    requestedDate: Date;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    screen:string;
    employeeName: string;
    levelNumber: number
    code:string;
  }
  
  export interface ApprovalLevelsSummary {
    level: number;
    numberOfUsers: number;
    users?: string;
    requiredApproval: number;
    approvedCount: number;
    approvedUsers?: string;
    requiredRejection:number;
    rejectedCount: number;
    rejectedUsers?: string;
    status?:string
  }