import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';

interface CreateAdminUserBody {
  email?: string;
  password?: string;
  name?: string;
  roleId?: number;
  status?: 'Active' | 'Inactive';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateAdminUserBody;

    if (!body.email || !body.password || !body.name || !body.roleId) {
      return NextResponse.json(
        {error: 'Email, password, name, and roleId are required'},
        {status: 400},
      );
    }

    const supabase = createAdminClient();

    const {data: created, error: createError} =
      await supabase.auth.admin.createUser({
        email: body.email.trim(),
        password: body.password,
        email_confirm: true,
        user_metadata: {
          fullname: body.name.trim(),
        },
      });

    if (createError || !created.user) {
      return NextResponse.json(
        {error: createError?.message ?? 'Failed to create auth user'},
        {status: 400},
      );
    }

    const {error: profileError} = await supabase.from('profiles').insert({
      id: created.user.id,
      fullname: body.name.trim(),
      email: body.email.trim(),
      role_id: body.status === 'Inactive' ? null : body.roleId,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(created.user.id);

      return NextResponse.json({error: profileError.message}, {status: 400});
    }

    return NextResponse.json({success: true, userId: created.user.id});
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Internal server error'},
      {status: 500},
    );
  }
}
