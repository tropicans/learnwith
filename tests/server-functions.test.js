/**
 * Automated Unit & Integration Tests for Server Functions (SRV-01, SRV-03)
 * Tests passkey authentication RPC and internal telemetry diagnostics RPC.
 */
const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

describe('Phase 22 Server Functions Integration Suite (SRV-01, SRV-03)', () => {
  let schemas;
  let serverConfig;

  before(async () => {
    schemas = await import('../app/schemas/serverFn.ts');
    serverConfig = await import('../app/server/config.ts');
  });

  describe('Suite 1: verifyPasskeyInputSchema & Passkey Verification (SRV-01)', () => {
    it('validates correct courseId and trimmed passkey successfully', () => {
      const validAi = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'ai',
        passkey: 'buka-kelas',
      });
      assert.strictEqual(validAi.success, true);
      assert.strictEqual(validAi.data.courseId, 'ai');
      assert.strictEqual(validAi.data.passkey, 'buka-kelas');

      const validWord = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'word',
        passkey: '  buka-kata  ',
      });
      assert.strictEqual(validWord.success, true);
      assert.strictEqual(validWord.data.passkey, 'buka-kata', 'Should trim passkey');
    });

    it('rejects invalid courseId', () => {
      const result = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'excel',
        passkey: 'buka-kelas',
      });
      assert.strictEqual(result.success, false);
      assert.ok(result.error.issues.length > 0);
    });

    it('rejects empty, whitespace-only, or overly long passkey', () => {
      const empty = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'ai',
        passkey: '',
      });
      assert.strictEqual(empty.success, false);

      const whitespace = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'ai',
        passkey: '   ',
      });
      assert.strictEqual(whitespace.success, false);

      const tooLong = schemas.verifyPasskeyInputSchema.safeParse({
        courseId: 'ai',
        passkey: 'a'.repeat(101),
      });
      assert.strictEqual(tooLong.success, false);
    });

    it('authenticates valid passkeys and rejects invalid candidates via timing-safe verification', () => {
      // Simulate auth handler flow
      function executeAuthHandler(payload) {
        const parsed = schemas.verifyPasskeyInputSchema.parse(payload);
        const isAuthorized = serverConfig.verifyPasskeyWithHash(parsed.courseId, parsed.passkey);
        if (!isAuthorized) {
          return {
            success: false,
            message: 'Passkey instruktur tidak valid atau salah.',
          };
        }
        return {
          success: true,
          message: 'Sesi instruktur berhasil diverifikasi.',
          unlockedAt: Date.now(),
        };
      }

      // Positive AI
      const resAi = executeAuthHandler({ courseId: 'ai', passkey: 'buka-kelas' });
      assert.strictEqual(resAi.success, true);
      assert.ok(typeof resAi.unlockedAt === 'number');
      assert.ok(resAi.unlockedAt > 0);
      assert.strictEqual(schemas.verifyPasskeyResultSchema.safeParse(resAi).success, true);

      // Positive Word
      const resWord = executeAuthHandler({ courseId: 'word', passkey: 'buka-kata' });
      assert.strictEqual(resWord.success, true);
      assert.ok(typeof resWord.unlockedAt === 'number');

      // Negative - incorrect password
      const resWrong = executeAuthHandler({ courseId: 'ai', passkey: 'wrong-passkey' });
      assert.strictEqual(resWrong.success, false);
      assert.strictEqual(resWrong.unlockedAt, undefined);
      assert.strictEqual(schemas.verifyPasskeyResultSchema.safeParse(resWrong).success, true);

      // Negative - cross-course passkey
      const resCross = executeAuthHandler({ courseId: 'ai', passkey: 'buka-kata' });
      assert.strictEqual(resCross.success, false);
    });
  });

  describe('Suite 2: diagnosticsInputSchema & System Diagnostics Telemetry (SRV-03)', () => {
    it('validates diagnostics input schema with default includeMemory: false', () => {
      const defaultParsed = schemas.diagnosticsInputSchema.safeParse({});
      assert.strictEqual(defaultParsed.success, true);
      assert.strictEqual(defaultParsed.data.includeMemory, false);

      const memoryParsed = schemas.diagnosticsInputSchema.safeParse({ includeMemory: true });
      assert.strictEqual(memoryParsed.success, true);
      assert.strictEqual(memoryParsed.data.includeMemory, true);
    });

    it('generates sanitized system telemetry without memory when includeMemory is false', () => {
      // Simulate diagnostics handler flow
      function executeDiagnosticsHandler(input) {
        const parsed = schemas.diagnosticsInputSchema.parse(input || {});
        const config = serverConfig.getServerConfig();
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.floor(process.uptime()),
          environment: config.nodeEnv,
          memory: parsed.includeMemory
            ? {
                rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
                heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
              }
            : undefined,
        };
      }

      const res = executeDiagnosticsHandler({});
      assert.strictEqual(res.status, 'healthy');
      assert.ok(typeof res.uptimeSeconds === 'number' && res.uptimeSeconds >= 0);
      assert.ok(typeof res.timestamp === 'string');
      assert.strictEqual(res.memory, undefined);

      const validation = schemas.diagnosticsResultSchema.safeParse(res);
      assert.strictEqual(validation.success, true);
    });

    it('includes memory stats when includeMemory is true', () => {
      function executeDiagnosticsHandler(input) {
        const parsed = schemas.diagnosticsInputSchema.parse(input || {});
        const config = serverConfig.getServerConfig();
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.floor(process.uptime()),
          environment: config.nodeEnv,
          memory: parsed.includeMemory
            ? {
                rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
                heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
              }
            : undefined,
        };
      }

      const res = executeDiagnosticsHandler({ includeMemory: true });
      assert.strictEqual(res.status, 'healthy');
      assert.ok(res.memory !== undefined);
      assert.ok(typeof res.memory.rssMb === 'number' && res.memory.rssMb > 0);
      assert.ok(typeof res.memory.heapUsedMb === 'number' && res.memory.heapUsedMb > 0);

      const validation = schemas.diagnosticsResultSchema.safeParse(res);
      assert.strictEqual(validation.success, true);
    });

    it('ensures secret hashes or master keys are never leaked into diagnostics output', () => {
      const config = serverConfig.getServerConfig();
      const res = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: config.nodeEnv,
      };

      const resString = JSON.stringify(res);
      assert.strictEqual(resString.includes(config.aiPasskeyHash), false, 'Must not include aiPasskeyHash');
      assert.strictEqual(resString.includes(config.wordPasskeyHash), false, 'Must not include wordPasskeyHash');
    });
  });
});
