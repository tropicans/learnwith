/**
 * Automated Unit & Integration Tests for Phase 29:
 * Master Admin Authentication & Route Protection (ADMIN-AUTH-01, ADMIN-AUTH-02, ADMIN-AUTH-04, ADMIN-QA-01)
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

describe('Phase 29 Master Admin Authentication Engine Suite', () => {
  let adminSchemas;
  let serverConfig;
  let sessionModule;

  before(async () => {
    adminSchemas = await import('../app/schemas/admin.ts');
    serverConfig = await import('../app/server/config.ts');
    sessionModule = await import('../app/server/session.ts');
  });

  beforeEach(() => {
    sessionModule.clearAllSessionsForTesting();
  });

  describe('Suite 1: Timing-safe Passkey Verification (ADMIN-AUTH-01)', () => {
    it('authenticates canonical passkey "admin-learnwith" successfully', () => {
      const isValid = serverConfig.verifyAdminPasskey('admin-learnwith');
      assert.strictEqual(isValid, true, 'Default passkey admin-learnwith must authenticate');
    });

    it('handles whitespace trimming gracefully for valid passkey', () => {
      const isValid = serverConfig.verifyAdminPasskey('  admin-learnwith  ');
      assert.strictEqual(isValid, true, 'Whitespace should be trimmed');
    });

    it('rejects invalid or unauthorized candidate passkeys', () => {
      assert.strictEqual(serverConfig.verifyAdminPasskey('wrong-passkey'), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey('admin'), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey('buka-kelas'), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey('buka-kata'), false);
    });

    it('rejects empty, null, undefined, or malformed candidates cleanly', () => {
      assert.strictEqual(serverConfig.verifyAdminPasskey(''), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey('   '), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey(null), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey(undefined), false);
      assert.strictEqual(serverConfig.verifyAdminPasskey(12345), false);
    });
  });

  describe('Suite 2: Admin Session Registry & Lifecycle (ADMIN-AUTH-02)', () => {
    it('creates an active admin session with high-entropy token and 24h TTL', () => {
      const session = sessionModule.createAdminSession('passkey');
      assert.ok(session.token, 'Session must have a token');
      assert.strictEqual(typeof session.token, 'string');
      assert.strictEqual(session.token.length, 64, 'Token must be 64-character hex (256 bits)');
      assert.strictEqual(session.role, 'admin');
      assert.strictEqual(session.authMethod, 'passkey');
      assert.ok(session.expiresAt > session.createdAt, 'expiresAt must be after createdAt');
      assert.strictEqual(session.expiresAt - session.createdAt, sessionModule.SESSION_TTL_SECONDS * 1000);
    });

    it('validates active session and returns authenticated admin metadata', () => {
      const session = sessionModule.createAdminSession('passkey');
      const user = sessionModule.validateAdminSession(session.token);
      assert.ok(user, 'Session must validate successfully');
      assert.strictEqual(user.role, 'admin');
      assert.strictEqual(user.authMethod, 'passkey');
      assert.strictEqual(user.authenticatedAt, session.createdAt);
    });

    it('returns null for unknown, empty, or tampered tokens', () => {
      assert.strictEqual(sessionModule.validateAdminSession('non-existent-token'), null);
      assert.strictEqual(sessionModule.validateAdminSession(''), null);
      assert.strictEqual(sessionModule.validateAdminSession(null), null);
      assert.strictEqual(sessionModule.validateAdminSession(undefined), null);
    });

    it('revokes active session on logout and prevents subsequent validation', () => {
      const session = sessionModule.createAdminSession('passkey');
      assert.ok(sessionModule.validateAdminSession(session.token));

      const revoked = sessionModule.revokeAdminSession(session.token);
      assert.strictEqual(revoked, true, 'Revocation must return true');

      const checkAfterRevocation = sessionModule.validateAdminSession(session.token);
      assert.strictEqual(checkAfterRevocation, null, 'Revoked session must return null');
    });
  });

  describe('Suite 3: Cookie Serialization & Extraction (ADMIN-AUTH-02)', () => {
    it('formats HttpOnly, SameSite=Lax session cookie correctly', () => {
      const dummyToken = 'a'.repeat(64);
      const cookieStr = sessionModule.formatSessionCookie(dummyToken, 86400, false);

      assert.ok(cookieStr.includes(`learnwith_admin_session=${dummyToken}`), 'Must contain cookie key and token');
      assert.ok(cookieStr.includes('HttpOnly'), 'Must enforce HttpOnly');
      assert.ok(cookieStr.includes('SameSite=Lax'), 'Must enforce SameSite=Lax');
      assert.ok(cookieStr.includes('Path=/'), 'Must enforce Path=/');
      assert.ok(cookieStr.includes('Max-Age=86400'), 'Must set 24h Max-Age');
      assert.strictEqual(cookieStr.includes('Secure'), false, 'Development mode should not enforce Secure');

      const secureCookieStr = sessionModule.formatSessionCookie(dummyToken, 86400, true);
      assert.ok(secureCookieStr.includes('Secure'), 'Production mode must enforce Secure');
    });

    it('formats clearing cookie with Max-Age=0', () => {
      const clearStr = sessionModule.formatClearCookie(false);
      assert.ok(clearStr.includes('learnwith_admin_session='));
      assert.ok(clearStr.includes('Max-Age=0'), 'Must expire cookie immediately');
    });

    it('reads session token accurately from single or multi-cookie headers', () => {
      const token = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

      // Single cookie header
      const singleHeader = `learnwith_admin_session=${token}`;
      assert.strictEqual(sessionModule.readSessionToken(singleHeader), token);

      // Multi-cookie header with spaces
      const multiHeader = `other_cookie=foo; learnwith_admin_session=${token}; theme=dark`;
      assert.strictEqual(sessionModule.readSessionToken(multiHeader), token);

      // Missing or empty header
      assert.strictEqual(sessionModule.readSessionToken(''), null);
      assert.strictEqual(sessionModule.readSessionToken('other_cookie=bar'), null);
      assert.strictEqual(sessionModule.readSessionToken(undefined), null);
    });
  });

  describe('Suite 4: Schema Validation (ADMIN-AUTH-04)', () => {
    it('validates admin login inputs and trims whitespace', () => {
      const valid = adminSchemas.adminLoginInputSchema.safeParse({
        passkey: '  admin-learnwith  ',
      });
      assert.strictEqual(valid.success, true);
      assert.strictEqual(valid.data.passkey, 'admin-learnwith');
    });

    it('rejects empty or excessively long passkeys in adminLoginInputSchema', () => {
      const empty = adminSchemas.adminLoginInputSchema.safeParse({ passkey: '' });
      assert.strictEqual(empty.success, false);

      const whitespace = adminSchemas.adminLoginInputSchema.safeParse({ passkey: '   ' });
      assert.strictEqual(whitespace.success, false);

      const tooLong = adminSchemas.adminLoginInputSchema.safeParse({ passkey: 'x'.repeat(101) });
      assert.strictEqual(tooLong.success, false);
    });

    it('validates adminSessionResultSchema structure', () => {
      const authed = adminSchemas.adminSessionResultSchema.safeParse({
        authenticated: true,
        adminUser: {
          role: 'admin',
          authenticatedAt: Date.now(),
          authMethod: 'passkey',
        },
      });
      assert.strictEqual(authed.success, true);

      const unauthed = adminSchemas.adminSessionResultSchema.safeParse({
        authenticated: false,
      });
      assert.strictEqual(unauthed.success, true);
    });

    it('validates adminAuthConfigSchema structure', () => {
      const configRes = adminSchemas.adminAuthConfigSchema.safeParse({
        googleAuthAvailable: false,
        googleClientIdConfigured: true,
        authModes: ['passkey', 'google'],
      });
      assert.strictEqual(configRes.success, true);
    });
  });

  describe('Suite 5: Secret Quarantine & Client Boundary Integrity (ADMIN-AUTH-01, ADMIN-QA-01)', () => {
    it('guarantees admin passkey hash and config do not leak into client routes or components', () => {
      const routesDir = path.join(ROOT_DIR, 'app', 'routes');
      const componentsDir = path.join(ROOT_DIR, 'app', 'components');
      const clientFiles = [...getAllFiles(routesDir), ...getAllFiles(componentsDir)];

      const forbiddenSecrets = [
        '5e5dc93b4232b40fc465e93816ffed9075952c54d9c7536cded05ec4bb255fe3',
        '942008f51ec6a93863750ebce5b3b0df36ca024b4238bfe4bb14798c87abf066',
        'ADMIN_PASSKEY_HASH',
      ];

      for (const filePath of clientFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        const relPath = path.relative(ROOT_DIR, filePath);

        for (const secret of forbiddenSecrets) {
          assert.strictEqual(
            content.includes(secret),
            false,
            `Client file ${relPath} contains leaked secret string/env: ${secret}`
          );
        }
      }
    });

    it('ensures app/schemas/admin.ts is isomorphic without node: or process.env dependencies', () => {
      const schemaPath = path.join(ROOT_DIR, 'app', 'schemas', 'admin.ts');
      const content = fs.readFileSync(schemaPath, 'utf8');

      assert.doesNotMatch(content, /node:/, 'app/schemas/admin.ts must not import node modules');
      assert.doesNotMatch(content, /process\.env/, 'app/schemas/admin.ts must not read process.env');
      assert.match(content, /z\.object/, 'app/schemas/admin.ts must define Zod schemas');
    });
  });

  describe('Suite 6: Route Component & Client Gate Integrity (ADMIN-AUTH-03)', () => {
    it('verifies /admin route file exports Route with loader and meta tags', () => {
      const routePath = path.join(ROOT_DIR, 'app', 'routes', 'admin.tsx');
      assert.strictEqual(fs.existsSync(routePath), true, 'app/routes/admin.tsx must exist');

      const content = fs.readFileSync(routePath, 'utf8');
      assert.ok(content.includes("createFileRoute('/admin')"), 'Must define /admin route');
      assert.ok(content.includes('adminCheckSessionFn'), 'Loader must check session via adminCheckSessionFn');
      assert.ok(content.includes('adminGetAuthConfigFn'), 'Loader must fetch auth config via adminGetAuthConfigFn');
      assert.ok(content.includes('AdminLoginGate'), 'Component must reference AdminLoginGate');
      assert.ok(content.includes('AdminShell'), 'Component must reference AdminShell');
    });

    it('verifies AdminLoginGate component structure and element IDs', () => {
      const gatePath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'AdminLoginGate.tsx');
      assert.strictEqual(fs.existsSync(gatePath), true, 'AdminLoginGate.tsx must exist');

      const content = fs.readFileSync(gatePath, 'utf8');
      assert.ok(content.includes('id="admin-login-gate"'), 'Must have root container id');
      assert.ok(content.includes('id="admin-passkey-input"'), 'Must have passkey input id');
      assert.ok(content.includes('id="btn-admin-submit-login"'), 'Must have submit button id');
      assert.ok(content.includes('type="password"'), 'Passkey input must be password type');
      assert.ok(content.includes('adminLoginFn'), 'Must call adminLoginFn on submit');
    });

    it('verifies GoogleSignInButton readiness structure and badge', () => {
      const googlePath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'GoogleSignInButton.tsx');
      assert.strictEqual(fs.existsSync(googlePath), true, 'GoogleSignInButton.tsx must exist');

      const content = fs.readFileSync(googlePath, 'utf8');
      assert.ok(content.includes('id="btn-admin-google-signin"'), 'Must have Google button id');
      assert.ok(content.includes('id="badge-google-readiness"'), 'Must have readiness badge id');
      assert.ok(content.includes('Google Workspace'), 'Must display Google Workspace label');
      assert.ok(content.includes('Siap Dikonfigurasi'), 'Must indicate readiness state');
    });

    it('verifies AdminShell navigation tabs and logout elements', () => {
      const shellPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'AdminShell.tsx');
      assert.strictEqual(fs.existsSync(shellPath), true, 'AdminShell.tsx must exist');

      const content = fs.readFileSync(shellPath, 'utf8');
      assert.ok(content.includes('id="admin-shell-container"'), 'Must have shell container id');
      assert.ok(content.includes('id="btn-admin-logout"'), 'Must have logout button id');
      assert.ok(content.includes('id="tab-admin-dashboard"'), 'Must have dashboard tab id');
      assert.ok(content.includes('id="tab-admin-telemetry"'), 'Must have telemetry tab id');
      assert.ok(content.includes('id="tab-admin-passkeys"'), 'Must have passkeys tab id');
      assert.ok(content.includes('id="tab-admin-troubleshooting"'), 'Must have troubleshooting tab id');
      assert.ok(content.includes('id="tab-admin-settings"'), 'Must have settings tab id');
      assert.ok(content.includes('adminLogoutFn'), 'Must call adminLogoutFn on logout');
    });

    it('verifies assets/css/admin.css exists and is mirrored to public/assets/css/admin.css', () => {
      const srcCssPath = path.join(ROOT_DIR, 'assets', 'css', 'admin.css');
      const pubCssPath = path.join(ROOT_DIR, 'public', 'assets', 'css', 'admin.css');

      assert.strictEqual(fs.existsSync(srcCssPath), true, 'assets/css/admin.css must exist');
      assert.strictEqual(fs.existsSync(pubCssPath), true, 'public/assets/css/admin.css must exist');

      const srcContent = fs.readFileSync(srcCssPath, 'utf8');
      const pubContent = fs.readFileSync(pubCssPath, 'utf8');
      assert.strictEqual(srcContent, pubContent, 'Source and public stylesheets must be identical');
      assert.ok(srcContent.includes('Authoritative Source: assets/css/admin.css'), 'Must have authoritative header');
    });

    it('verifies __root.tsx includes admin.css in head links', () => {
      const rootPath = path.join(ROOT_DIR, 'app', 'routes', '__root.tsx');
      const content = fs.readFileSync(rootPath, 'utf8');
      assert.ok(content.includes('/assets/css/admin.css'), '__root.tsx must include admin.css link');
    });
  });
});
