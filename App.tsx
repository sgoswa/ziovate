import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { doctorComplianceReports, doctorPatients, patientDrugTrackerRows } from './src/data/mockData';
import { api } from './src/services/api';
import { UserRole } from './src/types';

type Session = {
  name: string;
  role: UserRole;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {!session ? (
        <LoginScreen onLogin={setSession} />
      ) : (
        <RoleHome session={session} onLogout={() => setSession(null)} />
      )}
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');

  const canSubmit = useMemo(() => name && email && password, [name, email, password]);

  const login = async () => {
    if (!canSubmit) {
      Alert.alert('Missing details', 'Please fill all fields before login.');
      return;
    }

    await api.login(email, password);
    onLogin({ name, role });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Ziovate Care</Text>
      <Text style={styles.subtitle}>Patient, Doctor & Admin mobile app (Android + iOS)</Text>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.sectionTitle}>Login as</Text>
      <View style={styles.row}>
        {(['patient', 'doctor', 'admin'] as UserRole[]).map((r) => (
          <Chip key={r} label={r} selected={role === r} onPress={() => setRole(r)} />
        ))}
      </View>

      <PrimaryButton label="Login" onPress={login} />
      <Text style={styles.helper}>FastAPI integration points are intentionally placeholders for now.</Text>
    </ScrollView>
  );
}

function RoleHome({ session, onLogout }: { session: Session; onLogout: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>Hello, {session.name}</Text>
          <Text style={styles.subtitle}>Role: {session.role.toUpperCase()}</Text>
        </View>
        <Pressable onPress={onLogout}>
          <Text style={styles.link}>Logout</Text>
        </Pressable>
      </View>

      {session.role === 'patient' && <PatientDrugTracker />}
      {session.role === 'doctor' && <DoctorDashboard />}
      {session.role === 'admin' && <AdminDashboard />}
    </ScrollView>
  );
}

function PatientDrugTracker() {
  const dayRows = patientDrugTrackerRows.filter((row) => row.period === 'day');
  const nightRows = patientDrugTrackerRows.filter((row) => row.period === 'night');

  const handleAction = async (medicineId: string, action: 'taken' | 'missed') => {
    await api.sendMedicineAction(action, medicineId);
    Alert.alert('Saved', `Medicine marked as ${action}.`);
  };

  return (
    <View style={styles.trackerContainer}>
      <Text style={styles.trackerTitle}>View My Drug Tracker</Text>
      <View style={styles.dateNavigator}>
        <Text style={styles.navArrow}>◀</Text>
        <Text style={styles.dateText}>Today, 17th Sep</Text>
        <Text style={styles.navArrow}>▶</Text>
      </View>

      {dayRows.map((row) => (
        <DrugRow key={row.id} row={row} onSelect={handleAction} />
      ))}

      <View style={styles.bulkActions}>
        <Pressable style={styles.bulkTaken} onPress={() => Alert.alert('Bulk action', 'All morning medicines marked as taken (placeholder).')}>
          <Text style={styles.bulkText}>Taken All</Text>
        </Pressable>
        <Pressable style={styles.bulkSkip} onPress={() => Alert.alert('Bulk action', 'All morning medicines marked as missed (placeholder).')}>
          <Text style={styles.bulkText}>Skip All</Text>
        </Pressable>
      </View>

      {nightRows.map((row) => (
        <DrugRow key={row.id} row={row} onSelect={handleAction} />
      ))}

      <Pressable style={styles.whatsappButton} onPress={() => Alert.alert('WhatsApp', 'Share to WhatsApp placeholder action.')}> 
        <Text style={styles.whatsappText}>🟢 Share on WhatsApp</Text>
      </Pressable>

      <Pressable style={styles.addMedicineButton} onPress={() => Alert.alert('Add medicine', 'Open add medicine form placeholder.')}> 
        <Text style={styles.addMedicineText}>Add New Medicine</Text>
      </Pressable>
    </View>
  );
}

