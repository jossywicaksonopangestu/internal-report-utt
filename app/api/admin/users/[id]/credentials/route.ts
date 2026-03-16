import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';

interface UpdateCredentialsBody {
  email?: string;
  password?: string;
}

export async function PATCH(
  request: Request,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;
    const body = (await request.json()) as UpdateCredentialsBody;

    if (!id) {
      return NextResponse.json({error: 'User id is required'}, {status: 400});
    }

    const updates: {email?: string; password?: string} = {};

    if (body.email?.trim()) {
      updates.email = body.email.trim();
    }

    if (body.password?.trim()) {
      updates.password = body.password;
    }

    if (!updates.email && !updates.password) {
      return NextResponse.json(
        {error: 'At least one credential field is required'},
        {status: 400},
      );
    }

    const supabase = createAdminClient();

    const {error} = await supabase.auth.admin.updateUserById(id, updates);

    if (error) {
      return NextResponse.json({error: error.message}, {status: 400});
    }

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Internal server error'},
      {status: 500},
    );
  }
}
