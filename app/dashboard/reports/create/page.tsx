'use client';

import {CreateReportHeader} from './partials/createReportHeader';
import {CreateReportForm} from './partials/createReportForm';
import {useCreateReport} from './hooks/useCreateReport';

export default function CreateReportPage() {
  const createReportState = useCreateReport();

  return (
    <div className="min-h-full w-full px-3 pt-2 pb-8 md:px-6 md:pt-3 md:pb-10">
      <div className="mx-auto w-full max-w-180">
        <CreateReportHeader />
        <CreateReportForm state={createReportState} />
      </div>
    </div>
  );
}
