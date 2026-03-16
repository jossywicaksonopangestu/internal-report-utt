import {Form, Input, Button, Upload} from 'antd';
import {FormInstance} from 'antd/es/form';
import {AlertTriangle, Camera, Lock, User} from 'lucide-react';
import {ProfileData, ProfileFormValues} from '../types';
import {useEffect, useMemo, useState} from 'react';

interface ProfileFormProps {
  form: FormInstance<ProfileFormValues>;
  profile: ProfileData | null;
  isSubmitting: boolean;
  onSubmit: (values: ProfileFormValues) => void;
}

export function ProfileForm({
  form,
  profile,
  isSubmitting,
  onSubmit,
}: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const avatarFile = Form.useWatch('avatarFileList', form)?.[0];
  const watchedFullname = Form.useWatch('fullname', form);

  const previewUrl = useMemo(() => {
    if (!avatarFile) return null;
    if (avatarFile.url) return avatarFile.url;
    if (avatarFile.thumbUrl) return avatarFile.thumbUrl;
    if (avatarFile.originFileObj) {
      return URL.createObjectURL(avatarFile.originFileObj);
    }
    return null;
  }, [avatarFile]);

  useEffect(() => {
    if (previewUrl?.startsWith('blob:')) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const initials = useMemo(() => {
    const source = (watchedFullname || profile?.fullname || 'User').trim();
    if (!source) return 'U';
    const parts = source.split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }, [profile?.fullname, watchedFullname]);

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: false,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      className="w-full space-y-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <section className="rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:w-85 md:shrink-0 md:p-5">
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4A4F8A] text-3xl font-bold text-white">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <p className="mt-2 text-sm text-[#9AA0BD]">
              Klik foto untuk mengganti - Maks 2MB
            </p>
            <h2 className="mt-2 font-inter text-3xl font-extrabold text-[#2A2F45]">
              {profile?.fullname || '-'}
            </h2>
            <p className="mt-1 text-base text-[#707891]">
              {profile?.email || '-'}
            </p>
            <span className="mt-3 inline-flex rounded-xl bg-[#E4ECFF] px-3 py-1 text-sm font-semibold text-[#2F6FE5]">
              {profile?.role || '-'}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2.5">
            <div className="rounded-xl bg-white px-3 py-2.5">
              <p className="text-sm text-[#9AA0BD]">Email</p>
              <p className="mt-1 text-base font-semibold text-[#4E567A]">
                {profile?.email || '-'}
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-2.5">
              <p className="text-sm text-[#9AA0BD]">Role</p>
              <p className="mt-1 text-base font-semibold text-[#4E567A]">
                {profile?.role || '-'}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[22px] bg-[#F3F5FF] p-4 text-[#2B315F] shadow-[0px_20px_38px_-24px_#0A0E2A] md:flex-1 md:p-5">
          <div className="-mx-4 -mt-4 mb-4 border-b border-[#D4D9EE] px-4 pt-2 md:-mx-5 md:px-5">
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-base font-semibold transition-colors ${activeTab === 'profile' ? 'border-[#4A4F8A] text-[#3A427A]' : 'border-transparent text-[#8A92AF]'}`}
              >
                <User size={16} />
                Edit Profil
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                className={`inline-flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-base font-semibold transition-colors ${activeTab === 'password' ? 'border-[#4A4F8A] text-[#3A427A]' : 'border-transparent text-[#8A92AF]'}`}
              >
                <Lock size={16} />
                Ubah Password
              </button>
            </div>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-3">
              <Form.Item name="division" hidden>
                <Input />
              </Form.Item>

              <div>
                <p className="mb-2 text-lg font-semibold text-[#4F5678]">
                  Foto Profil
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4A4F8A] text-2xl font-bold text-white">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <Form.Item
                    name="avatarFileList"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList
                    }
                    className="mb-0"
                  >
                    <Upload {...uploadProps}>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#E6E9F8] px-4 text-base font-semibold text-[#4A4F8A]"
                      >
                        <Camera size={15} />
                        Pilih Foto
                      </button>
                    </Upload>
                  </Form.Item>
                </div>
                <p className="mt-1 text-sm text-[#9AA0BD]">
                  JPG, PNG, WebP - Maks 2MB
                </p>
              </div>

              <Form.Item
                name="fullname"
                label={
                  <span className="text-lg font-semibold text-[#4F5678]">
                    Nama Lengkap
                  </span>
                }
                rules={[{required: true, message: 'Nama lengkap wajib diisi.'}]}
                className="mb-0"
              >
                <Input className="h-12 rounded-2xl border-[#D3D8EC] bg-white px-3 text-base text-[#495174]" />
              </Form.Item>

              <div>
                <label className="mb-1 block text-lg font-semibold text-[#4F5678]">
                  Email
                </label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="h-12 rounded-2xl border-[#D3D8EC] bg-[#F7F8FD] px-3 text-base text-[#7A829F]"
                />
                <p className="mt-1 text-sm text-[#9AA0BD]">
                  Email tidak dapat diubah
                </p>
              </div>

              <div>
                <label className="mb-1 block text-lg font-semibold text-[#4F5678]">
                  Role
                </label>
                <Input
                  value={profile?.role || ''}
                  disabled
                  className="h-12 rounded-2xl border-[#D3D8EC] bg-[#F7F8FD] px-3 text-base text-[#7A829F]"
                />
                <p className="mt-1 text-sm text-[#9AA0BD]">
                  Role tidak dapat diubah
                </p>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="mt-1 h-12 w-full rounded-2xl border-none bg-[#40457D] text-lg font-bold shadow-[0px_10px_18px_-12px_#24295A] hover:bg-[#353A70]"
              >
                Simpan Perubahan
              </Button>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-3">
              <Form.Item
                name="password"
                label={
                  <span className="text-lg font-semibold text-[#4F5678]">
                    Password Baru
                  </span>
                }
                rules={[{min: 6, message: 'Password minimal 6 karakter.'}]}
                className="mb-0"
              >
                <Input.Password
                  placeholder="Masukkan password baru"
                  className="h-12 rounded-2xl border-[#D3D8EC] bg-white px-3 text-base text-[#495174]"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={
                  <span className="text-lg font-semibold text-[#4F5678]">
                    Konfirmasi Password
                  </span>
                }
                dependencies={['password']}
                className="mb-0"
                rules={[
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value && !getFieldValue('password')) {
                        return Promise.resolve();
                      }
                      if (value === getFieldValue('password')) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Konfirmasi password belum sesuai.'),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Masukkan ulang password"
                  className="h-12 rounded-2xl border-[#D3D8EC] bg-white px-3 text-base text-[#495174]"
                />
              </Form.Item>

              <div className="rounded-2xl border border-[#F0D599] bg-[#FFF4D9] px-3 py-2.5 text-sm text-[#BE6E00]">
                <p className="inline-flex items-start gap-1.5">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Setelah mengubah password, pastikan Anda mengingat password
                    baru untuk login selanjutnya.
                  </span>
                </p>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="mt-1 h-12 w-full rounded-2xl border-none bg-[#40457D] text-lg font-bold shadow-[0px_10px_18px_-12px_#24295A] hover:bg-[#353A70]"
              >
                Simpan Password
              </Button>
            </div>
          )}
        </section>
      </div>
    </Form>
  );
}
