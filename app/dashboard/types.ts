export type DashboardStatus = 'ongoing' | 'pending' | 'approved' | 'rejected';

export interface LatestMopItem {
  id: string;
  title: string;
  spec: string;
  workDate: string;
  status: DashboardStatus;
}

export interface DashboardData {
  userName: string;
  total: number;
  ongoing: number;
  pending: number;
  approved: number;
  rejected: number;
  latestMops: LatestMopItem[];
}

export interface DashboardStatusMeta {
  key: DashboardStatus;
  label: string;
  dotClassName: string;
}

export const STATUS_COLORS: Record<DashboardStatus, string> = {
  ongoing: '#3B82F6',
  approved: '#22C55E',
  pending: '#F59E0B',
  rejected: '#EF4444',
};

export const STATUS_CONFIG: DashboardStatusMeta[] = [
  {key: 'ongoing', label: 'Ongoing', dotClassName: 'bg-[#3B82F6]'},
  {key: 'approved', label: 'Approved', dotClassName: 'bg-[#22C55E]'},
  {key: 'pending', label: 'Pending', dotClassName: 'bg-[#F59E0B]'},
  {key: 'rejected', label: 'Rejected', dotClassName: 'bg-[#EF4444]'},
];

export const EMPTY_DASHBOARD: DashboardData = {
  userName: 'Engineer',
  total: 0,
  ongoing: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  latestMops: [],
};

export const SECTION_TITLE_CLASS_NAME =
  'font-inter text-[14px] leading-[21px] md:text-[16px] md:leading-[24px] font-extrabold tracking-normal';
