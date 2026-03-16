import {Loader2, Plus, Upload, X} from 'lucide-react';
import {CreateReportFormHook} from '../types';

interface CreateReportFormProps {
  state: CreateReportFormHook;
}

function FieldError({message}: {message?: string}) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-[#CF1322]">{message}</p>;
}

export function CreateReportForm({state}: CreateReportFormProps) {
  const {
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
  } = state;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-[#ECEEFB] p-4 shadow-2xl md:p-5 lg:p-6"
    >
      <div className="space-y-4 md:space-y-5">
        <div>
          <label
            htmlFor="maintenanceName"
            className="mb-1.5 block text-sm font-semibold text-[#4A5568] md:text-base"
          >
            Nama Maintenance <span className="text-[#F5222D]">*</span>
          </label>
          <input
            id="maintenanceName"
            value={form.maintenanceName}
            onChange={(event) =>
              onFieldChange('maintenanceName', event.target.value)
            }
            placeholder="Contoh: Preventive Maintenance Server Room A"
            className="h-11 w-full rounded-2xl border border-[#E7E8EE] bg-white px-3.5 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000014] outline-none placeholder:text-[#A3AEC2] focus:border-[#4F46E5] md:h-12 md:text-base"
          />
          <FieldError message={errors.maintenanceName} />
        </div>

        <div>
          <label
            htmlFor="maintenanceSpec"
            className="mb-1.5 block text-sm font-semibold text-[#4A5568] md:text-base"
          >
            Nama Spesifikasi Maintenance{' '}
            <span className="text-[#F5222D]">*</span>
          </label>
          <textarea
            id="maintenanceSpec"
            value={form.maintenanceSpec}
            onChange={(event) =>
              onFieldChange('maintenanceSpec', event.target.value)
            }
            placeholder="Contoh: Pembersihan filter debu, pengecekan suhu, kalibrasi sensor..."
            rows={3}
            className="w-full rounded-2xl border border-[#E7E8EE] bg-white px-3.5 py-2.5 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000014] outline-none placeholder:text-[#A3AEC2] focus:border-[#4F46E5] md:text-base"
          />
          <FieldError message={errors.maintenanceSpec} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3">
          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-semibold text-[#4A5568] md:text-base"
            >
              Tanggal Mulai <span className="text-[#F5222D]">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(event) =>
                onFieldChange('startDate', event.target.value)
              }
              className="h-11 w-full rounded-2xl border border-[#E7E8EE] bg-white px-3.5 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000014] outline-none focus:border-[#4F46E5] md:h-12 md:text-base"
            />
            <FieldError message={errors.startDate} />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1.5 block text-sm font-semibold text-[#4A5568] md:text-base"
            >
              Tanggal Selesai <span className="text-[#F5222D]">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(event) => onFieldChange('endDate', event.target.value)}
              className="h-11 w-full rounded-2xl border border-[#E7E8EE] bg-white px-3.5 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000014] outline-none focus:border-[#4F46E5] md:h-12 md:text-base"
            />
            <FieldError message={errors.endDate} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#4A5568] md:text-base">
            Detail File Report <span className="text-[#F5222D]">*</span>
          </label>
          <FieldError message={errors.reportFiles} />

          <div className="mt-2 space-y-3">
            {form.reportFiles.map((item, index) => (
              <div
                key={`report-file-${index}`}
                className="rounded-2xl border border-[#D8DCF1] bg-white/70 p-3 md:p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#404A67] md:text-base">
                    File #{index + 1}
                  </p>

                  {form.reportFiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveReportFile(index)}
                      className="rounded-lg p-1 text-[#8A90B1] hover:bg-[#EEF0FF] hover:text-[#4C57B8]"
                      aria-label={`Hapus file item ${index + 1}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#4A5568] md:text-sm">
                      Judul File <span className="text-[#F5222D]">*</span>
                    </label>
                    <input
                      value={item.title}
                      onChange={(event) =>
                        onReportFileChange(index, 'title', event.target.value)
                      }
                      placeholder="Contoh: Dokumentasi Pembersihan Filter"
                      className="h-10 w-full rounded-xl border border-[#E7E8EE] bg-white px-3 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000012] outline-none focus:border-[#4F46E5]"
                    />
                    <FieldError message={fileItemErrors[index]?.title} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#4A5568] md:text-sm">
                      Deskripsi <span className="text-[#F5222D]">*</span>
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(event) =>
                        onReportFileChange(
                          index,
                          'description',
                          event.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Deskripsi singkat file report"
                      className="w-full rounded-xl border border-[#E7E8EE] bg-white px-3 py-2 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000012] outline-none focus:border-[#4F46E5]"
                    />
                    <FieldError message={fileItemErrors[index]?.description} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#4A5568] md:text-sm">
                      Tanggal File <span className="text-[#F5222D]">*</span>
                    </label>
                    <input
                      type="date"
                      value={item.fileDate}
                      onChange={(event) =>
                        onReportFileChange(
                          index,
                          'fileDate',
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-xl border border-[#E7E8EE] bg-white px-3 text-sm text-[#4A5568] shadow-[0px_2px_6px_#00000012] outline-none focus:border-[#4F46E5]"
                    />
                    <FieldError message={fileItemErrors[index]?.fileDate} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#4A5568] md:text-sm">
                      Upload File <span className="text-[#F5222D]">*</span>
                    </label>
                    <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E7E8EE] bg-white px-3 text-sm text-[#A3AEC2] shadow-[0px_2px_6px_#00000012] transition-colors hover:border-[#4F46E5]">
                      <Upload size={16} className="text-[#A3AEC2]" />
                      <span className="truncate">
                        {item.file
                          ? item.file.name
                          : item.existingFileName ||
                            'Pilih file (PDF, DOC, DOCX)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(event) => {
                          onReportFileUpload(index, event.target.files);
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <FieldError message={fileItemErrors[index]?.file} />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddReportFile}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#8A93C9] px-3 py-2 text-sm font-semibold text-[#4C57B8] hover:bg-[#EEF0FF]"
            >
              <Plus size={14} />
              Tambah File Report
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D3DCFF] bg-[#DFEAFF] px-3.5 py-2.5 text-[#2563EB] md:px-4 md:py-3">
          <p className="text-sm md:text-base">
            Service report merupakan bukti progress pekerjaan. Tambahkan setiap
            kali ada progres maintenance yang telah selesai dikerjakan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1 md:gap-3 md:pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-2xl border border-[#D2D6E6] bg-transparent text-sm font-semibold text-[#4B5563] transition-colors hover:bg-white md:h-11 md:text-base"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#3F437B] text-sm font-semibold text-white shadow-[0px_6px_14px_#1F255940] transition-colors hover:bg-[#333767] disabled:cursor-not-allowed disabled:opacity-70 md:h-11 md:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan MOP'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
