import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {resetPasswordWithKey} from '../services/resetPasswordService';
import {ResetPasswordFormValues} from '../types';

export function useResetPassword() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setKey(params.get('key') || '');
  }, []);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!key) {
      setErrorMessage('Reset key tidak ditemukan atau tidak valid.');
      return;
    }

    if (values.password !== values.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await resetPasswordWithKey(key, values.password);
      setIsSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Gagal mereset password. Silakan coba lagi.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return {
    key,
    isLoading,
    isSuccess,
    errorMessage,
    onSubmit,
    goToLogin,
  };
}
