'use client';

import {use} from 'react';
import {Spin} from 'antd';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';
import {useEditReport} from './hooks/useEditReport';
import {CreateReportForm} from '../../create/partials/createReportForm';

export default function EditReportPage({
  params,
}: {
  params: Promise<{taskId: string}>;
}) {
  const unwrappedParams = use(params);
  const reportId = unwrappedParams.taskId;
  const editReportState = useEditReport(reportId);

  if (editReportState.isLoading) {
    return (
      <div className="flex h-150 w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-3 pt-2 pb-8 md:px-6 md:pt-3 md:pb-10">
      <div className="mx-auto w-full max-w-180">
        <header className="mb-3 md:mb-5">
          <Link
            href={`/dashboard/reports/${reportId}`}
            className="inline-flex items-center gap-1 text-xs text-white! visited:text-white! transition-colors hover:text-white/90! md:text-sm"
          >
            <ChevronLeft size={16} />
            Kembali ke Detail MOP
          </Link>

          <h1 className="mt-1.5 font-inter text-3xl leading-tight font-extrabold text-white md:text-4xl">
            Revisi Service Report
          </h1>
          <p className="mt-1.5 max-w-95 text-sm text-white/75 md:max-w-120 md:text-base">
            Perbarui data MOP lalu ajukan ulang ke admin
          </p>
        </header>

        <CreateReportForm
          state={{
            form: editReportState.form,
            errors: editReportState.errors,
            fileItemErrors: editReportState.fileItemErrors,
            isSubmitting: editReportState.isSubmitting,
            onFieldChange: editReportState.onFieldChange,
            onReportFileChange: editReportState.onReportFileChange,
            onReportFileUpload: editReportState.onReportFileUpload,
            onAddReportFile: editReportState.onAddReportFile,
            onRemoveReportFile: editReportState.onRemoveReportFile,
            onSubmit: editReportState.onSubmit,
            onCancel: editReportState.onCancel,
          }}
        />
      </div>
    </div>
  );
}
