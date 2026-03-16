'use client';

import Image from 'next/image';
import {useRegister} from './hooks/useRegister';
import {RegisterForm} from './partials/registerForm';

export default function RegisterPage() {
  const {form, isLoading, onFinish} = useRegister();

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

          <h1
            className="font-micro5 mb-8 text-center text-[16px] leading-[1.1] tracking-[0.12em] text-white"
            style={{fontFamily: 'var(--font-micro-5), sans-serif'}}
          >
            INTERNAL REPORT UNITED TRANSWORLD TRADING
          </h1>

          <div className="w-full">
            <RegisterForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
              isMobile
              formName="user_register_form_mobile"
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

            <h1
              className="font-micro5 mb-6 text-center text-[26px] leading-[1.1] tracking-[0.12em] text-white"
              style={{fontFamily: 'var(--font-micro-5), sans-serif'}}
            >
              INTERNAL REPORT UNITED TRANSWORLD TRADING
            </h1>

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
            <RegisterForm
              form={form}
              isLoading={isLoading}
              onSubmit={onFinish}
              formName="user_register_form_desktop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
