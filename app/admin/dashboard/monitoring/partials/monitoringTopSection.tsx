import {Input} from 'antd';
import {Search} from 'lucide-react';

export type StatusFilter =
  | 'all'
  | 'ongoing'
  | 'pending'
  | 'approved'
  | 'rejected';

interface MonitoringTopSectionProps {
  summary: {
    total: number;
    ongoing: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  selectedStatus: StatusFilter;
  onSelectStatus: (status: StatusFilter) => void;
}

function filterButtonClass(isActive: boolean) {
  return `h-9 rounded-xl px-2.5 text-[11px] font-semibold transition-colors ${isActive ? 'bg-[#3B3F6F] text-white' : 'bg-[#FFFFFF40] text-white hover:bg-[#FFFFFF52]'}`;
}

export function MonitoringTopSection({
  summary,
  searchKeyword,
  onSearchKeywordChange,
  selectedStatus,
  onSelectStatus,
}: MonitoringTopSectionProps) {
  return (
    <section className="rounded-[20px] text-white">
      <h1 className="font-inter text-3xl leading-tight font-extrabold md:text-4xl">
        Monitoring MOP
      </h1>
      <p className="mt-1 text-sm text-white/80 md:text-base">
        Monitor semua MOP dari seluruh engineer
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#FFFFFF26] px-3 text-xs font-semibold text-white">
          Total {summary.total}
        </span>
        <span className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#2B7FFF26] px-3 text-xs font-semibold text-white">
          Ongoing {summary.ongoing}
        </span>
        <span className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#FE9A0026] px-3 text-xs font-semibold text-white">
          Perlu Review {summary.pending}
        </span>
        <span className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#00C95026] px-3 text-xs font-semibold text-white">
          Approved {summary.approved}
        </span>
        <span className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#FB2C3626] px-3 text-xs font-semibold text-white">
          Rejected {summary.rejected}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
        <Input
          value={searchKeyword}
          onChange={(event) => onSearchKeywordChange(event.target.value)}
          allowClear
          prefix={<Search size={15} className="text-[#A0A8D2]" />}
          placeholder="Cari nama MOP, engineer, atau file..."
          className="h-10 w-full md:min-w-0 md:flex-1"
        />

        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 md:ml-auto md:flex-none md:gap-1.5 md:overflow-visible md:pb-0">
          <button
            type="button"
            onClick={() => onSelectStatus('all')}
            className={filterButtonClass(selectedStatus === 'all')}
          >
            Semua ({summary.total})
          </button>
          <button
            type="button"
            onClick={() => onSelectStatus('ongoing')}
            className={filterButtonClass(selectedStatus === 'ongoing')}
          >
            Ongoing ({summary.ongoing})
          </button>
          <button
            type="button"
            onClick={() => onSelectStatus('pending')}
            className={filterButtonClass(selectedStatus === 'pending')}
          >
            Perlu Review ({summary.pending})
          </button>
          <button
            type="button"
            onClick={() => onSelectStatus('approved')}
            className={filterButtonClass(selectedStatus === 'approved')}
          >
            Approved ({summary.approved})
          </button>
          <button
            type="button"
            onClick={() => onSelectStatus('rejected')}
            className={filterButtonClass(selectedStatus === 'rejected')}
          >
            Rejected ({summary.rejected})
          </button>
        </div>
      </div>
    </section>
  );
}
