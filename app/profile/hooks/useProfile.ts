import {Form} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {getProfile, updateProfile} from '../services/profileService';
import {ProfileData, ProfileFormValues} from '../types';

export function useProfile() {
  const notify = useAppNotification();
  const [form] = Form.useForm<ProfileFormValues>();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);

      form.setFieldsValue({
        fullname: data.fullname,
        division: data.division || '',
        avatarFileList: data.avatarUrl
          ? [
              {
                uid: '-1',
                name: 'avatar.png',
                status: 'done',
                url: data.avatarUrl,
              },
            ]
          : [],
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      notify.error('Failed to load profile', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [notify, form]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onFinish = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile(values, profile?.avatarUrl ?? null);
      notify.success(
        'Profile Updated',
        'Your profile information has been successfully updated.',
      );

      await loadProfile();

      form.setFieldsValue({password: '', confirmPassword: ''});
    } catch (error: any) {
      notify.error('Update Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    profile,
    isLoading,
    isSubmitting,
    onFinish,
  };
}
