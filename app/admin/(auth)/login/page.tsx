'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useEffect, useRef} from 'react';
import {useAppNotification} from '@/lib/use-app-notification';
import {useAdminLogin} from './hooks/useAdminLogin';
import {AdminLoginForm} from './partials/adminLoginForm';

function getAdminLoginErrorMessage(code: string, detail: string | null) {
  if (detail) {
    return detail;
  }

  switch (code) {
    case 'missing_code':
      return 'Google login admin gagal: kode otorisasi tidak ditemukan.';
    case 'exchange_failed':
      return 'Google login admin gagal saat menukar kode sesi.';
    case 'session_not_found':
      return 'Google login admin gagal: sesi tidak terbentuk.';
    case 'sync_failed':
      return 'Google login admin gagal saat sinkronisasi profil.';
    case 'admin_only':
      return 'Akun ini tidak memiliki akses admin.';
    default:
      return 'Google login admin gagal. Silakan coba lagi.';
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const shownRef = useRef(false);
  const notify = useAppNotification();

  const {
    form,
    isLoading,
    onFinish,
    onGoogleLogin,
    isForgotPasswordModalOpen,
    isForgotPasswordLoading,
    openForgotPasswordModal,
    closeForgotPasswordModal,
    onForgotPasswordSubmit,
  } = useAdminLogin();

  useEffect(() => {
    if (shownRef.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const authError = params.get('authError');
    const authMessage = params.get('authMessage');

    if (!authError) {
      return;
    }

    shownRef.current = true;
    notify.error(
      'Google Login Failed',
      getAdminLoginErrorMessage(authError, authMessage),
    );
    router.replace('/admin/login');
  }, [notify, router]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="relative min-h-screen bg-login-left lg:hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute rounded-full bg-white/10"
            style={{
              width: '160px',
              height: '160px',
              top: '-56px',
              right: '-32px',
            }}
          ></div>
          <div
            className="absolute rounded-full bg-white/10"
            style={{
              width: '120px',
              height: '120px',
              bottom: '156px',
              left: '-42px',
            }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-107.5 flex-col items-center px-6 pt-10 pb-8">
          <div className="relative mb-6 h-18 w-31.5">
            <Image
              src="/utt-main-logo.svg"
              alt="UTT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="mb-4 inline-flex items-center rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-white/95 uppercase">
            Admin Portal
          </div>

          <h1
            className="font-micro5 mb-3 text-center text-[16px] leading-[1.1] tracking-[0.12em] text-white"
            style={{fontFamily: 'var(--font-micro-5), sans-serif'}}
          >
            INTERNAL REPORT UNITED TRANSWORLD TRADING
          </h1>

          <p className="mb-8 text-center text-[12px] font-medium tracking-[0.12em] text-white/80 uppercase">
            Area akses khusus administrator
          </p>

          <div className="w-full">
            <AdminLoginForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
              onGoogleLogin={onGoogleLogin}
              forgotPasswordModalOpen={isForgotPasswordModalOpen}
              forgotPasswordLoading={isForgotPasswordLoading}
              onForgotPasswordOpen={openForgotPasswordModal}
              onForgotPasswordCancel={closeForgotPasswordModal}
              onForgotPasswordSubmit={onForgotPasswordSubmit}
              isMobile
              formName="admin_login_form_mobile"
            />
          </div>

          <div className="relative mt-8 h-55 w-55 sm:h-62.5 sm:w-62.5">
            <Image
              src="/crowd-login.svg"
              alt="Workers Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hidden min-h-screen w-full lg:flex">
        <div className="relative flex w-1/2 items-center justify-center overflow-hidden bg-login-left p-12">
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '224px',
              height: '224px',
              top: '-64px',
              left: '708.44px',
              borderRadius: '33554400px',
              background: '#FFFFFF0D',
            }}
          ></div>
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '288px',
              height: '288px',
              top: '670px',
              left: '-96px',
              borderRadius: '33554400px',
              background: '#FFFFFF0D',
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-12 h-18 w-31.5">
              <Image
                src="/utt-main-logo.svg"
                alt="UTT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mb-5 inline-flex items-center rounded-full border border-white/35 bg-white/12 px-5 py-2 text-[12px] font-semibold tracking-[0.22em] text-white/95 uppercase">
              Admin Portal
            </div>

            <h1
              className="font-micro5 mb-3 text-center text-[26px] leading-[1.1] tracking-[0.12em] text-white"
              style={{fontFamily: 'var(--font-micro-5), sans-serif'}}
            >
              INTERNAL REPORT UNITED TRANSWORLD TRADING
            </h1>

            <p className="mb-6 text-center text-[13px] font-medium tracking-[0.15em] text-white/80 uppercase">
              Area akses khusus administrator
            </p>

            <div className="relative h-120 w-120">
              <Image
                src="/crowd-login.svg"
                alt="Workers Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative flex w-1/2 items-center justify-center overflow-hidden bg-login-right p-12">
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '288px',
              height: '288px',
              top: '-96px',
              right: '-96px',
              borderRadius: '33554400px',
              background: '#696CB11A',
            }}
          ></div>
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '256px',
              height: '256px',
              top: '686px',
              left: '-80px',
              borderRadius: '33554400px',
              background: '#2A2EB814',
            }}
          ></div>
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '32px',
              height: '32px',
              top: '64px',
              left: '40px',
              borderRadius: '33554400px',
              background: '#2A2EB81A',
            }}
          ></div>
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '64px',
              height: '64px',
              top: '431px',
              left: '622.56px',
              borderRadius: '33554400px',
              background: '#696CB11A',
            }}
          ></div>

          <div className="relative z-10 w-full max-w-105">
            <AdminLoginForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
              onGoogleLogin={onGoogleLogin}
              forgotPasswordModalOpen={isForgotPasswordModalOpen}
              forgotPasswordLoading={isForgotPasswordLoading}
              onForgotPasswordOpen={openForgotPasswordModal}
              onForgotPasswordCancel={closeForgotPasswordModal}
              onForgotPasswordSubmit={onForgotPasswordSubmit}
              formName="admin_login_form_desktop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
