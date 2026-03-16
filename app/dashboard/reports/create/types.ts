export interface ReportFileInput {
  title: string;
  description: string;
  fileDate: string;
  file: File | null;
  existingFileName?: string;
  existingFileUrl?: string;
}

export interface ReportFileInputErrors {
  title?: string;
  description?: string;
  fileDate?: string;
  file?: string;
}

export interface CreateReportFormData {
  maintenanceName: string;
  maintenanceSpec: string;
  startDate: string;
  endDate: string;
  reportFiles: ReportFileInput[];
}

export interface CreateReportFormErrors {
  maintenanceName?: string;
  maintenanceSpec?: string;
  startDate?: string;
  endDate?: string;
  reportFiles?: string;
}

export interface CreateReportFormHook {
  form: CreateReportFormData;
  errors: CreateReportFormErrors;
  fileItemErrors: ReportFileInputErrors[];
  isSubmitting: boolean;
  onFieldChange: (
    field: Exclude<keyof CreateReportFormData, 'reportFiles'>,
    value: string,
  ) => void;
  onReportFileChange: (
    index: number,
    field: Exclude<keyof ReportFileInput, 'file'>,
    value: string,
  ) => void;
  onReportFileUpload: (index: number, files: FileList | null) => void;
  onAddReportFile: () => void;
  onRemoveReportFile: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}
