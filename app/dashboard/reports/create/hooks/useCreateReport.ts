import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {createMopReport} from '../services/createReportService';
import {
  CreateReportFormData,
  CreateReportFormErrors,
  ReportFileInput,
  ReportFileInputErrors,
} from '../types';

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

export function useCreateReport() {
  const router = useRouter();
  const notify = useAppNotification();

  const [form, setForm] = useState<CreateReportFormData>(initialForm);
  const [errors, setErrors] = useState<CreateReportFormErrors>({});
  const [fileItemErrors, setFileItemErrors] = useState<ReportFileInputErrors[]>(
    [{}],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const nextReportFiles = [...prev.reportFiles];
      nextReportFiles[index] = {
        ...nextReportFiles[index],
        [field]: value,
      };

      return {...prev, reportFiles: nextReportFiles};
    });

    setFileItemErrors((prev) => {
      const next = [...prev];
      next[index] = {...next[index], [field]: undefined};
      return next;
    });
  };

  const onReportFileUpload = (index: number, fileList: FileList | null) => {
    const file = fileList?.[0] ?? null;

    setForm((prev) => {
      const nextReportFiles = [...prev.reportFiles];
      nextReportFiles[index] = {
        ...nextReportFiles[index],
        file,
      };

      return {...prev, reportFiles: nextReportFiles};
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
      reportFiles: prev.reportFiles.filter(
        (_, fileIndex) => fileIndex !== index,
      ),
    }));

    setFileItemErrors((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const onCancel = () => {
    router.push('/dashboard/reports');
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
      const reportId = await createMopReport(form);
      notify.success('MOP Berhasil Dibuat', 'Data MOP berhasil disimpan.');
      router.push(`/dashboard/reports/${reportId}`);
    } catch (error) {
      notify.error(
        'Gagal Menyimpan MOP',
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
