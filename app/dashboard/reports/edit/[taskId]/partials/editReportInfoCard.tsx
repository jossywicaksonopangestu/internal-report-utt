import {EditReportDetail} from '../types';

interface EditReportInfoCardProps {
  reportDetail: EditReportDetail | null;
}

export function EditReportInfoCard({reportDetail}: EditReportInfoCardProps) {
  return (
    <div className="bg-[#6168FF] rounded-3xl p-6 md:p-8 shadow-xl text-white mb-6">
      <div className="flex flex-wrap justify-between items-start mb-6 border-b border-white/20 pb-4 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Task Information</h2>
        <div className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-bold shadow-sm animate-pulse whitespace-nowrap">
          REVISION REQUIRED
        </div>
      </div>

      {reportDetail?.rejectionNotes && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
          <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-1">
            Admin Revision Notes:
          </p>
          <p className="text-white font-medium text-sm">
            {reportDetail.rejectionNotes}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
        <div>
          <label className="text-white/70 text-xs md:text-sm uppercase tracking-wider font-semibold">
            Document Number
          </label>
          <p className="text-base md:text-lg font-bold mt-1">{reportDetail?.docNumber}</p>
        </div>
        <div className="lg:col-span-2">
          <label className="text-white/70 text-xs md:text-sm uppercase tracking-wider font-semibold">
            Task / MOP Title
          </label>
          <p className="text-base md:text-lg font-bold mt-1 line-clamp-2">
            {reportDetail?.mopTitle}
          </p>
        </div>
        <div>
          <label className="text-white/70 text-xs md:text-sm uppercase tracking-wider font-semibold">
            Scheduled Date
          </label>
          <p className="text-base md:text-lg font-medium mt-1">
            {reportDetail?.scheduledDate}
          </p>
        </div>
      </div>
    </div>
  );
}
