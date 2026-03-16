import {Button, Space, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {Mail, Pencil, ShieldCheck, Trash2, User} from 'lucide-react';
import {UserData} from './types';

export function getUserColumns(
  showModal: (user?: UserData) => void,
  handleDelete: (userId: string) => void,
): ColumnsType<UserData> {
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
      title: 'Name',
      dataIndex: 'name',
      render: (text) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <span className="text-white font-bold text-base">{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => (
        <div className="flex items-center gap-2 text-white/80">
          <Mail size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => (
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={14}
            className="text-[#6168FF] bg-white p-px rounded-full"
          />
          <span className="capitalize text-white font-medium">{role}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag
          className={`border-none px-3 py-1 rounded-md font-bold ${
            status === 'Active'
              ? 'bg-[#389e0d] text-white'
              : 'bg-[#cf1322] text-white'
          }`}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
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
            onClick={() => handleDelete(record.userId)}
            className="border-none shadow-sm bg-white/10"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
}
