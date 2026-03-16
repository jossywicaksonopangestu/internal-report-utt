import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';

export function CreateReportHeader() {
  return (
    <header className="mb-3 md:mb-5">
      <Link
        href="/dashboard/reports"
        className="inline-flex items-center gap-1 text-xs text-white transition-colors hover:text-white/90 md:text-sm"
      >
        <ChevronLeft size={16} />
        Kembali ke MOP List
      </Link>

      <h1 className="mt-1.5 font-inter text-3xl leading-tight font-extrabold text-white md:text-4xl">
        Tambah Service Report
      </h1>
      <p className="mt-1.5 max-w-95 text-sm text-white/75 md:max-w-120 md:text-base">
        Input file Method of Procedure dan informasi maintenance
      </p>
    </header>
  );
}
