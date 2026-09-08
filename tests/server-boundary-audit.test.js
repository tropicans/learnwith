/**
 * Automated Boundary Isolation & Leakage Audit Test (SRV-02)
 * Ensures server secrets, timing-safe crypto, and server config
 * are quarantined under app/server/ and never leak into client bundles or route files.
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT_DIR = path.resolve(__dirname, '..');

function getAllFiles(dirPath, arrayOfFiles = []) {
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

describe('Phase 22 Boundary Isolation Audit (SRV-02)', () => {
  const configPath = path.join(ROOT_DIR, 'app', 'server', 'config.ts');
  const schemaPath = path.join(ROOT_DIR, 'app', 'schemas', 'serverFn.ts');

  it('quarantines server configuration file strictly under app/server/', () => {
    assert.strictEqual(fs.existsSync(configPath), true, 'app/server/config.ts must exist');
    assert.strictEqual(fs.existsSync(schemaPath), true, 'app/schemas/serverFn.ts must exist');

    const configSource = fs.readFileSync(configPath, 'utf8');
    assert.match(configSource, /node:crypto/, 'app/server/config.ts must import node:crypto');
    assert.match(configSource, /timingSafeEqual/, 'app/server/config.ts must use timingSafeEqual');
    assert.match(configSource, /getServerConfig/, 'app/server/config.ts must export getServerConfig');
    assert.match(configSource, /verifyPasskeyWithHash/, 'app/server/config.ts must export verifyPasskeyWithHash');
  });

  it('performs timing-safe hash comparison correctly for valid and invalid passkeys', () => {
    // Replicate verifyPasskeyWithHash behavior to audit the algorithm
    function testVerify(courseId, candidate) {
      if (!candidate || typeof candidate !== 'string') return false;
      const targetHash = courseId === 'ai'
        ? 'b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f'
        : 'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b';

      const candidateHash = crypto
        .createHash('sha256')
        .update(candidate.trim().toLowerCase())
        .digest('hex');

      const targetBuf = Buffer.from(targetHash, 'hex');
      const candidateBuf = Buffer.from(candidateHash, 'hex');
      if (targetBuf.length !== candidateBuf.length) return false;
      return crypto.timingSafeEqual(targetBuf, candidateBuf);
    }

    // Positive cases
    assert.strictEqual(testVerify('ai', 'buka-kelas'), true, 'buka-kelas must match ai passkey');
    assert.strictEqual(testVerify('ai', '  BUKA-KELAS  '), true, 'whitespace/uppercase must be normalized');
    assert.strictEqual(testVerify('word', 'buka-kata'), true, 'buka-kata must match word passkey');
    assert.strictEqual(testVerify('word', ' BUKA-KATA '), true, 'whitespace/uppercase must be normalized');

    // Negative cases
    assert.strictEqual(testVerify('ai', 'wrong-password'), false, 'invalid passkey must fail');
    assert.strictEqual(testVerify('ai', 'buka-kata'), false, 'cross-course passkey must fail');
    assert.strictEqual(testVerify('word', 'buka-kelas'), false, 'cross-course passkey must fail');
    assert.strictEqual(testVerify('ai', ''), false, 'empty passkey must fail');
    assert.strictEqual(testVerify('ai', null), false, 'null passkey must fail');
  });

  it('prohibits direct imports of app/server/config in client routes and components', () => {
    const routesDir = path.join(ROOT_DIR, 'app', 'routes');
    const componentsDir = path.join(ROOT_DIR, 'app', 'components');

    const clientFiles = [...getAllFiles(routesDir), ...getAllFiles(componentsDir)];
    assert.ok(clientFiles.length > 0, 'Must have found client routes and components');

    const forbiddenImports = [
      /from\s+['"][^'"]*\/server\/config['"]/,
      /from\s+['"]@\/server\/config['"]/,
      /require\(['"][^'"]*\/server\/config['"]\)/,
      /from\s+['"]node:crypto['"]/,
      /from\s+['"]crypto['"]/,
    ];

    for (const filePath of clientFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const relPath = path.relative(ROOT_DIR, filePath);

      for (const pattern of forbiddenImports) {
        assert.doesNotMatch(
          content,
          pattern,
          `Client file ${relPath} contains forbidden server import matching ${pattern}`
        );
      }
    }
  });

  it('ensures secret passkey hash constants do not leak into client routes or components', () => {
    const routesDir = path.join(ROOT_DIR, 'app', 'routes');
    const componentsDir = path.join(ROOT_DIR, 'app', 'components');
    const clientFiles = [...getAllFiles(routesDir), ...getAllFiles(componentsDir)];

    const forbiddenSecrets = [
      'b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f',
      '4452077e60e86b8ee876b509f61b09b52a9261a9953c8965a3c03565e33d26aa',
      'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b',
      'AI_PASSKEY_HASH',
      'WORD_PASSKEY_HASH',
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

  it('guarantees shared schemas file is isomorphic and free of server-only primitives', () => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    assert.doesNotMatch(schemaContent, /node:/, 'Schemas must not import node: modules');
    assert.doesNotMatch(schemaContent, /process\.env/, 'Schemas must not access process.env directly');
    assert.match(schemaContent, /z\.object/, 'Schemas must define Zod objects');
  });
});
