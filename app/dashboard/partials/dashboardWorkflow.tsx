import {ClipboardList, Clock3, Send, Upload} from 'lucide-react';

const workflowSteps = [
  {
    number: 1,
    title: 'Upload MOP',
    description: 'Input file MOP dan data maintenance',
    icon: Upload,
    gradientClass: 'bg-linear-to-b from-[#1E2158] to-[#3B3F6F]',
  },
  {
    number: 2,
    title: 'Tambah Service Report',
    description: 'Catat setiap progress pekerjaan',
    icon: ClipboardList,
    gradientClass: 'bg-linear-to-b from-[#1D4ED8] to-[#3B82F6]',
  },
  {
    number: 3,
    title: 'Ajukan ke Admin',
    description: 'Submit MOP untuk approval',
    icon: Send,
    gradientClass: 'bg-linear-to-b from-[#C2410C] to-[#F59E0B]',
  },
  {
    number: 4,
    title: 'Tunggu Approval',
    description: 'Admin review dan approve/reject',
    icon: Clock3,
    gradientClass: 'bg-linear-to-b from-[#15803D] to-[#22C55E]',
  },
] as const;

interface DashboardWorkflowProps {
  sectionTitleClassName: string;
}

export function DashboardWorkflow({
  sectionTitleClassName,
}: DashboardWorkflowProps) {
  return (
    <section className="rounded-[20px] bg-[#F9FAFC] px-4 py-5 shadow-lg md:px-6 md:py-6">
      <h2 className={`mb-5 ${sectionTitleClassName}`}>Alur Kerja</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {workflowSteps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex flex-col items-center text-center"
          >
            {index < workflowSteps.length - 1 && (
              <div className="absolute top-5 left-1/2 hidden h-0.5 w-full bg-[#C9CEF0] md:block" />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0px_2px_4px_-2px_#0000001A,0px_4px_6px_-1px_#0000001A] ${step.gradientClass}`}
            >
              {step.number}
            </div>

            <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#F0F1FF]">
              <step.icon size={16} className="text-[#5861AB]" />
            </div>
            <p className="mt-2 text-sm font-bold text-[#262D66]">
              {step.title}
            </p>
            <p className="mt-1 text-xs text-[#8A90B1]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
