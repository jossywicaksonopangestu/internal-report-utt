import {createClient} from '@/lib/supabase/client';
import {DashboardData, DashboardStatus, EMPTY_DASHBOARD} from '../types';

const supabase = createClient();

function normalizeStatus(status: string | null): DashboardStatus {
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

  if (['revisi', 'revision', 'rejected', 'reject'].includes(normalized)) {
    return 'rejected';
  }

  if (['ongoing', 'in progress', 'draft'].includes(normalized)) {
    return 'ongoing';
  }

  return 'ongoing';
}

export function getStatusBadge(status: DashboardStatus) {
  if (status === 'pending') {
    return {
      label: 'Menunggu Approval',
      className: 'bg-[#FFF2E8] text-[#D46B08]',
    };
  }

  if (status === 'approved') {
    return {
      label: 'Approved',
      className: 'bg-[#F6FFED] text-[#389E0D]',
    };
  }

  if (status === 'rejected') {
    return {
      label: 'Rejected',
      className: 'bg-[#FFF1F0] text-[#CF1322]',
    };
  }

  return {
    label: 'Ongoing',
    className: 'bg-[#E6F4FF] text-[#1677FF]',
  };
}

export async function getUserDashboardData(): Promise<DashboardData> {
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const [profileResult, mopResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('fullname')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('mop_reports')
      .select('id, maintenance_name, maintenance_spec, status, start_date')
      .eq('user_id', user.id)
      .order('start_date', {ascending: false}),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (mopResult.error) {
    throw new Error(mopResult.error.message);
  }

  const rows = mopResult.data ?? [];

  const counters = rows.reduce(
    (acc, item) => {
      const mappedStatus = normalizeStatus(item.status);
      acc[mappedStatus] += 1;
      return acc;
    },
    {
      ongoing: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );

  const latestMops = rows.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.maintenance_name,
    spec: item.maintenance_spec,
    workDate: item.start_date,
    status: normalizeStatus(item.status),
  }));

  return {
    ...EMPTY_DASHBOARD,
    userName: profileResult.data?.fullname?.trim() || user.email || 'Engineer',
    total: rows.length,
    ongoing: counters.ongoing,
    pending: counters.pending,
    approved: counters.approved,
    rejected: counters.rejected,
    latestMops,
  };
}
