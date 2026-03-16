import {createClient} from '@/lib/supabase/client';
import {ProfileData, ProfileFormValues} from '../types';

const supabase = createClient();

export async function getProfile(): Promise<ProfileData> {
  const {data: userData, error: userError} = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('User not authenticated');

  const {data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('id, fullname, email, division, avatar_url, roles(name)')
    .eq('id', userData.user.id)
    .single();

  if (profileError) throw new Error(profileError.message);

  const roleName = Array.isArray(profile.roles)
    ? profile.roles[0]?.name
    : (profile.roles as any)?.name;

  return {
    id: profile.id,
    fullname: profile.fullname ?? '',
    email: profile.email ?? '',
    division: profile.division ?? '',
    avatarUrl: profile.avatar_url ?? null,
    role: roleName ?? 'Unknown Role',
  };
}

async function uploadAvatar(
  fileObj: any,
  userId: string,
): Promise<string | null> {
  if (!fileObj) return null;
  if (fileObj.url) return fileObj.url;
  if (!fileObj.originFileObj) return null;

  const file = fileObj.originFileObj;
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const {error: uploadError} = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {upsert: true});

  if (uploadError)
    throw new Error(`Gagal upload avatar: ${uploadError.message}`);

  const {data} = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function updateProfile(
  values: ProfileFormValues,
  currentAvatarUrl: string | null,
) {
  const {data: userData} = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const userId = userData.user.id;

  let newAvatarUrl = currentAvatarUrl;
  if (values.avatarFileList && values.avatarFileList.length > 0) {
    const uploadedUrl = await uploadAvatar(values.avatarFileList[0], userId);
    if (uploadedUrl) newAvatarUrl = uploadedUrl;
  } else {
    newAvatarUrl = null;
  }

  const {error: profileError} = await supabase
    .from('profiles')
    .update({
      fullname: values.fullname,
      division: values.division,
      avatar_url: newAvatarUrl,
    })
    .eq('id', userId);

  if (profileError) throw new Error(profileError.message);

  if (values.password && values.password.trim() !== '') {
    const {error: authError} = await supabase.auth.updateUser({
      password: values.password,
    });
    if (authError)
      throw new Error(`Update password gagal: ${authError.message}`);
  }
}
