import {ReportStatus} from '../types';

export interface ReportFileDetail {
  id: string;
  title: string;
  description: string;
  fileDate: string;
  fileName: string;
  fileUrl: string;
}

export interface ReportDetail {
  id: string;
  maintenanceName: string;
  maintenanceSpec: string;
  startDate: string;
  endDate: string;
  status: ReportStatus;
  adminNote: string | null;
  revisionNote: string | null;
  createdAt: string;
  serviceReports: ReportFileDetail[];
}

export interface DetailStatusPanel {
  title: string;
  description: string;
  className: string;
}
