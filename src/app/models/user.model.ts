export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'technician' | 'viewer';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  department?: string;
}
