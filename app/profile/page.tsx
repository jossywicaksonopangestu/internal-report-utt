'use client';

import {Spin} from 'antd';
import Link from 'next/link';
import {ChevronLeft} from 'lucide-react';
import {useProfile} from './hooks/useProfile';
import {ProfileForm} from './partials/profileForm';

export default function ProfilePage() {
  const {form, profile, isLoading, isSubmitting, onFinish} = useProfile();

  return (
    <div className="mx-auto w-full max-w-210 pb-7 md:pb-10">
      <Link
        href={
          profile && profile.role === 'admin'
            ? '/admin/dashboard'
            : '/dashboard'
        }
        className="mb-3 inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
      >
        <ChevronLeft size={15} />
        Kembali ke Dashboard
      </Link>

      <section className="rounded-[22px] bg-linear-to-r from-[#7075C1] via-[#4958F4] to-[#0B0BEF] p-4 text-white shadow-[0px_16px_35px_-18px_#090D2B] md:p-6">
        <h1 className="font-inter text-4xl leading-tight font-extrabold md:text-5xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-white/75 md:text-base">
          Kelola informasi akun dan keamanan Anda
        </p>
      </section>

      <div className="mt-4 md:mt-5">
        <Spin
          spinning={isLoading}
          size="large"
          description="Loading profile..."
        >
          <ProfileForm
            form={form}
            profile={profile}
            isSubmitting={isSubmitting}
            onSubmit={onFinish}
          />
        </Spin>
      </div>
    </div>
  );
}
