export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  status: 'taken' | 'missed' | 'pending';
}

export interface ComplianceReport {
  label: string;
  value: string;
}
