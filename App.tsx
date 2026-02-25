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
import { doctorComplianceReports, doctorPatients, todayMedicines } from './src/data/mockData';
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

    await api.login(email, password); // placeholder for FastAPI endpoint
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

      {session.role === 'patient' && <PatientDashboard />}
      {session.role === 'doctor' && <DoctorDashboard />}
      {session.role === 'admin' && <AdminDashboard />}
    </ScrollView>
  );
}

function PatientDashboard() {
  const handleAction = async (medicineId: string, action: 'taken' | 'missed') => {
    await api.sendMedicineAction(action, medicineId);
    Alert.alert('Saved', `Medicine marked as ${action}.`);
  };

  return (
    <View style={styles.stack}>
      <Card title="Patient Onboarding">
        <Text style={styles.listItem}>• Register profile + emergency WhatsApp contact</Text>
        <Text style={styles.listItem}>• Add doctors and upload prescriptions</Text>
        <Text style={styles.listItem}>• Add medicines and schedule dose times</Text>
      </Card>

      <Card title="Today's Medicines">
        {todayMedicines.map((medicine) => (
          <View key={medicine.id} style={styles.medicineRow}>
            <View>
              <Text style={styles.itemTitle}>{medicine.name}</Text>
              <Text>{medicine.dosage} • {medicine.schedule}</Text>
            </View>
            <View style={styles.row}>
              <MiniButton label="Taken" onPress={() => handleAction(medicine.id, 'taken')} />
              <MiniButton label="Missed" danger onPress={() => handleAction(medicine.id, 'missed')} />
            </View>
          </View>
        ))}
      </Card>

      <Card title="Reminder Automation (placeholder logic)">
        <Text style={styles.listItem}>1) In-app alarm at medicine time</Text>
        <Text style={styles.listItem}>2) WhatsApp reminder to patient</Text>
        <Text style={styles.listItem}>3) If no response after 3 alarms (15 min interval), trigger emergency contact WhatsApp message</Text>
      </Card>
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

function MiniButton({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable style={[styles.miniButton, danger && styles.dangerButton]} onPress={onPress}>
      <Text style={styles.miniButtonText}>{label}</Text>
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
  container: { flex: 1, backgroundColor: '#f5f7fb' },
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
  chipText: { color: '#29436a' },
  chipTextSelected: { color: '#0f3f89', fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: '#e1e7f0' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e2c40' },
  listItem: { color: '#31445f' },
  medicineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontWeight: '600', color: '#1f2d43' },
  miniButton: { backgroundColor: '#18864f', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  dangerButton: { backgroundColor: '#c23e3e' },
  miniButtonText: { color: 'white', fontWeight: '600' },
  metricCard: { backgroundColor: '#edf4ff', borderRadius: 8, padding: 10, minWidth: 90 },
  metricValue: { fontWeight: '700', fontSize: 20, color: '#17407f' },
  patientRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
});
