import {Form} from 'antd';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {
  loginUser,
  loginWithGoogleAsUser,
  requestForgotPassword,
} from '../services/loginService';
import {LoginSchema} from '../types';

export function useLogin() {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<LoginSchema>();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const onFinish = async (values: LoginSchema) => {
    setIsLoading(true);
    try {
      await loginUser(values);

      notify.success('Login Success', 'Welcome to User Dashboard!');

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Login Failed', error.message);
      } else {
        notify.error('Login Failed', 'Invalid credentials or network error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setIsLoading(true);

    try {
      await loginWithGoogleAsUser();
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Google Sign-In Failed', error.message);
      } else {
        notify.error('Google Sign-In Failed', 'Failed to redirect to Google.');
      }
      setIsLoading(false);
    }
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    if (isForgotPasswordLoading) {
      return;
    }

    setIsForgotPasswordModalOpen(false);
  };

  const onForgotPasswordSubmit = async (email: string) => {
    setIsForgotPasswordLoading(true);

    try {
      await requestForgotPassword(email);
      notify.success(
        'Instruksi Dikirim',
        'Jika email terdaftar, tautan reset password akan segera dikirim.',
      );
      setIsForgotPasswordModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Gagal Mengirim', error.message);
      } else {
        notify.error('Gagal Mengirim', 'Terjadi kesalahan. Coba lagi nanti.');
      }
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onFinish,
    onGoogleLogin,
    isForgotPasswordModalOpen,
    isForgotPasswordLoading,
    openForgotPasswordModal,
    closeForgotPasswordModal,
    onForgotPasswordSubmit,
  };
}
