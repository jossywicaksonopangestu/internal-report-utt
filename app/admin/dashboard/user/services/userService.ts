import {createClient} from '@/lib/supabase/client';
import {TablesUpdate} from '@/lib/types/supabase';
import {UserData, UserFormValues} from '../types';
import {
  createUserAction,
  deleteUserAction,
  updateUserCredentialsAction,
} from './userAction';

const supabase = createClient();

export interface RoleOption {
  value: string;
  label: string;
  roleId: number;
}

const normalizeRoleName = (roleName: string) => roleName.trim().toLowerCase();

const toUserData = (
  row: {
    id: string;
    fullname: string | null;
    email: string | null;
    role_id: number | null;
    roles: {name: string} | {name: string}[] | null;
  },
  index: number,
): UserData => {
  const roleRelation = Array.isArray(row.roles) ? row.roles[0] : row.roles;

  return {
    key: row.id,
    id: index + 1,
    userId: row.id,
    name: row.fullname ?? '-',
    email: row.email ?? '-',
    role: roleRelation?.name ?? 'unassigned',
    status: row.role_id ? 'Active' : 'Inactive',
  };
};

export async function getRoleOptions(): Promise<RoleOption[]> {
  const {data, error} = await supabase
    .from('roles')
    .select('id, name')
    .order('name', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((role) => ({
    value: role.name,
    label: role.name,
    roleId: role.id,
  }));
}

async function resolveRoleIdByName(roleName: string) {
  const {data, error} = await supabase
    .from('roles')
    .select('id, name')
    .eq('name', roleName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.id) {
    return data.id;
  }

  const {data: allRoles, error: rolesError} = await supabase
    .from('roles')
    .select('id, name');

  if (rolesError) {
    throw new Error(rolesError.message);
  }

  const matchedRole = (allRoles ?? []).find(
    (role) => normalizeRoleName(role.name) === normalizeRoleName(roleName),
  );

  if (!matchedRole) {
    throw new Error(`Role \"${roleName}\" not found`);
  }

  return matchedRole.id;
}

export async function getUsers(): Promise<UserData[]> {
  const {data, error} = await supabase
    .from('profiles')
    .select('id, fullname, email, role_id, roles(name)')
    .order('created_at', {ascending: true});

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((profile, index) => toUserData(profile, index));
}

export async function createUser(values: UserFormValues) {
  if (!values.password?.trim()) {
    throw new Error('Password is required when creating a user');
  }

  const roleId = await resolveRoleIdByName(values.role);

  await createUserAction({
    email: values.email,
    password: values.password,
    name: values.name,
    roleId,
    status: values.status ?? 'Active',
  });
}

export async function updateUser(userId: string, values: UserFormValues) {
  const roleId =
    values.status === 'Inactive'
      ? null
      : await resolveRoleIdByName(values.role);

  const payload: TablesUpdate<'profiles'> = {
    fullname: values.name.trim(),
    email: values.email.trim(),
    role_id: roleId,
  };

  await updateUserCredentialsAction(userId, {
    email: values.email,
    password: values.password?.trim() ? values.password : undefined,
  });

  const {error} = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteUser(userId: string) {
  await deleteUserAction(userId);
}
