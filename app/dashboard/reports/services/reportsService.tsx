import {createClient} from '@/lib/supabase/client';
import {ReportStatus, ReportsListData} from '../types';

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

export async function getUserReports(): Promise<ReportsListData> {
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
      mop_report_files ( id, file_name, file_date )
    `,
    )
    .eq('user_id', user.id)
    .order('start_date', {ascending: false});

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []).map((row) => {
    const files = [...(row.mop_report_files ?? [])].sort((a, b) =>
      a.file_date.localeCompare(b.file_date),
    );
    const mainFileName = files[0]?.file_name ?? '-';
    const status = normalizeStatus(row.status);

    return {
      id: row.id,
      maintenanceName: row.maintenance_name,
      maintenanceSpec: row.maintenance_spec,
      startDate: row.start_date,
      endDate: row.end_date,
      status,
      mainFileName,
      serviceReportCount: files.length,
      adminNote: row.admin_note,
      revisionNote: row.revision_note,
    };
  });

  const stats = items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] += 1;
      return acc;
    },
    {
      total: 0,
      ongoing: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );

  return {
    stats,
    items,
  };
}
