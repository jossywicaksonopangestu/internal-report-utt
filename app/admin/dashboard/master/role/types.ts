export interface RoleData {
  key: string;
  id: number;
  name: string;
  description: string;
  userCount: number;
}

export interface RoleFormValues {
  name: string;
  description: string;
}
