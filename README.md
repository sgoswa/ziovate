# Ziovate Mobile Frontend

React Native (Expo + TypeScript) starter app for:
- **Patient** workflows with a dedicated **Drug Tracker page** (taken/missed rows, Taken All / Skip All, WhatsApp share, Add Medicine).
- **Doctor** workflows: patient list and compliance reports (individual/group/day/weekly/monthly).
- **Admin** workflows: user management and notification monitoring placeholders.

> Backend calls are intentionally stubbed in `src/services/api.ts` and ready to be connected to FastAPI endpoints later.

## Run locally

```bash
npm install
npm run start
```

For platform targets:

```bash
npm run android
npm run ios
npm run web
```

## Project structure

- `App.tsx`: role-based UI flows and screen placeholders.
- `src/services/api.ts`: API action placeholders for FastAPI integration.
- `src/data/mockData.ts`: temporary mock lists for medicines, patients, and compliance metrics.
- `src/types/index.ts`: shared app type definitions.
