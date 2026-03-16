import {Form, Input, Modal} from 'antd';
import {FormInstance} from 'antd/es/form';
import {RoleData} from '../types';

interface RoleFormModalProps {
  open: boolean;
  editingRole: RoleData | null;
  form: FormInstance;
  onSubmit: () => void;
  onClose: () => void;
}

export function RoleFormModal({
  open,
  editingRole,
  form,
  onSubmit,
  onClose,
}: RoleFormModalProps) {
  return (
    <Modal
      title={editingRole ? 'Edit Role' : 'Add New Role'}
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText={editingRole ? 'Save Changes' : 'Create Role'}
      okButtonProps={{className: '!bg-[#6168FF] hover:!bg-[#4b51d1]'}}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            {required: true, message: 'Please input role name!'},
            {min: 3, message: 'Role name must be at least 3 characters'},
          ]}
        >
          <Input placeholder="e.g., supervisor" className="h-10! rounded-lg!" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{required: true, message: 'Please input description!'}]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe what this role can do..."
            className="rounded-lg!"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
