'use server';

import {createClient} from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function createUserAction(data: {
  email: string;
  password?: string;
  name: string;
  roleId: number;
  status: string;
}) {
  if (!data.password) throw new Error('Password is required');

  const {data: authData, error: authError} =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {fullname: data.name},
    });

  if (authError) throw new Error(authError.message);

  const newUserId = authData.user.id;

  const {error: profileError} = await supabaseAdmin
    .from('profiles')
    .update({role_id: data.roleId})
    .eq('id', newUserId);

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(newUserId);
    throw new Error(profileError.message);
  }

  return {success: true};
}

export async function updateUserCredentialsAction(
  userId: string,
  data: {email: string; password?: string},
) {
  const updatePayload: any = {email: data.email};
  if (data.password) {
    updatePayload.password = data.password;
  }

  const {error} = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    updatePayload,
  );

  if (error) throw new Error(error.message);

  return {success: true};
}

export async function deleteUserAction(userId: string) {
  const {error} = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) throw new Error(error.message);

  return {success: true};
}
