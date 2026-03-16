'use client';

import {Alert, Button, Form, Input} from 'antd';
import Link from 'next/link';
import {useResetPassword} from './hooks/useResetPassword';
import {ResetPasswordFormValues} from './types';

export default function ResetPasswordPage() {
  const {key, isLoading, isSuccess, errorMessage, onSubmit, goToLogin} =
    useResetPassword();
  const [form] = Form.useForm<ResetPasswordFormValues>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-login-right px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl md:p-8">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#1f275f]">
          Reset Password
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-[#64748B]">
          Masukkan password baru untuk akun Anda.
        </p>

        {!key && (
          <Alert
            type="error"
            showIcon
            className="mt-5"
            message="Reset key tidak ditemukan. Silakan request ulang lewat Lupa Password."
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            showIcon
            className="mt-5"
            message={errorMessage}
          />
        )}

        {isSuccess ? (
          <div className="mt-6 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <p className="text-[15px] text-[#334155]">
              Password berhasil diubah. Silakan login dengan password baru.
            </p>
            <Button
              type="primary"
              className="mt-4 h-11 w-full rounded-xl border-none bg-[#3B3F6F]! text-[15px] font-semibold"
              onClick={goToLogin}
            >
              Kembali ke Login
            </Button>
          </div>
        ) : (
          <Form<ResetPasswordFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onSubmit}
            className="mt-6"
          >
            <Form.Item<ResetPasswordFormValues>
              name="password"
              label={
                <span className="text-[13px] font-semibold text-[#64748B]">
                  Password Baru
                </span>
              }
              rules={[
                {required: true, message: 'Password wajib diisi.'},
                {min: 6, message: 'Password minimal 6 karakter.'},
              ]}
            >
              <Input.Password
                placeholder="Masukkan password baru"
                disabled={isLoading}
                className="admin-login-input h-12! rounded-xl!"
              />
            </Form.Item>

            <Form.Item<ResetPasswordFormValues>
              name="confirmPassword"
              label={
                <span className="text-[13px] font-semibold text-[#64748B]">
                  Konfirmasi Password
                </span>
              }
              dependencies={['password']}
              rules={[
                {required: true, message: 'Konfirmasi password wajib diisi.'},
                ({getFieldValue}) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error('Konfirmasi password tidak cocok.'),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Ulangi password baru"
                disabled={isLoading}
                className="admin-login-input h-12! rounded-xl!"
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-1">
              <Button
                htmlType="submit"
                type="primary"
                loading={isLoading}
                disabled={!key}
                className="h-12 w-full rounded-xl border-none bg-[#3B3F6F]! text-[16px] font-bold"
              >
                Simpan Password Baru
              </Button>
            </Form.Item>
          </Form>
        )}

        <p className="mt-6 text-center text-[14px] text-[#94A3B8]">
          Ingat password?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#3B3F6F] hover:underline"
          >
            Kembali Login
          </Link>
        </p>
      </div>
    </div>
  );
}
