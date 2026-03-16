import {Form, Input, Modal, Select} from 'antd';
import {FormInstance} from 'antd/es/form';
import {RoleOption} from '../services/userService';
import {UserData} from '../types';

interface UserFormModalProps {
  open: boolean;
  editingUser: UserData | null;
  form: FormInstance;
  roleOptions: RoleOption[];
  onSubmit: () => void;
  onClose: () => void;
}

export function UserFormModal({
  open,
  editingUser,
  form,
  roleOptions,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Add New User'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editingUser ? 'Save Changes' : 'Create User'}
      okButtonProps={{className: '!bg-[#6168FF] hover:!bg-[#4b51d1]'}}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{required: true, message: 'Please input full name!'}]}
        >
          <Input placeholder="e.g. Zefanya" className="h-10! rounded-lg!" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            {required: true, message: 'Please input email!'},
            {type: 'email', message: 'Please enter a valid email!'},
          ]}
        >
          <Input
            placeholder="e.g. user@utt.com"
            className="h-10! rounded-lg!"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {required: !editingUser, message: 'Please input password!'},
            {
              validator: (_, value: string | undefined) => {
                if (!value || value.length === 0) {
                  return Promise.resolve();
                }

                if (value.length < 6) {
                  return Promise.reject(
                    new Error('Password must be at least 6 characters'),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            placeholder={
              editingUser ? 'Leave empty to keep current' : 'Min. 6 characters'
            }
            className="h-10! rounded-lg!"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{required: true, message: 'Please select a role!'}]}
        >
          <Select
            placeholder="Select Role"
            className="h-10!"
            options={roleOptions}
          />
        </Form.Item>

        {editingUser && (
          <Form.Item name="status" label="Status" rules={[{required: true}]}>
            <Select
              className="h-10!"
              options={[
                {value: 'Active', label: 'Active'},
                {value: 'Inactive', label: 'Inactive'},
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
