/**
 * Placeholder API client for future FastAPI integration.
 * Replace stubbed responses with fetch/axios calls when backend endpoints are available.
 */
export const api = {
  async login(email: string, password: string) {
    void email;
    void password;
    return { success: true };
  },

  async registerPatient(payload: Record<string, string>) {
    void payload;
    return { success: true };
  },

  async uploadPrescription() {
    return { success: true };
  },

  async sendMedicineAction(action: 'taken' | 'missed', medicineId: string) {
    void action;
    void medicineId;
    return { success: true };
  },

  async fetchDoctorPatients() {
    return { success: true, data: [] };
  },

  async fetchComplianceReports() {
    return { success: true, data: [] };
  },
};
