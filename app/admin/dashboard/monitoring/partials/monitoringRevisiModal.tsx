import {Form, Input, Modal} from 'antd';
import {FormInstance} from 'antd/es/form';

interface MonitoringRevisiModalProps {
  open: boolean;
  form: FormInstance;
  onSubmit: () => void;
  onClose: () => void;
}

export function MonitoringRevisiModal({
  open,
  form,
  onSubmit,
  onClose,
}: MonitoringRevisiModalProps) {
  return (
    <Modal
      title="Request Revision"
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      okText="Send to PIC"
      okButtonProps={{
        className: 'bg-red-500! hover:bg-red-600! border-none',
      }}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="notes"
          label="Revision Notes"
          rules={[
            {
              required: true,
              message: 'Please provide reason for revision!',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Explain what needs to be fixed..."
            className="rounded-lg!"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
