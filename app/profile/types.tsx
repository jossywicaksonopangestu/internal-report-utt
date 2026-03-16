export interface ProfileData {
  id: string;
  fullname: string;
  email: string;
  role: string;
  division: string | null;
  avatarUrl: string | null;
}

export interface ProfileFormValues {
  fullname: string;
  division: string;
  avatarFileList?: any[];
  password?: string;
  confirmPassword?: string;
}
