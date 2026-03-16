import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  CreateReportFormData,
  CreateReportFormErrors,
  ReportFileInput,
  ReportFileInputErrors,
} from '../../../create/types';
import {
  getMopReportForEdit,
  updateMopReport,
} from '../services/editReportService';

const blankReportFile = (): ReportFileInput => ({
  title: '',
  description: '',
  fileDate: '',
  file: null,
});

const initialForm: CreateReportFormData = {
  maintenanceName: '',
  maintenanceSpec: '',
  startDate: '',
  endDate: '',
  reportFiles: [blankReportFile()],
};

function validate(form: CreateReportFormData) {
  const errors: CreateReportFormErrors = {};
  const fileItemErrors: ReportFileInputErrors[] = form.reportFiles.map(
    () => ({}),
  );

  if (!form.maintenanceName.trim()) {
    errors.maintenanceName = 'Nama maintenance wajib diisi.';
  }

  if (!form.maintenanceSpec.trim()) {
    errors.maintenanceSpec = 'Spesifikasi maintenance wajib diisi.';
  }

  if (!form.startDate) {
    errors.startDate = 'Tanggal mulai wajib diisi.';
  }

  if (!form.endDate) {
    errors.endDate = 'Tanggal selesai wajib diisi.';
  }

  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = 'Tanggal selesai harus sama atau setelah tanggal mulai.';
  }

  if (!form.reportFiles.length) {
    errors.reportFiles = 'Minimal satu file report wajib ditambahkan.';
  }

  form.reportFiles.forEach((reportFile, index) => {
    if (!reportFile.title.trim()) {
      fileItemErrors[index].title = 'Judul file wajib diisi.';
    }

    if (!reportFile.description.trim()) {
      fileItemErrors[index].description = 'Deskripsi file wajib diisi.';
    }

    if (!reportFile.fileDate) {
      fileItemErrors[index].fileDate = 'Tanggal file wajib diisi.';
    }

    if (!reportFile.file && !reportFile.existingFileUrl) {
      fileItemErrors[index].file = 'Pilih file untuk item ini.';
    }
  });

  return {errors, fileItemErrors};
}

export function useEditReport(reportId: string) {
  const notify = useAppNotification();
  const router = useRouter();

  const [form, setForm] = useState<CreateReportFormData>(initialForm);
  const [errors, setErrors] = useState<CreateReportFormErrors>({});
  const [fileItemErrors, setFileItemErrors] = useState<ReportFileInputErrors[]>(
    [{}],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReport = useCallback(async () => {
    if (!reportId) {
      notify.error('Invalid URL', 'ID Laporan tidak ditemukan.');
      router.push('/dashboard/reports');
      setIsLoading(false);
      return;
    }

    try {
      const data = await getMopReportForEdit(reportId);

      setForm({
        ...data,
        reportFiles: data.reportFiles.length
          ? data.reportFiles
          : [blankReportFile()],
      });
      setFileItemErrors(
        (data.reportFiles.length ? data.reportFiles : [{}]).map(() => ({})),
      );
    } catch (error) {
      notify.error(
        'Gagal Memuat Data MOP',
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      );
      router.push('/dashboard/reports');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, notify, router]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const onFieldChange = (
    field: Exclude<keyof CreateReportFormData, 'reportFiles'>,
    value: string,
  ) => {
    setForm((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, [field]: undefined}));
  };

  const onReportFileChange = (
    index: number,
    field: Exclude<keyof ReportFileInput, 'file'>,
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.reportFiles];
      next[index] = {...next[index], [field]: value};
      return {...prev, reportFiles: next};
    });

    setFileItemErrors((prev) => {
      const next = [...prev];
      next[index] = {...next[index], [field]: undefined};
      return next;
    });
  };

  const onReportFileUpload = (index: number, files: FileList | null) => {
    const file = files?.[0] ?? null;

    setForm((prev) => {
      const next = [...prev.reportFiles];
      next[index] = {...next[index], file};
      return {...prev, reportFiles: next};
    });

    setErrors((prev) => ({...prev, reportFiles: undefined}));
    setFileItemErrors((prev) => {
      const next = [...prev];
      next[index] = {...next[index], file: undefined};
      return next;
    });
  };

  const onAddReportFile = () => {
    setForm((prev) => ({
      ...prev,
      reportFiles: [...prev.reportFiles, blankReportFile()],
    }));
    setFileItemErrors((prev) => [...prev, {}]);
  };

  const onRemoveReportFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      reportFiles: prev.reportFiles.filter((_, i) => i !== index),
    }));

    setFileItemErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const onCancel = () => {
    router.push(`/dashboard/reports/${reportId}`);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {errors: validationErrors, fileItemErrors: fileErrors} =
      validate(form);
    setErrors(validationErrors);
    setFileItemErrors(fileErrors);

    const hasFileItemErrors = fileErrors.some(
      (item) => Object.keys(item).length > 0,
    );

    if (Object.keys(validationErrors).length || hasFileItemErrors) {
      notify.warning('Validasi Form', 'Lengkapi semua input yang wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMopReport(reportId, form);
      notify.success(
        'MOP Berhasil Diajukan Ulang',
        'Perubahan berhasil disimpan dan dikirim ke admin.',
      );

      router.push(`/dashboard/reports/${reportId}`);
    } catch (error) {
      notify.error(
        'Gagal Menyimpan Revisi',
        error instanceof Error ? error.message : 'Terjadi kesalahan.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    fileItemErrors,
    isLoading,
    isSubmitting,
    onFieldChange,
    onReportFileChange,
    onReportFileUpload,
    onAddReportFile,
    onRemoveReportFile,
    onSubmit,
    onCancel,
  };
}
