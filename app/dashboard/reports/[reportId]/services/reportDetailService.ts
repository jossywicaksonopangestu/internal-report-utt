import {createClient} from '@/lib/supabase/client';
import {ReportStatus} from '../../types';
import {ReportDetail} from '../types';

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

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

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
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('MOP report tidak ditemukan.');
  }

  const files = [...(data.mop_report_files ?? [])].sort((a, b) =>
    a.file_date.localeCompare(b.file_date),
  );

  return {
    id: data.id,
    maintenanceName: data.maintenance_name,
    maintenanceSpec: data.maintenance_spec,
    startDate: data.start_date,
    endDate: data.end_date,
    status: normalizeStatus(data.status),
    adminNote: data.admin_note,
    revisionNote: data.revision_note,
    createdAt: data.created_at,
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

async function updateReportStatus(reportId: string, nextStatus: string) {
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const {error} = await supabase
    .from('mop_reports')
    .update({status: nextStatus})
    .eq('id', reportId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function submitReportToAdmin(reportId: string) {
  await updateReportStatus(reportId, 'pending');
}
