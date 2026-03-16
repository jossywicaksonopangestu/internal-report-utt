import {createClient} from '@/lib/supabase/client';
import {TablesUpdate} from '@/lib/types/supabase';
import {ReportData, ReportStatus} from '../types';

const supabase = createClient();

function normalizeStatus(status: string | null): ReportStatus {
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

export interface MonitoringReportDetail {
  id: string;
  maintenanceName: string;
  maintenanceSpec: string;
  picName: string;
  startDate: string;
  endDate: string;
  status: ReportStatus;
  submittedAt: string;
  updatedAt: string;
  adminNote: string | null;
  revisionNote: string | null;
  serviceReports: Array<{
    id: string;
    title: string;
    description: string;
    fileDate: string;
    fileName: string;
    fileUrl: string;
  }>;
}

export async function getMonitoringReports(): Promise<ReportData[]> {
  const {data, error} = await supabase
    .from('mop_reports')
    .select(
      `
      id,
      maintenance_name,
      start_date,
      end_date,
      created_at,
      status,
      admin_note,
      revision_note,
      profiles ( fullname ),
      mop_report_files (
        id,
        title,
        file_url,
        file_name,
        file_date
      )
    `,
    )
    .order('created_at', {ascending: false});

  if (error) throw new Error(error.message);

  return (data ?? []).map((report) => {
    const profileRelation = Array.isArray(report.profiles)
      ? report.profiles[0]
      : report.profiles;
    const files = [...(report.mop_report_files ?? [])].sort((a, b) =>
      a.file_date.localeCompare(b.file_date),
    );

    return {
      id: report.id,
      maintenanceName: report.maintenance_name,
      picName: profileRelation?.fullname ?? 'Unknown Engineer',
      mainFileName: files[0]?.file_name ?? '-',
      startDate: report.start_date,
      endDate: report.end_date,
      submittedDate: report.created_at,
      status: normalizeStatus(report.status),
      serviceReportCount: files.length,
      serviceReports: files.map((file) => ({
        id: file.id,
        title: file.title?.trim() || file.file_name,
        fileName: file.file_name,
        fileUrl: file.file_url ?? '',
        fileDate: file.file_date,
      })),
      adminNote: report.admin_note,
      revisionNote: report.revision_note,
    };
  });
}

export async function getMonitoringReportDetail(
  reportId: string,
): Promise<MonitoringReportDetail> {
  const {data, error} = await supabase
    .from('mop_reports')
    .select(
      `
      id,
      maintenance_name,
      maintenance_spec,
      start_date,
      end_date,
      status,
      admin_note,
      revision_note,
      created_at,
      updated_at,
      profiles ( fullname ),
      mop_report_files (
        id,
        title,
        description,
        file_date,
        file_name,
        file_url
      )
    `,
    )
    .eq('id', reportId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Data MOP tidak ditemukan.');

  const profileRelation = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;
  const files = [...(data.mop_report_files ?? [])].sort((a, b) =>
    a.file_date.localeCompare(b.file_date),
  );

  return {
    id: data.id,
    maintenanceName: data.maintenance_name,
    maintenanceSpec: data.maintenance_spec,
    picName: profileRelation?.fullname ?? 'Unknown Engineer',
    startDate: data.start_date,
    endDate: data.end_date,
    status: normalizeStatus(data.status),
    submittedAt: data.created_at,
    updatedAt: data.updated_at,
    adminNote: data.admin_note,
    revisionNote: data.revision_note,
    serviceReports: files.map((file) => ({
      id: file.id,
      title: file.title,
      description: file.description ?? '-',
      fileDate: file.file_date,
      fileName: file.file_name,
      fileUrl: file.file_url,
    })),
  };
}

export async function approveReport(reportId: string, note?: string) {
  const payload: TablesUpdate<'mop_reports'> = {
    status: 'approved',
    admin_note: note?.trim() || null,
    revision_note: null,
  };

  const {error} = await supabase
    .from('mop_reports')
    .update(payload)
    .eq('id', reportId);

  if (error) throw new Error(error.message);
}

export async function rejectReport(reportId: string, notes: string) {
  const payload: TablesUpdate<'mop_reports'> = {
    status: 'rejected',
    revision_note: notes.trim(),
  };

  const {error} = await supabase
    .from('mop_reports')
    .update(payload)
    .eq('id', reportId);

  if (error) throw new Error(error.message);
}
