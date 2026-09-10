---
status: complete
date: 2026-09-10
description: Add Setup Models and Setup Combos steps to Modul 6 in Live Class
---

# Add Setup Models & Setup Combos to Modul 6 (9Router)

## Objective
Enhance Modul 6 in `app/data/liveClassModules.ts` to include explicit steps for:
1. **Setup Models**: Registering LLM provider API keys and activating target models in 9Router Web Dashboard (`http://localhost:20128`).
2. **Setup Combos**: Creating multi-model fallback and failover combos in 9Router Web Dashboard.
3. Updating Step sequence:
   - 6A: Verifikasi Status 9Router Gateway di Port 20128
   - 6B: Buka Web Dashboard 9Router & Terbitkan Virtual Key
   - 6C: Konfigurasi Provider & Setup Model LLM
   - 6D: Setup Combos Matriks Fallback Routing
   - 6E: Uji Endpoint Chat Completion 9Router via cURL
4. Update criteria in `app/components/course/liveclass/LiveClassCheckpointsSection.tsx`.
5. Verify TypeScript compilation (`npm run typecheck`), run test suite (`npm test`), rebuild Docker container, and verify live.
