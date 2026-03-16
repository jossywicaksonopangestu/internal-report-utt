import {Form, Input, Button} from 'antd';
import {FormInstance} from 'antd/es/form';
import Link from 'next/link';
import {GoogleAuthButton} from '@/components/googleAuthButton';
import {ForgotPasswordModal} from '@/components/forgotPasswordModal';
import {LoginSchema} from '../types';

interface LoginFormProps {
  form: FormInstance<LoginSchema>;
  isLoading: boolean;
  onSubmit: (values: LoginSchema) => void;
  onGoogleLogin: () => void;
  forgotPasswordModalOpen: boolean;
  forgotPasswordLoading: boolean;
  onForgotPasswordOpen: () => void;
  onForgotPasswordCancel: () => void;
  onForgotPasswordSubmit: (email: string) => Promise<void>;
  isMobile?: boolean;
  formName?: string;
}

export function LoginForm({
  form,
  isLoading,
  onSubmit,
  onGoogleLogin,
  forgotPasswordModalOpen,
  forgotPasswordLoading,
  onForgotPasswordOpen,
  onForgotPasswordCancel,
  onForgotPasswordSubmit,
  isMobile = false,
  formName = 'user_login_form',
}: LoginFormProps) {
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
          Selamat Datang
        </h2>
        <p
          className={`text-[14px] font-normal leading-5.25 tracking-[0] ${
            isMobile ? 'text-white/70' : 'text-[#94A3B8]'
          }`}
        >
          Masuk ke akun Anda untuk melanjutkan
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
        <Form.Item<LoginSchema>
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
          className="mb-5"
        >
          <Input
            placeholder="nama@utt.com"
            disabled={isLoading}
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
          />
        </Form.Item>

        <Form.Item<LoginSchema>
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
          className="mb-2"
        >
          <Input.Password
            placeholder="••••••••"
            disabled={isLoading}
            className={`admin-login-input text-[15px] h-14! rounded-xl! ${
              isMobile
                ? 'border-white/30! bg-white/95! text-[#334155] placeholder:text-[#94A3B8]!'
                : 'text-[#334155] border-[#E2E8F0]! bg-white! placeholder:text-[#94A3B8]!'
            }`}
          />
        </Form.Item>

        <div className="mt-2 mb-8 flex w-full justify-end">
          <button
            type="button"
            onClick={onForgotPasswordOpen}
            className={`text-[15px] font-bold transition-all hover:underline ${
              isMobile
                ? 'text-white/80 hover:text-white'
                : 'text-[#6168FF] hover:text-[#4b51d1]'
            }`}
          >
            Lupa Password?
          </button>
        </div>

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
            Sign In
          </Button>
        </Form.Item>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`h-px flex-1 ${isMobile ? 'bg-white/25' : 'bg-[#E2E8F0]'}`}
          ></div>
          <span
            className={`text-[15px] font-medium ${
              isMobile ? 'text-white/55' : 'text-[#94A3B8]'
            }`}
          >
            atau
          </span>
          <div
            className={`h-px flex-1 ${isMobile ? 'bg-white/25' : 'bg-[#E2E8F0]'}`}
          ></div>
        </div>

        <GoogleAuthButton
          isLoading={isLoading}
          isMobile={isMobile}
          onClick={onGoogleLogin}
        />

        <div
          className={`mt-8 text-center text-[15px] font-normal ${
            isMobile ? 'text-white/65' : 'text-[#94A3B8]'
          }`}
        >
          Belum punya akun?{' '}
          <Link
            href="/register"
            className={`ml-1 font-semibold hover:underline ${
              isMobile ? 'text-white' : 'text-[#3B3F6F]'
            }`}
          >
            Daftar Sekarang
          </Link>
        </div>
      </Form>

      <ForgotPasswordModal
        open={forgotPasswordModalOpen}
        isLoading={forgotPasswordLoading}
        onCancel={onForgotPasswordCancel}
        onSubmit={onForgotPasswordSubmit}
      />
    </div>
  );
}
