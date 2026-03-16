import {NextResponse} from 'next/server';
import {z} from 'zod';
import {verifyResetPasswordKey} from '@/lib/helpers/resetPasswordToken';
import {createAdminClient} from '@/lib/supabase/admin';

const resetPasswordSchema = z.object({
  key: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {message: 'Invalid reset request.'},
        {status: 400},
      );
    }

    const tokenPayload = verifyResetPasswordKey(parsed.data.key);

    if (!tokenPayload) {
      return NextResponse.json(
        {message: 'Reset link is invalid or expired.'},
        {status: 400},
      );
    }

    const supabase = createAdminClient();
    const {error} = await supabase.auth.admin.updateUserById(tokenPayload.uid, {
      password: parsed.data.password,
    });

    if (error) {
      return NextResponse.json(
        {message: error.message || 'Failed to reset password.'},
        {status: 400},
      );
    }

    return NextResponse.json(
      {message: 'Password has been reset successfully.'},
      {status: 200},
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Reset password error:', message);

    return NextResponse.json(
      {message: 'Failed to reset password. Please try again.'},
      {status: 500},
    );
  }
}
