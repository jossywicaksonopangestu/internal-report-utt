'use client';

import {Button, Table} from 'antd';
import {Plus} from 'lucide-react';
import {getRoleColumns} from './columns';
import {useRoleManagement} from './hooks/useRole';
import {RoleFormModal} from './partials/roleFormModal';

export default function RoleManagementPage() {
  const {
    data,
    isLoading,
    isModalOpen,
    editingRole,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal,
  } = useRoleManagement();
  const columns = getRoleColumns(showModal, handleDelete);

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10">
      {modalContextHolder}
      <div className="admin-surface min-h-150">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              Role Management
            </h1>
            <p className="text-white/70 text-lg">
              Define access levels and permissions
            </p>
          </div>

          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => showModal()}
            className="bg-[#293038]! hover:bg-[#1a1f24]! border-none h-10.5 px-6 rounded-xl font-semibold text-base shadow-lg"
          >
            Add New Role
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{
            pageSize: 5,
            placement: ['bottomCenter'],
            className: 'custom-pagination-white !mt-8',
          }}
          className="custom-admin-table"
        />
        <RoleFormModal
          open={isModalOpen}
          editingRole={editingRole}
          form={form}
          onSubmit={handleOk}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}
