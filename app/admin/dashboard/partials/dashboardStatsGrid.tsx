import {Briefcase, FileText, Home, Users} from 'lucide-react';

interface DashboardStatsGridProps {
  stats: {
    taskList: number;
    mopCount: number;
    totalReport: number;
    totalPic: number;
  };
}

const statsConfig = [
  {title: 'Task List', key: 'taskList', icon: Briefcase},
  {title: 'MOP', key: 'mopCount', icon: Home},
  {title: 'Total Report', key: 'totalReport', icon: FileText},
  {title: 'Total PIC', key: 'totalPic', icon: Users},
] as const;

export function DashboardStatsGrid({stats}: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, idx) => (
        <div
          key={idx}
          className="bg-[#6168FF] rounded-xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
            <stat.icon size={24} />
          </div>
          <div>
            <h3 className="text-white/80 text-sm font-medium">{stat.title}</h3>
            <p className="text-white text-2xl font-bold">{stats[stat.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
