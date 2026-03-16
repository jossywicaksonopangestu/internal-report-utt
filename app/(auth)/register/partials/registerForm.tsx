import {Form, Input, Button} from 'antd';
import {FormInstance} from 'antd/es/form';
import Link from 'next/link';
import {RegisterSchema} from '../types';

interface RegisterFormProps {
  form: FormInstance<RegisterSchema>;
  isLoading: boolean;
  onSubmit: (values: RegisterSchema) => void;
  isMobile?: boolean;
  formName?: string;
}

export function RegisterForm({
  form,
  isLoading,
  onSubmit,
  isMobile = false,
  formName = 'user_register_form',
}: RegisterFormProps) {
  return (
    <div
      className="relative z-10 mx-auto w-full max-w-105"
      style={{fontFamily: 'var(--font-inter), sans-serif'}}
    >
      <div className="mb-8 text-left">
        <h2
          className={`mb-1 text-[26px] font-extrabold leading-9.75 tracking-[0] ${
            isMobile ? 'text-white' : 'text-[#111827]'
          }`}
        >
          Daftar Akun
        </h2>
        <p
          className={`text-[14px] font-normal leading-5.25 tracking-[0] ${
            isMobile ? 'text-white/70' : 'text-[#94A3B8]'
          }`}
        >
          Buat akun baru untuk mulai menggunakan sistem
        </p>
      </div>

      <Form
        form={form}
        name={formName}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        className="w-full"
      >
        <Form.Item<RegisterSchema>
          name="fullname"
          label={
            <span
              className={`text-[13px] font-semibold leading-[19.5px] tracking-[0] ${
                isMobile ? 'text-white/90' : 'text-[#64748B]'
              }`}
            >
              Nama Lengkap
            </span>
          }
          rules={[{required: true, message: 'Please input your name!'}]}
          className="mb-4"
        >
          <Input
            placeholder="Nama lengkap"
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item<RegisterSchema>
          name="email"
          label={
            <span
              className={`text-[13px] font-semibold leading-[19.5px] tracking-[0] ${
                isMobile ? 'text-white/90' : 'text-[#64748B]'
              }`}
            >
              Email
            </span>
          }
          rules={[
            {required: true, message: 'Please input your email!'},
            {type: 'email', message: 'Please enter a valid email!'},
          ]}
          className="mb-4"
        >
          <Input
            placeholder="nama@utt.com"
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item<RegisterSchema>
          name="password"
          label={
            <span
              className={`text-[13px] font-semibold leading-[19.5px] tracking-[0] ${
                isMobile ? 'text-white/90' : 'text-[#64748B]'
              }`}
            >
              Password
            </span>
          }
          rules={[{required: true, message: 'Please input your password!'}]}
          className="mb-4"
        >
          <Input.Password
            placeholder="••••••••"
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item<RegisterSchema>
          name="confirmPassword"
          label={
            <span
              className={`text-[13px] font-semibold leading-[19.5px] tracking-[0] ${
                isMobile ? 'text-white/90' : 'text-[#64748B]'
              }`}
            >
              Konfirmasi Password
            </span>
          }
          dependencies={['password']}
          rules={[
            {required: true, message: 'Please confirm your password!'},
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
          className="mb-8"
        >
          <Input.Password
            placeholder="••••••••"
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item className="mb-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className={`w-full h-14! rounded-xl! border-none! text-[17px] font-bold shadow-md transition-colors ${
              isMobile
                ? 'bg-white! hover:bg-[#EEF1FF]! text-[#2A2EB8]!'
                : 'bg-[#3B3F6F]! hover:bg-[#2A2D54]! text-white!'
            }`}
          >
            Sign Up
          </Button>
        </Form.Item>

        <div
          className={`mt-2 text-center text-[15px] font-normal ${
            isMobile ? 'text-white/65' : 'text-[#94A3B8]'
          }`}
        >
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className={`ml-1 font-semibold hover:underline ${
              isMobile ? 'text-white' : 'text-[#3B3F6F]'
            }`}
          >
            Masuk Sekarang
          </Link>
        </div>
      </Form>
    </div>
  );
}
