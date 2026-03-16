'use client';

import {Button, Table} from 'antd';
import {Plus} from 'lucide-react';
import {getUserColumns} from './columns';
import {useUserManagement} from './hooks/useUser';
import {UserFormModal} from './partials/userFormModal';

export default function UserManagementPage() {
  const {
    data,
    roleOptions,
    isLoading,
    isModalOpen,
    editingUser,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal,
  } = useUserManagement();
  const columns = getUserColumns(showModal, handleDelete);

  return (
    <div className="w-full h-fit flex flex-col p-2 pb-10">
      {modalContextHolder}
      <div className="admin-surface min-h-150">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              User Management
            </h1>
            <p className="text-white/70 text-lg">
              Manage access for Engineers, PICs, and Admins
            </p>
          </div>

          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => showModal()}
            className="bg-[#293038]! hover:bg-[#1a1f24]! border-none h-10.5 px-6 rounded-xl font-semibold text-base shadow-lg"
          >
            Add New User
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
        <UserFormModal
          open={isModalOpen}
          editingUser={editingUser}
          form={form}
          roleOptions={roleOptions}
          onSubmit={handleOk}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}
