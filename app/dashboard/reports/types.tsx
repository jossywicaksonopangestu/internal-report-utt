export type ReportStatus = 'ongoing' | 'pending' | 'approved' | 'rejected';

export interface ReportSummaryItem {
  id: string;
  maintenanceName: string;
  maintenanceSpec: string;
  startDate: string;
  endDate: string;
  status: ReportStatus;
  mainFileName: string;
  serviceReportCount: number;
  adminNote: string | null;
  revisionNote: string | null;
}

export interface ReportSummaryStats {
  total: number;
  ongoing: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ReportsListData {
  stats: ReportSummaryStats;
  items: ReportSummaryItem[];
}

export interface StatusMeta {
  label: string;
  dotClassName: string;
  badgeClassName: string;
}

export const STATUS_META: Record<ReportStatus, StatusMeta> = {
  ongoing: {
    label: 'Ongoing',
    dotClassName: 'bg-[#3B82F6]',
    badgeClassName: 'border border-[#C4D8FF] bg-[#EAF2FF] text-[#2F6FE5]',
  },
  pending: {
    label: 'Menunggu Approval',
    dotClassName: 'bg-[#F59E0B]',
    badgeClassName: 'border border-[#F3DDA5] bg-[#FFF7DF] text-[#D26D00]',
  },
  approved: {
    label: 'Approved',
    dotClassName: 'bg-[#10B981]',
    badgeClassName: 'border border-[#BFE9D8] bg-[#E8FFF4] text-[#0B8E63]',
  },
  rejected: {
    label: 'Rejected',
    dotClassName: 'bg-[#EF4444]',
    badgeClassName: 'border border-[#F5C4C4] bg-[#FFF1F1] text-[#D9363E]',
  },
};
