export interface UserData {
  key: string;
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: string;
  status?: 'Active' | 'Inactive';
}
