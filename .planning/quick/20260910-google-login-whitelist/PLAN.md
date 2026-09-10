---
status: complete
date: 2026-09-10
description: Restrict Google login strictly to tropicans@gmail.com
---

# Restrict Google Login to tropicans@gmail.com

## Objective
Ensure only tropicans@gmail.com can log in via Google OAuth SSO to access the Master Admin Command Center.

## Implementation Steps
1. Add GOOGLE_ALLOWED_EMAIL to .env and pp/server/config.ts.
2. Extract user email in pp/server/adminAuth.ts and validate against allowed list.
3. Propagate and render authentication errors in pp/routes/admin.tsx and pp/components/admin/AdminLoginGate.tsx.
4. Add automated test coverage in 	ests/admin-auth.test.js.
