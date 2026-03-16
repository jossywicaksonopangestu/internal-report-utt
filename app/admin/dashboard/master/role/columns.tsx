import {Button, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Pencil, Shield, Trash2} from 'lucide-react';
import {RoleData} from './types';

export function getRoleColumns(
  showModal: (role?: RoleData) => void,
  handleDelete: (roleId: number) => void,
): ColumnsType<RoleData> {
  return [
    {
      title: 'No',
      dataIndex: 'id',
      width: 80,
      render: (_text, _record, index) => (
        <span className="text-white font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      render: (text) => (
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-white/70" />
          <span className="text-white font-bold text-base capitalize">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => <span className="text-white/80">{text}</span>,
    },
    {
      title: 'Users Assigned',
      dataIndex: 'userCount',
      render: (count) => (
        <span className="bg-white/10 px-3 py-1 rounded-full text-white text-xs font-medium">
          {count} Users
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<Pencil size={14} />}
            onClick={() => showModal(record)}
            className="bg-[#293038]! border-none hover:bg-[#1a1f24]! shadow-sm"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.id)}
            className="border-none shadow-sm bg-white/10"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
}
