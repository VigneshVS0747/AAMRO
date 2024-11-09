export class FollowUp {
    followUpId: number;
    followUpCode: string;
    followUpDate: Date;
    baseDocNameId: number;
    baseDocId: number;
    followUpUserId: number;
    followUpModeId: number;
    followUpNotes: string;
    statusId: number;
    nextFollowUpDate: Date ;
    nextFollowUpModeId: number;
    nextFollowUpNotes: string;
    followUpAssignedId: number;
    remainder: boolean;
    remainderDate: Date;
    remarks: string;
    tags:string;
    createdBy: number;
    createdDate: Date | string;
    updatedBy: number;
    updatedDate: Date | string;

    modeofFollowUp:string;
    followUpStatus:string;
    nextmodeoffollowUp:string;
    followUpAssigned:string;
    followUpBaseDocname:string;
    baseDocname:string;
    followUpperson:string;


}

export class FollowUpDocuments {
    fUDocumentId: number;
    followUpId: number;
    documentId: number;
    documentName: string;
    remarks: string;
    createdBy: number;
    createdDate: Date | string;
}

export class FollowUpCombine{
    follow_Up:FollowUp ;
    followUp_Documents:FollowUpDocuments[];
    followupId:number
}

export class FollowUplist{
    followUpId:number;
    followUpDate:string;
    followUpBaseDocname:string;
    baseDocname:string;
    followUpperson:string;
    modeofFollowUp:string;
    followUpStatus:string;
    followUpCode:string
}


export class FollowUpHistory {
    followUpDate: string;
    baseDocNameId: number | null;
    followupBaseDoc: string;
    baseDocId: number | null;
    code: string;
    followUpUserId: number;
    employeeName: string;
    followUpModeId: number;
    modeofFollowUp: string;
    statusId: number;
    followUpStatus: string;
  }
  
  export class FollowUpHistoryParms {
    baseDocNameId: number | null;
    baseDocId: number | null;
  }
  