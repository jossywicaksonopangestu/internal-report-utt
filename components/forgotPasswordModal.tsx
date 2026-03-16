'use client';

import {CloseOutlined, MailOutlined} from '@ant-design/icons';
import {Button, Form, Input, Modal} from 'antd';

interface ForgotPasswordModalProps {
  open: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (email: string) => Promise<void>;
}

interface ForgotPasswordValues {
  email: string;
}

export function ForgotPasswordModal({
  open,
  isLoading,
  onCancel,
  onSubmit,
}: ForgotPasswordModalProps) {
  const [form] = Form.useForm<ForgotPasswordValues>();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: ForgotPasswordValues) => {
    await onSubmit(values.email);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={430}
      destroyOnHidden
      rootClassName="forgot-password-modal"
      closeIcon={<CloseOutlined className="text-[#94A3B8]" />}
    >
      <div className="mb-5 h-12 w-12 rounded-full bg-[#EEF2FF] text-[#4A55B8] flex items-center justify-center">
        <MailOutlined className="text-[20px]" />
      </div>

      <h2 className="text-[34px] leading-[1.1] text-[#1f275f] font-micro5 tracking-[0.06em]">
        Lupa Password?
      </h2>

      <p className="mt-3 text-[15px] leading-6 text-[#94A3B8]">
        Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset
        password.
      </p>

      <Form<ForgotPasswordValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
        className="mt-5"
      >
        <Form.Item<ForgotPasswordValues>
          name="email"
          className="mb-4"
          rules={[
            {required: true, message: 'Email wajib diisi.'},
            {type: 'email', message: 'Masukkan email yang valid.'},
          ]}
        >
          <Input
            placeholder="nama@utt.com"
            disabled={isLoading}
            className="admin-login-input h-12! rounded-xl!"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            htmlType="submit"
            type="primary"
            loading={isLoading}
            className="h-12 w-full rounded-xl border-none bg-[#3B3F6F]! text-[16px] font-bold"
          >
            Kirim Instruksi
          </Button>
        </Form.Item>
      </Form>

      <p className="mt-5 text-center text-[14px] text-[#94A3B8]">
        Ingat password?{' '}
        <button
          type="button"
          onClick={handleCancel}
          className="font-semibold text-[#3B3F6F] hover:underline"
        >
          Kembali Login
        </button>
      </p>
    </Modal>
  );
}
