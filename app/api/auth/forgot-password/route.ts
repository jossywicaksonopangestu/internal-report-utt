import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import {createResetPasswordKey} from '@/lib/helpers/resetPasswordToken';
import {createAdminClient} from '@/lib/supabase/admin';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const RESET_EXPIRES_MINUTES = 30;

let cachedTemplate: handlebars.TemplateDelegate<{
  name: string;
  resetUrl: string;
  expiresMinutes: number;
  year: number;
}> | null = null;

async function getTemplate() {
  if (cachedTemplate) {
    return cachedTemplate;
  }

  const templatePath = path.join(
    process.cwd(),
    'lib',
    'templates',
    'forgot-password-email.html',
  );

  const source = await fs.readFile(templatePath, 'utf8');
  cachedTemplate = handlebars.compile(source);

  return cachedTemplate;
}

function getTransporter() {
  const service = process.env.MAILER_SERVICE || 'gmail';
  const user = process.env.MAILER_USER;
  const pass = process.env.MAILER_PASS;

  if (!user || !pass) {
    throw new Error('Missing MAILER_USER or MAILER_PASS');
  }

  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {message: 'Invalid email format.'},
        {status: 400},
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const supabase = createAdminClient();

    const {data: profile, error: profileError} = await supabase
      .from('profiles')
      .select('id, fullname, email')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error(
        'Forgot password profile lookup error:',
        profileError.message,
      );
      return NextResponse.json(
        {message: 'If the email exists, reset instructions have been sent.'},
        {status: 200},
      );
    }

    if (!profile?.id) {
      return NextResponse.json(
        {message: 'If the email exists, reset instructions have been sent.'},
        {status: 200},
      );
    }

    const key = createResetPasswordKey({
      userId: profile.id,
      email,
      expiresInMinutes: RESET_EXPIRES_MINUTES,
    });

    const appUrl =
      process.env.NEXT_PUBLIC_BASE_APP_URL || new URL(request.url).origin;
    const resetUrl = `${appUrl}/auth/reset-password?key=${encodeURIComponent(key)}`;

    const template = await getTemplate();
    const htmlToSend = template({
      name: profile.fullname || 'User',
      resetUrl,
      expiresMinutes: RESET_EXPIRES_MINUTES,
      year: new Date().getFullYear(),
    });

    const from = process.env.MAILER_FROM || process.env.MAILER_USER;

    await getTransporter().sendMail({
      from,
      to: email,
      subject: 'Reset Password - Internal Report UTT',
      html: htmlToSend,
    });

    return NextResponse.json(
      {message: 'If the email exists, reset instructions have been sent.'},
      {status: 200},
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Forgot password error:', message);

    return NextResponse.json(
      {message: 'Failed to send reset instructions. Please try again.'},
      {status: 500},
    );
  }
}
