export type ReportStatus = 'ongoing' | 'pending' | 'approved' | 'rejected';

export interface ServiceReportAttachment {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileDate: string;
}

export interface ReportData {
  id: string;
  maintenanceName: string;
  picName: string;
  mainFileName: string;
  startDate: string;
  endDate: string;
  submittedDate: string;
  status: ReportStatus;
  serviceReportCount: number;
  serviceReports: ServiceReportAttachment[];
  adminNote: string | null;
  revisionNote: string | null;
}
