import {Form} from 'antd';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppNotification} from '@/lib/use-app-notification';
import {registerUser} from '../services/registerService';
import {RegisterSchema} from '../types';

export function useRegister() {
  const notify = useAppNotification();
  const router = useRouter();
  const [form] = Form.useForm<RegisterSchema>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: RegisterSchema) => {
    setIsLoading(true);
    try {
      await registerUser(values);
      notify.success(
        'Registration Success!',
        'Your account has been created successfully. You can now sign in.',
      );
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        notify.error('Registration Failed', error.message);
      } else {
        notify.error(
          'Registration Failed',
          'Something went wrong during sign up.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onFinish,
  };
}
