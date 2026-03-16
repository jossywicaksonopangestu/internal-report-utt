import {Form, Modal} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  createUser,
  deleteUser,
  getRoleOptions,
  getUsers,
  RoleOption,
  updateUser,
} from '../services/userService';
import {UserData, UserFormValues} from '../types';

export function useUserManagement() {
  const notify = useAppNotification();
  const [data, setData] = useState<UserData[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [form] = Form.useForm<UserFormValues>();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const [users, roles] = await Promise.all([getUsers(), getRoleOptions()]);
      setData(users);
      setRoleOptions(roles);
    } catch (error) {
      notify.error(
        'User Load Failed',
        error instanceof Error ? error.message : 'Failed to load users',
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      form.resetFields();
      if (roleOptions.length > 0) {
        form.setFieldValue('role', roleOptions[0].value);
      }
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(editingUser.userId, values);
        notify.success('User Updated', 'User has been updated successfully.');
      } else {
        await createUser(values);
        notify.success('User Created', 'New user account has been created.');
      }
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('User Save Failed', error.message);
      }
    }
  };

  const handleDelete = (userId: string) => {
    modal.confirm({
      title: 'Are you sure?',
      content: 'This user will lose access to the system.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUser(userId);
          await loadUsers();
          notify.success('User Deleted', 'User account has been removed.');
        } catch (error) {
          notify.error(
            'User Delete Failed',
            error instanceof Error ? error.message : 'Failed to delete user',
          );
        }
      },
    });
  };

  return {
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
    closeModal: () => setIsModalOpen(false),
  };
}
