import {createClient} from '@/lib/supabase/client';
import {TablesInsert, TablesUpdate} from '@/lib/types/supabase';
import {RoleData, RoleFormValues} from '../types';

const supabase = createClient();

const toRoleData = (
  row: {id: number; name: string; description: string | null},
  userCount: number,
): RoleData => ({
  key: String(row.id),
  id: row.id,
  name: row.name,
  description: row.description ?? '-',
  userCount,
});

export async function getRoles(): Promise<RoleData[]> {
  const [
    {data: roles, error: roleError},
    {data: profiles, error: profileError},
  ] = await Promise.all([
    supabase
      .from('roles')
      .select('id, name, description')
      .order('id', {ascending: true}),
    supabase.from('profiles').select('role_id'),
  ]);

  if (roleError) {
    throw new Error(roleError.message);
  }

  if (profileError) {
    throw new Error(profileError.message);
  }

  const userCountMap = (profiles ?? []).reduce<Record<number, number>>(
    (acc, profile) => {
      if (!profile.role_id) {
        return acc;
      }

      acc[profile.role_id] = (acc[profile.role_id] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (roles ?? []).map((role) =>
    toRoleData(role, userCountMap[role.id] ?? 0),
  );
}

export async function createRole(values: RoleFormValues) {
  const payload: TablesInsert<'roles'> = {
    name: values.name.trim(),
    description: values.description.trim(),
  };

  const {error} = await supabase.from('roles').insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateRole(roleId: number, values: RoleFormValues) {
  const payload: TablesUpdate<'roles'> = {
    name: values.name.trim(),
    description: values.description.trim(),
  };

  const {error} = await supabase.from('roles').update(payload).eq('id', roleId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteRole(roleId: number) {
  const {error} = await supabase.from('roles').delete().eq('id', roleId);

  if (error) {
    throw new Error(error.message);
  }
}
