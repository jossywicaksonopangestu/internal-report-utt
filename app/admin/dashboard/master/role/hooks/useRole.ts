import {Form, Modal} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from '../services/roleService';
import {RoleData, RoleFormValues} from '../types';

export function useRoleManagement() {
  const notify = useAppNotification();
  const [data, setData] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [form] = Form.useForm<RoleFormValues>();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadRoles = useCallback(async () => {
    setIsLoading(true);

    try {
      const roles = await getRoles();
      setData(roles);
    } catch (error) {
      notify.error(
        'Role Load Failed',
        error instanceof Error ? error.message : 'Failed to load roles',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const showModal = (role?: RoleData) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue(role);
    } else {
      setEditingRole(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await updateRole(editingRole.id, values);
        notify.success('Role Updated', 'Role has been updated successfully.');
      } else {
        await createRole(values);
        notify.success('Role Created', 'New role has been created.');
      }
      await loadRoles();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Role Save Failed', error.message);
      }
    }
  };

  const handleDelete = (roleId: number) => {
    modal.confirm({
      title: 'Are you sure?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteRole(roleId);
          await loadRoles();
          notify.success('Role Deleted', 'Role has been removed.');
        } catch (error) {
          notify.error(
            'Role Delete Failed',
            error instanceof Error ? error.message : 'Failed to delete role',
          );
        }
      },
    });
  };

  return {
    data,
    isLoading,
    isModalOpen,
    editingRole,
    form,
    modalContextHolder,
    showModal,
    handleOk,
    handleDelete,
    closeModal: () => setIsModalOpen(false),
  };
}
