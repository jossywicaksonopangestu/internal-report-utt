import {NextResponse} from 'next/server';
import {createAdminClient} from '@/lib/supabase/admin';
import {createClient} from '@/lib/supabase/server';

function normalizeStatus(status: string | null) {
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

export async function GET() {
  try {
    const authClient = await createClient();
    const {
      data: {user},
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const supabase = createAdminClient();

    const {data: reportsData, error: reportError} = await supabase
      .from('mop_reports')
      .select(
        `
        id,
        maintenance_name,
        created_at,
        status,
        admin_note,
        revision_note,
        mop_report_files (
          id,
          title,
          description,
          file_name,
          file_url
        )
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', {ascending: false});

    if (reportError) {
      return NextResponse.json({error: reportError.message}, {status: 400});
    }

    const responseData = (reportsData ?? []).map((report) => ({
      id: report.id,
      task_id: report.id,
      task_name: report.maintenance_name,
      submitted_at: report.created_at,
      status: normalizeStatus(report.status),
      admin_note: report.admin_note,
      rejection_notes: report.revision_note,
      report_evidences: (report.mop_report_files ?? []).map((file) => ({
        id: file.id,
        action_title: file.title,
        action_image_url: file.file_url,
        action_description: file.description,
        outcome_title: file.title,
        outcome_image_url: file.file_url,
        outcome_description: file.description,
        file_name: file.file_name,
      })),
    }));

    return NextResponse.json({data: responseData});
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Internal server error'},
      {status: 500},
    );
  }
}
