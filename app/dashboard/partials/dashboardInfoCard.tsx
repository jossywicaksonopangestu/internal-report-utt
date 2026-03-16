import Image from 'next/image';
import {DashboardData} from '../types';

interface DashboardInfoCardProps {
  dashboard: DashboardData;
  sectionTitleClassName: string;
}

export function DashboardInfoCard({
  dashboard,
  sectionTitleClassName,
}: DashboardInfoCardProps) {
  return (
    <article className="overflow-hidden rounded-[20px] bg-[#F9FAFC] p-4 shadow-lg md:p-5">
      <h3 className={sectionTitleClassName}>Website Internal Report</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#7B81A6] md:text-sm">
        Platform ini dirancang untuk mempermudah Engineer dalam pencatatan dan
        pelaporan preventive maintenance data center secara digital.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#FFF1F0] py-3 text-center">
          <p className="text-4xl leading-none font-extrabold text-[#F5222D]">
            {dashboard.rejected}
          </p>
          <p className="mt-1 text-xs text-[#C07C81]">Rejected</p>
        </div>
        <div className="rounded-xl bg-[#F6FFED] py-3 text-center">
          <p className="text-4xl leading-none font-extrabold text-[#16A34A]">
            {dashboard.approved}
          </p>
          <p className="mt-1 text-xs text-[#6FA57E]">Approved</p>
        </div>
      </div>

      <div className="relative mt-4 hidden h-35 overflow-hidden rounded-xl md:block">
        <Image
          src="/sample-dashboard-image.svg"
          alt="Dashboard Illustration"
          fill
          sizes="40vw"
          className="object-cover"
        />
      </div>
    </article>
  );
}
