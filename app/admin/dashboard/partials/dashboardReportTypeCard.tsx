import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

interface DashboardReportTypeCardProps {
  chartData: {
    name: string;
    value: number;
  }[];
}

const chartColors = ['#FFFFFF', '#A5A6F6', '#293038'];

export function DashboardReportTypeCard({
  chartData,
}: DashboardReportTypeCardProps) {
  return (
    <div className="lg:col-span-2 bg-[#6168FF] rounded-xl p-6 shadow-lg flex flex-col min-h-80 lg:min-h-0">
      <h2 className="text-white text-lg font-semibold mb-4">
        Total Report Per Type
      </h2>

      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#293038',
                borderRadius: '8px',
                border: 'none',
              }}
              itemStyle={{color: '#fff'}}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-4 pl-4 hidden md:block">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{backgroundColor: chartColors[index]}}
              ></div>
              <span className="text-white font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
