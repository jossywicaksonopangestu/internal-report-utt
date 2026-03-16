import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {CheckSquare, XSquare, Eye, Printer} from 'lucide-react';
import {ReportData} from './types';

export function getMonitoringColumns(
  handleApprove: (reportId: string) => void,
  openRevisiModal: (reportId: string) => void,
  showDetail: (report: ReportData) => void,
  handlePrint: (report: ReportData) => void,
): ColumnsType<ReportData> {
  return [
    {
      title: 'No',
      dataIndex: 'id',
      width: 60,
      render: (_text, _record, index) => (
        <span className="text-white font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'Task Name',
      dataIndex: 'maintenanceName',
      render: (text) => (
        <span className="text-white font-medium text-base line-clamp-1 max-w-50">
          {text}
        </span>
      ),
    },
    {
      title: 'PIC',
      dataIndex: 'picName',
      render: (text) => <span className="text-white/90">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let colorClass = 'bg-white/20 text-white';
        if (status === 'approved') colorClass = '!bg-[#FFE58F] !text-[#876800]';
        if (status === 'rejected') colorClass = '!bg-[#FFBB96] !text-[#871400]';

        return (
          <div
            className={`px-3 py-1 rounded-lg font-bold min-w-22.5 text-center inline-block text-xs ${colorClass}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: 'Print',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            onClick={() => handlePrint(record)}
            icon={<Printer size={16} className="text-[#6168FF]" />}
            className="bg-white border-none flex items-center justify-center shadow-sm hover:scale-110 transition-transform w-8 h-8 rounded-lg!"
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 320,
      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => handleApprove(record.id)}
            className="bg-white/20! border-none text-white! hover:bg-white/30! shadow-sm"
          >
            <CheckSquare size={14} />
            Approve
          </Button>
          <Button
            danger
            onClick={() => openRevisiModal(record.id)}
            className="border-none shadow-sm bg-white/10"
          >
            <XSquare size={14} />
            Revisi
          </Button>
          <Button
            onClick={() => showDetail(record)}
            className="bg-white/20! border-none text-white! hover:bg-white/30! shadow-sm"
          >
            <Eye size={14} />
            Detail
          </Button>
        </Space>
      ),
    },
  ];
}
