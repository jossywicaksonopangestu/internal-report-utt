'use client';

import {Spin} from 'antd';
import {useDashboardOverview} from './hooks/useDashboardOverview';
import {DashboardBanner} from './partials/dashboardBanner';
import {DashboardInfoCard} from './partials/dashboardInfoCard';
import {DashboardLatestMopSection} from './partials/dashboardLatestMopSection';
import {DashboardSummary} from './partials/dashboardSummary';
import {DashboardWorkflow} from './partials/dashboardWorkflow';
import {SECTION_TITLE_CLASS_NAME} from './types';

export default function UserDashboardPage() {
  const {dashboard, isLoading} = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center rounded-3xl bg-white/60">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-370 flex-col gap-5 pb-6 text-[#1F2559] md:gap-6 md:pb-10">
      <DashboardBanner userName={dashboard.userName} />
      <DashboardSummary dashboard={dashboard} />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashboardLatestMopSection
          dashboard={dashboard}
          sectionTitleClassName={SECTION_TITLE_CLASS_NAME}
        />
        <DashboardInfoCard
          dashboard={dashboard}
          sectionTitleClassName={SECTION_TITLE_CLASS_NAME}
        />
      </section>

      <DashboardWorkflow sectionTitleClassName={SECTION_TITLE_CLASS_NAME} />
    </div>
  );
}
