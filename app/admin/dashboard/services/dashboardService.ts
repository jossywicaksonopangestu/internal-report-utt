import {createClient} from '@/lib/supabase/client';

const supabase = createClient();

export type DashboardReportStatus =
  | 'ongoing'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface DashboardStatusSummary {
  total: number;
  ongoing: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface DashboardPendingItem {
  id: string;
  maintenanceName: string;
  picName: string;
  submittedAt: string;
  serviceReportCount: number;
}

export interface DashboardLatestActivityItem {
  id: string;
  maintenanceName: string;
  picName: string;
  updatedAt: string;
  status: DashboardReportStatus;
}

export interface DashboardData {
  statusSummary: DashboardStatusSummary;
  engineerCount: number;
  serviceReportCount: number;
  pendingItems: DashboardPendingItem[];
  latestActivity: DashboardLatestActivityItem[];
}

function normalizeStatus(status: string | null): DashboardReportStatus {
  const normalized = status?.trim().toLowerCase();

  if (!normalized) return 'ongoing';

  if (
    ['pending', 'waiting', 'waiting approval', 'menunggu approval'].includes(
      normalized,
    )
  ) {
    return 'pending';
  }

  if (['approved', 'approve'].includes(normalized)) {
    return 'approved';
  }

  if (['rejected', 'reject', 'revisi', 'revision'].includes(normalized)) {
    return 'rejected';
  }

  return 'ongoing';
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    {data: reportRows, error: reportError},
    {data: engineerRows, error: engineerRowsError},
    {count: serviceReportCount, error: serviceReportError},
  ] = await Promise.all([
    supabase
      .from('mop_reports')
      .select(
        `
        id,
        maintenance_name,
        status,
        created_at,
        updated_at,
        profiles ( fullname ),
        mop_report_files ( id )
      `,
      )
      .order('updated_at', {ascending: false}),
    supabase
      .from('profiles')
      .select('id, roles!inner(name)')
      .eq('roles.name', 'user'),
    supabase.from('mop_report_files').select('*', {count: 'exact', head: true}),
  ]);

  if (reportError) {
    throw new Error(reportError.message);
  }

  if (engineerRowsError) {
    throw new Error(engineerRowsError.message);
  }

  if (serviceReportError) {
    throw new Error(serviceReportError.message);
  }

  const reports = (reportRows ?? []).map((report) => {
    const profileRelation = Array.isArray(report.profiles)
      ? report.profiles[0]
      : report.profiles;
    return {
      id: report.id,
      maintenanceName: report.maintenance_name,
      status: normalizeStatus(report.status),
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      picName: profileRelation?.fullname ?? 'Unknown PIC',
      serviceReportCount: report.mop_report_files?.length ?? 0,
    };
  });

  const statusSummary: DashboardStatusSummary = {
    total: reports.length,
    ongoing: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  reports.forEach((report) => {
    statusSummary[report.status] += 1;
  });

  const pendingItems: DashboardPendingItem[] = reports
    .filter((report) => report.status === 'pending')
    .slice(0, 4)
    .map((report) => ({
      id: report.id,
      maintenanceName: report.maintenanceName,
      picName: report.picName,
      submittedAt: report.createdAt,
      serviceReportCount: report.serviceReportCount,
    }));

  const latestActivity: DashboardLatestActivityItem[] = reports
    .slice(0, 5)
    .map((report) => ({
      id: report.id,
      maintenanceName: report.maintenanceName,
      picName: report.picName,
      updatedAt: report.updatedAt,
      status: report.status,
    }));

  const engineerCount = engineerRows?.length ?? 0;

  return {
    statusSummary,
    engineerCount,
    serviceReportCount: serviceReportCount ?? 0,
    pendingItems,
    latestActivity,
  };
}
