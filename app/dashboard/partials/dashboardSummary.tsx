import {DashboardData, STATUS_COLORS, STATUS_CONFIG} from '../types';

const donutRadius = 34;
const donutCircumference = 2 * Math.PI * donutRadius;

interface DashboardSummaryProps {
  dashboard: DashboardData;
}

export function DashboardSummary({dashboard}: DashboardSummaryProps) {
  const donutSegments = dashboard.total
    ? ([
        {
          key: 'ongoing',
          value: dashboard.ongoing,
          color: STATUS_COLORS.ongoing,
        },
        {
          key: 'approved',
          value: dashboard.approved,
          color: STATUS_COLORS.approved,
        },
        {
          key: 'pending',
          value: dashboard.pending,
          color: STATUS_COLORS.pending,
        },
        {
          key: 'rejected',
          value: dashboard.rejected,
          color: STATUS_COLORS.rejected,
        },
      ] as const)
    : [];

  let segmentOffset = 0;

  return (
    <section className="rounded-[20px] bg-[#F3F4FF] p-4 shadow-lg md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative flex h-22.5 w-22.5 items-center justify-center">
            <svg
              viewBox="0 0 80 80"
              className="absolute inset-0 h-full w-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="40"
                cy="40"
                r={donutRadius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              {donutSegments.map((segment) => {
                const segmentLength =
                  (segment.value / dashboard.total) * donutCircumference;
                const currentOffset = segmentOffset;
                segmentOffset += segmentLength;

                if (segmentLength <= 0) {
                  return null;
                }

                return (
                  <circle
                    key={segment.key}
                    cx="40"
                    cy="40"
                    r={donutRadius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="12"
                    strokeDasharray={`${segmentLength} ${donutCircumference}`}
                    strokeDashoffset={-currentOffset}
                    strokeLinecap="butt"
                  />
                );
              })}
            </svg>

            <div className="relative z-10 flex h-[calc(100%-16px)] w-[calc(100%-16px)] flex-col items-center justify-center rounded-full bg-[#F3F4FF]">
              <span className="text-4xl leading-none font-bold">
                {dashboard.total}
              </span>
              <span className="text-[10px] text-[#6B7198]">Total MOP</span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 md:min-w-75 md:gap-x-10">
            {STATUS_CONFIG.map((config) => (
              <div key={config.key} className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${config.dotClassName}`}
                />
                <div>
                  <p className="text-xs text-[#8C92B3]">{config.label}</p>
                  <p className="text-3xl leading-none font-bold">
                    {dashboard[config.key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
