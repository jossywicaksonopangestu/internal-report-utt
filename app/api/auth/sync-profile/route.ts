import {NextResponse} from 'next/server';
import {z} from 'zod';
import {createAdminClient} from '@/lib/supabase/admin';
import {createClient as createServerClient} from '@/lib/supabase/server';

const requestSchema = z.object({
  roleIntent: z.enum(['admin', 'user']),
});

function getRoleName(profileRoles: unknown) {
  if (Array.isArray(profileRoles)) {
    return profileRoles[0]?.name?.toLowerCase() ?? null;
  }

  if (
    profileRoles &&
    typeof profileRoles === 'object' &&
    'name' in profileRoles
  ) {
    const roleObject = profileRoles as {name?: string};
    return roleObject.name?.toLowerCase() ?? null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({message: 'Invalid request.'}, {status: 400});
    }

    const adminClient = createAdminClient();
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    let user: {
      id: string;
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
    } | null = null;
    let userError: Error | null = null;

    if (bearerToken) {
      const {data, error} = await adminClient.auth.getUser(bearerToken);
      user = data.user;
      userError = error;
    } else {
      const supabaseServer = await createServerClient();
      const {data, error} = await supabaseServer.auth.getUser();

      user = data.user;
      userError = error;
    }

    if (userError || !user) {
      return NextResponse.json({message: 'Unauthorized.'}, {status: 401});
    }

    const roleIntent = parsed.data.roleIntent;

    const {data: existingProfile, error: profileError} = await adminClient
      .from('profiles')
      .select('id, roles(name)')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        {message: 'Failed to sync profile.'},
        {status: 500},
      );
    }

    let roleName = getRoleName(existingProfile?.roles);

    if (!existingProfile) {
      if (roleIntent === 'admin') {
        return NextResponse.json(
          {message: 'Admin account is not registered.'},
          {status: 403},
        );
      }

      const {data: userRole} = await adminClient
        .from('roles')
        .select('id, name')
        .eq('name', 'user')
        .maybeSingle();

      const metadata = user.user_metadata;
      const fullNameFromMetadata =
        typeof metadata?.full_name === 'string'
          ? metadata.full_name
          : typeof metadata?.name === 'string'
            ? metadata.name
            : null;

      const {error: insertError} = await adminClient.from('profiles').insert({
        id: user.id,
        email: user.email || null,
        fullname: fullNameFromMetadata || user.email || null,
        role_id: userRole?.id ?? null,
      });

      if (insertError) {
        return NextResponse.json(
          {message: 'Failed to create profile.'},
          {status: 500},
        );
      }

      roleName = userRole?.name?.toLowerCase() || 'user';
    }

    const isAdmin = roleName === 'admin';

    if (roleIntent === 'admin' && !isAdmin) {
      return NextResponse.json(
        {message: 'Access denied for non-admin account.'},
        {status: 403},
      );
    }

    if (roleIntent === 'user' && isAdmin) {
      return NextResponse.json(
        {message: 'Admin account cannot login from user portal.'},
        {status: 403},
      );
    }

    return NextResponse.json(
      {
        message: 'Profile synced.',
        roleName,
      },
      {status: 200},
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Auth sync profile error:', message);

    return NextResponse.json(
      {message: 'Failed to sync profile.'},
      {status: 500},
    );
  }
}
