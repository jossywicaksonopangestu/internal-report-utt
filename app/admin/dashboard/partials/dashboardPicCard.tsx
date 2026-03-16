import {Avatar} from 'antd';

interface DashboardPicCardProps {
  picList: {
    id: string;
    name: string;
    role: string;
  }[];
}

export function DashboardPicCard({picList}: DashboardPicCardProps) {
  return (
    <div className="lg:col-span-1 bg-[#6168FF] rounded-xl p-0 shadow-lg flex flex-col overflow-hidden min-h-60 lg:min-h-0">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-white text-lg font-semibold text-center">PIC</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {picList.map((pic) => (
          <div
            key={pic.id}
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Avatar size="large" className="bg-white text-[#6168FF] font-bold">
              {pic.name.charAt(0)}
            </Avatar>
            <div>
              <p className="text-white font-bold">{pic.name}</p>
              <p className="text-white/70 text-sm">{pic.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
