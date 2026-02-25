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

export const patientDrugTrackerRows = [
  { id: 'd1', time: '8 am', period: 'day', medicine: 'Metformin 500 mg', instruction: 'in empty Stomach', units: '💊💊', actionable: true },
  { id: 'd2', time: '8 am', period: 'day', medicine: 'Metformin 500 mg', instruction: 'in empty Stomach', units: '💊', actionable: true },
  { id: 'd3', time: '10 am', period: 'day', medicine: 'Metformin 500 mg', instruction: 'with food', units: '💊💊', actionable: true },
  { id: 'd4', time: '10 am', period: 'day', medicine: 'Metformin 500 mg', instruction: 'with food', units: '💊', actionable: true },
  { id: 'n1', time: '6 pm', period: 'night', medicine: 'Metformin 500 mg', instruction: 'in empty Stomach', units: '💊💊', actionable: false },
  { id: 'n2', time: '6 pm', period: 'night', medicine: 'Metformin 500 mg', instruction: 'in empty Stomach', units: '💊', actionable: false },
  { id: 'n3', time: '8 pm', period: 'night', medicine: 'Metformin 500 mg', instruction: 'with food', units: '💊', actionable: false },
  { id: 'n4', time: '8 pm', period: 'night', medicine: 'Metformin 500 mg', instruction: 'with food', units: '💊💊', actionable: false },
];
