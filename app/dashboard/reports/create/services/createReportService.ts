import {createClient} from '@/lib/supabase/client';
import {TablesInsert} from '@/lib/types/supabase';
import {CreateReportFormData, ReportFileInput} from '../types';

const supabase = createClient();
const REPORT_FILES_BUCKET = 'mop-files';

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
}

async function uploadReportFiles(
  reportId: string,
  reportFiles: ReportFileInput[],
) {
  const uploadedRows: TablesInsert<'mop_report_files'>[] = [];

  for (let index = 0; index < reportFiles.length; index += 1) {
    const reportFile = reportFiles[index];
    if (!reportFile.file) {
      continue;
    }

    const file = reportFile.file;
    const filePath = `${reportId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;

    const {error: uploadError} = await supabase.storage
      .from(REPORT_FILES_BUCKET)
      .upload(filePath, file, {upsert: false});

    if (uploadError) {
      const message = uploadError.message.toLowerCase();
      if (message.includes('bucket')) {
        throw new Error(
          `Storage bucket '${REPORT_FILES_BUCKET}' belum tersedia. Buat bucket tersebut di Supabase Storage.`,
        );
      }
      throw new Error(
        `Gagal upload file '${file.name}': ${uploadError.message}`,
      );
    }

    const {data: publicData} = supabase.storage
      .from(REPORT_FILES_BUCKET)
      .getPublicUrl(filePath);

    uploadedRows.push({
      report_id: reportId,
      title: reportFile.title.trim(),
      description: reportFile.description.trim() || null,
      file_date: reportFile.fileDate,
      file_name: file.name,
      file_url: publicData.publicUrl,
    });
  }

  return uploadedRows;
}

export async function createMopReport(payload: CreateReportFormData) {
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const reportPayload: TablesInsert<'mop_reports'> = {
    user_id: user.id,
    maintenance_name: payload.maintenanceName.trim(),
    maintenance_spec: payload.maintenanceSpec.trim(),
    start_date: payload.startDate,
    end_date: payload.endDate,
    status: 'ongoing',
  };

  const {data: reportData, error: reportError} = await supabase
    .from('mop_reports')
    .insert(reportPayload)
    .select('id')
    .single();

  if (reportError || !reportData) {
    throw new Error(reportError?.message || 'Gagal membuat data MOP report.');
  }

  const uploadedRows = await uploadReportFiles(
    reportData.id,
    payload.reportFiles,
  );

  if (!uploadedRows.length) {
    throw new Error('Tidak ada file report yang berhasil diproses.');
  }

  const {error: insertFilesError} = await supabase
    .from('mop_report_files')
    .insert(uploadedRows);

  if (insertFilesError) {
    throw new Error(insertFilesError.message);
  }

  return reportData.id;
}
