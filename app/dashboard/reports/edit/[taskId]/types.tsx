export interface EditReportDetail {
  id: number;
  reportId: number;
  mopTitle: string;
  docNumber: string;
  category: string;
  scheduledDate: string;
  picName: string;
  rejectionNotes?: string;
}

export interface EditEvidenceItem {
  actionTitle: string;
  actionFileList?: any[];
  actionDesc: string;

  outcomeTitle: string;
  outcomeFileList?: any[];
  outcomeDesc: string;
}

export interface EditReportFormValues {
  supervisorName: string;
  evidences: EditEvidenceItem[];
}