function DrugRow({
  row,
  onSelect,
}: {
  row: { id: string; time: string; period: string; medicine: string; instruction: string; units: string; actionable: boolean };
  onSelect: (medicineId: string, action: 'taken' | 'missed') => Promise<void>;
}) {
  return (
    <View style={styles.drugRow}>
      <Text style={styles.timeCell}>{row.period === 'day' ? '☀️' : '🌙'} {row.time}</Text>

      <View style={styles.drugCard}>
        {row.actionable ? (
          <Pressable style={styles.iconButton} onPress={() => onSelect(row.id, 'taken')}>
            <Text style={styles.okIcon}>✅</Text>
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}

        <View style={styles.drugDetails}>
          <Text style={styles.drugName}>{row.medicine}</Text>
          <Text style={styles.drugMeta}>{row.units} • {row.instruction}</Text>
        </View>

        {row.actionable ? (
          <Pressable style={styles.iconButton} onPress={() => onSelect(row.id, 'missed')}>
            <Text style={styles.missIcon}>❌</Text>
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    </View>
  );
}

function DoctorDashboard() {
  return (
    <View style={styles.stack}>
      <Card title="Compliance Overview">
        <View style={styles.row}>
          {doctorComplianceReports.map((report) => (
            <View key={report.label} style={styles.metricCard}>
              <Text style={styles.metricValue}>{report.value}</Text>
              <Text>{report.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card title="Doctor's Patients">
        {doctorPatients.map((patient) => (
          <View key={patient.id} style={styles.patientRow}>
            <Text style={styles.itemTitle}>{patient.name}</Text>
            <Text>D: {patient.daily} | W: {patient.weekly} | M: {patient.monthly}</Text>
          </View>
        ))}
      </Card>

      <Card title="Report Filters (to connect with FastAPI)">
        <Text style={styles.listItem}>• Individual / Group</Text>
        <Text style={styles.listItem}>• Day-wise / Weekly / Monthly</Text>
        <Text style={styles.listItem}>• Export hooks can be added later</Text>
      </Card>
    </View>
  );
}

function AdminDashboard() {
  return (
    <View style={styles.stack}>
      <Card title="Admin Control Panel">
        <Text style={styles.listItem}>• Manage doctors, patients and system-wide settings</Text>
        <Text style={styles.listItem}>• Monitor missed-dose escalation events</Text>
        <Text style={styles.listItem}>• Configure notification templates (in-app + WhatsApp)</Text>
      </Card>
      <Card title="Backend placeholders">
        <Text style={styles.listItem}>• /auth/*</Text>
        <Text style={styles.listItem}>• /patients/*</Text>
        <Text style={styles.listItem}>• /doctors/*</Text>
        <Text style={styles.listItem}>• /reports/*</Text>
      </Card>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  screen: { padding: 16, gap: 12 },
  stack: { gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#13233b' },
  subtitle: { color: '#4c5c74' },
  sectionTitle: { marginTop: 6, fontWeight: '600', color: '#26364d' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d7dfeb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: '#1565d8', fontWeight: '600' },
  primaryButton: { backgroundColor: '#1565d8', borderRadius: 10, padding: 12, alignItems: 'center' },
  primaryButtonText: { color: 'white', fontWeight: '700' },
  helper: { color: '#607089', fontSize: 12 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bdd3f7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  chipSelected: { backgroundColor: '#dce9fd', borderColor: '#1565d8' },
  chipText: { color: '#29436a', textTransform: 'capitalize' },
  chipTextSelected: { color: '#0f3f89', fontWeight: '700' },

  trackerContainer: {
    backgroundColor: '#f8f9fb',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  trackerTitle: { textAlign: 'center', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  dateNavigator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 8 },
  navArrow: { fontSize: 16, color: '#111827' },
  dateText: { fontWeight: '700', color: '#166534' },
  drugRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeCell: { width: 70, fontSize: 20, fontWeight: '600', color: '#111827', textTransform: 'lowercase' },
  drugCard: {
    flex: 1,
    backgroundColor: '#d9f6da',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c6e8c7',
  },
  iconButton: { width: 36, alignItems: 'center', justifyContent: 'center' },
  iconSpacer: { width: 36 },
  okIcon: { fontSize: 22 },
  missIcon: { fontSize: 22 },
  drugDetails: { flex: 1, backgroundColor: '#7dc6c9', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  drugName: { fontWeight: '700', color: '#0f172a', fontSize: 16 },
  drugMeta: { color: '#0f172a', fontSize: 14 },

  bulkActions: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  bulkTaken: { flex: 1, backgroundColor: '#22c55e', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  bulkSkip: { flex: 1, backgroundColor: '#e11d48', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  bulkText: { color: 'white', fontWeight: '700', fontSize: 20 },

  whatsappButton: {
    alignSelf: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 8,
  },
  whatsappText: { color: 'white', fontWeight: '700', fontSize: 16 },
  addMedicineButton: {
    marginTop: 14,
    backgroundColor: '#0b0b0c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addMedicineText: { color: 'white', fontSize: 30, fontWeight: '500' },

  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: '#e1e7f0' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e2c40' },
  listItem: { color: '#31445f' },
  itemTitle: { fontWeight: '600', color: '#1f2d43' },
  metricCard: { backgroundColor: '#edf4ff', borderRadius: 8, padding: 10, minWidth: 90 },
  metricValue: { fontWeight: '700', fontSize: 20, color: '#17407f' },
  patientRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
});
