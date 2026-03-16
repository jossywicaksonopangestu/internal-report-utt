import {createClient} from '@/lib/supabase/client';
import {TablesInsert, TablesUpdate} from '@/lib/types/supabase';
import {CreateReportFormData, ReportFileInput} from '../../../create/types';

const supabase = createClient();
const REPORT_FILES_BUCKET = 'mop-files';

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
}

async function requireUser() {
  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  return user;
}

async function uploadNewFile(reportId: string, reportFile: ReportFileInput) {
  if (!reportFile.file) {
    return {
      fileName: reportFile.existingFileName ?? '',
      fileUrl: reportFile.existingFileUrl ?? '',
    };
  }

  const filePath = `${reportId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFileName(reportFile.file.name)}`;

  const {error: uploadError} = await supabase.storage
    .from(REPORT_FILES_BUCKET)
    .upload(filePath, reportFile.file, {upsert: false});

  if (uploadError) {
    const message = uploadError.message.toLowerCase();
    if (message.includes('bucket')) {
      throw new Error(
        `Storage bucket '${REPORT_FILES_BUCKET}' belum tersedia. Buat bucket tersebut di Supabase Storage.`,
      );
    }

    throw new Error(
      `Gagal upload file '${reportFile.file.name}': ${uploadError.message}`,
    );
  }

  const {data: publicData} = supabase.storage
    .from(REPORT_FILES_BUCKET)
    .getPublicUrl(filePath);

  return {
    fileName: reportFile.file.name,
    fileUrl: publicData.publicUrl,
  };
}

export async function getMopReportForEdit(
  reportId: string,
): Promise<CreateReportFormData> {
  const user = await requireUser();

  const {data, error} = await supabase
    .from('mop_reports')
    .select(
      `
      id,
      maintenance_name,
      maintenance_spec,
      start_date,
      end_date,
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

  const reportFiles = (data.mop_report_files ?? []).map((file) => ({
    title: file.title,
    description: file.description ?? '',
    fileDate: file.file_date,
    file: null,
    existingFileName: file.file_name,
    existingFileUrl: file.file_url,
  }));

  return {
    maintenanceName: data.maintenance_name,
    maintenanceSpec: data.maintenance_spec,
    startDate: data.start_date,
    endDate: data.end_date,
    reportFiles,
  };
}

export async function updateMopReport(
  reportId: string,
  payload: CreateReportFormData,
) {
  const user = await requireUser();

  const reportPayload: TablesUpdate<'mop_reports'> = {
    maintenance_name: payload.maintenanceName.trim(),
    maintenance_spec: payload.maintenanceSpec.trim(),
    start_date: payload.startDate,
    end_date: payload.endDate,
    status: 'pending',
  };

  const {error: reportError} = await supabase
    .from('mop_reports')
    .update(reportPayload)
    .eq('id', reportId)
    .eq('user_id', user.id);

  if (reportError) {
    throw new Error(reportError.message);
  }

  const rows: TablesInsert<'mop_report_files'>[] = [];

  for (const reportFile of payload.reportFiles) {
    const {fileName, fileUrl} = await uploadNewFile(reportId, reportFile);

    if (!fileUrl || !fileName) {
      continue;
    }

    rows.push({
      report_id: reportId,
      title: reportFile.title.trim(),
      description: reportFile.description.trim() || null,
      file_date: reportFile.fileDate,
      file_name: fileName,
      file_url: fileUrl,
    });
  }

  if (!rows.length) {
    throw new Error('Tidak ada file report yang berhasil diproses.');
  }

  const {error: deleteError} = await supabase
    .from('mop_report_files')
    .delete()
    .eq('report_id', reportId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const {error: insertError} = await supabase
    .from('mop_report_files')
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}
