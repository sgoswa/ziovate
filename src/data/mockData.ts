import { ComplianceReport, Medicine } from '../types';

export const todayMedicines: Medicine[] = [
  { id: 'm1', name: 'Metformin', dosage: '500 mg', schedule: '8:00 AM', status: 'pending' },
  { id: 'm2', name: 'Atorvastatin', dosage: '10 mg', schedule: '10:00 PM', status: 'pending' },
];

export const doctorComplianceReports: ComplianceReport[] = [
  { label: 'Today', value: '91%' },
  { label: 'This Week', value: '86%' },
  { label: 'This Month', value: '82%' },
  { label: 'Group Avg', value: '84%' },
];

export const doctorPatients = [
  { id: 'p-101', name: 'Aarav Shah', daily: '100%', weekly: '94%', monthly: '89%' },
  { id: 'p-102', name: 'Nina Patel', daily: '80%', weekly: '84%', monthly: '82%' },
  { id: 'p-103', name: 'Riya Desai', daily: '95%', weekly: '91%', monthly: '90%' },
];
