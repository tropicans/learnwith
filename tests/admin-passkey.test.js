/**
 * Automated Unit & Integration Tests for Phase 32:
 * Workshop Access Passkey Management Console, Rotation Engine & Audit Hub
 * Requirements: ADMIN-PASS-01, ADMIN-PASS-02, ADMIN-PASS-03
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const crypto = require('node:crypto')

describe('Phase 32 Workshop Access Passkey Management Suite', () => {
  let passkeyStore
  let passkeyServer
  let passkeySchemas
  let sessionModule

  before(async () => {
    passkeyStore = await import('../app/server/passkeyStore.ts')
    passkeyServer = await import('../app/server/passkey.ts')
    passkeySchemas = await import('../app/schemas/passkey.ts')
    sessionModule = await import('../app/server/session.ts')
  })

  beforeEach(() => {
    passkeyStore.clearPasskeyStoreForTesting()
    sessionModule.clearAllSessionsForTesting()
  })

  // =========================================================================
  // Suite 1: Active Passkey Retrieval & Default Hashes (ADMIN-PASS-01)
  // =========================================================================
  describe('Suite 1: Active Passkey Retrieval & Default Hashes (ADMIN-PASS-01)', () => {
    it('verifies Course 2 (word) default passkey verifies "buka-kata" and matches canonical SHA-256 hash', () => {
      const status = passkeyStore.getPasskeyStatus()
      const wordRecord = status.passkeys.word

      assert.ok(wordRecord, 'Course 2 (word) passkey record must exist')
      assert.strictEqual(wordRecord.courseId, 'word')
      assert.strictEqual(
        wordRecord.currentHash,
        'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b',
        'Word passkey hash must match canonical SHA-256 of "buka-kata"'
      )
      assert.strictEqual(wordRecord.version, 1, 'Initial version must be 1')
      assert.strictEqual(wordRecord.status, 'active')

      // Verify "buka-kata" verifies successfully
      const verification = passkeyStore.verifyPasskeyWithStore('word', 'buka-kata', 'client-test-01')
      assert.strictEqual(verification.success, true)
      assert.ok(verification.unlockedAt)
    })

    it('verifies Course 1 (ai) default passkey verifies "buka-kelas" and matches canonical SHA-256 hash', () => {
      const status = passkeyStore.getPasskeyStatus()
      const aiRecord = status.passkeys.ai

      assert.ok(aiRecord, 'Course 1 (ai) passkey record must exist')
      assert.strictEqual(aiRecord.courseId, 'ai')
      assert.strictEqual(
        aiRecord.currentHash,
        'b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f',
        'AI passkey hash must match canonical SHA-256 of "buka-kelas"'
      )
      assert.strictEqual(aiRecord.version, 1, 'Initial version must be 1')
      assert.strictEqual(aiRecord.status, 'active')

      // Verify "buka-kelas" verifies successfully
      const verification = passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', 'client-test-02')
      assert.strictEqual(verification.success, true)
      assert.ok(verification.unlockedAt)
    })

    it('verifies masked preview format (buk****ta and buk****as)', () => {
      const status = passkeyStore.getPasskeyStatus()
      assert.strictEqual(status.passkeys.word.clearTextPreview, 'buk****ta')
      assert.strictEqual(status.passkeys.ai.clearTextPreview, 'buk****as')

      // Test helper maskPasskey
      assert.strictEqual(passkeyStore.maskPasskey('abc'), '****')
      assert.strictEqual(passkeyStore.maskPasskey('abcd'), '****')
      assert.strictEqual(passkeyStore.maskPasskey('12345'), '123****45')
      assert.strictEqual(passkeyStore.maskPasskey('asn-unggul-2026'), 'asn****26')
    })
  })

  // =========================================================================
  // Suite 2: Dynamic Passkey Rotation Engine (ADMIN-PASS-02)
  // =========================================================================
  describe('Suite 2: Dynamic Passkey Rotation Engine (ADMIN-PASS-02)', () => {
    it('rotates passkey dynamically in-memory and archives previous hash to rotation history', () => {
      const newPasskey = 'asn-unggul-2026'
      const expectedNewHash = crypto.createHash('sha256').update(newPasskey).digest('hex')

      const result = passkeyStore.rotatePasskey(
        {
          courseId: 'word',
          newPasskey,
          reason: 'Pergantian Workshop Angkatan 2',
        },
        'master-admin'
      )

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.courseId, 'word')
      assert.strictEqual(result.version, 2, 'Version must increment to 2')
      assert.strictEqual(result.hashPreview, expectedNewHash.substring(0, 16))

      // Verify state in store
      const status = passkeyStore.getPasskeyStatus()
      const updatedWord = status.passkeys.word
      assert.strictEqual(updatedWord.version, 2)
      assert.strictEqual(updatedWord.currentHash, expectedNewHash)
      assert.strictEqual(updatedWord.clearTextPreview, 'asn****26')
      assert.strictEqual(updatedWord.rotatedBy, 'master-admin')

      // Verify rotation history contains previous version 1 record
      const historyWord = status.rotationHistory.filter((h) => h.courseId === 'word')
      assert.ok(historyWord.length >= 2, 'Must have at least 2 history records for word')
      assert.strictEqual(historyWord[0].version, 1, 'Archived entry must record previous version 1')
      assert.strictEqual(
        historyWord[0].hash,
        'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b'
      )
      assert.strictEqual(historyWord[0].reason, 'Pergantian Workshop Angkatan 2')
    })

    it('authenticates with new passkey immediately and invalidates previous passkey', () => {
      // 1. Initially old passkey succeeds
      assert.strictEqual(
        passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', 'test-client-rot').success,
        true
      )

      // 2. Rotate passkey
      passkeyStore.rotatePasskey({
        courseId: 'ai',
        newPasskey: 'kelas-ai-batch2',
        reason: 'Sesi Siang',
      })

      // 3. New candidate succeeds
      const newAttempt = passkeyStore.verifyPasskeyWithStore('ai', 'kelas-ai-batch2', 'test-client-rot')
      assert.strictEqual(newAttempt.success, true)

      // 4. Old passkey now strictly fails
      const oldAttempt = passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', 'test-client-rot')
      assert.strictEqual(oldAttempt.success, false)
    })

    it('rejects candidate passkeys shorter than 6 characters or longer than 64 characters', () => {
      // Shorter than 6
      assert.throws(() => {
        passkeyStore.rotatePasskey({
          courseId: 'word',
          newPasskey: '12345',
        })
      })

      // Longer than 64
      assert.throws(() => {
        passkeyStore.rotatePasskey({
          courseId: 'word',
          newPasskey: 'a'.repeat(65),
        })
      })

      // Valid boundary values (6 chars and 64 chars)
      assert.doesNotThrow(() => {
        passkeyStore.rotatePasskey({
          courseId: 'word',
          newPasskey: '123456',
        })
      })

      assert.doesNotThrow(() => {
        passkeyStore.rotatePasskey({
          courseId: 'word',
          newPasskey: 'a'.repeat(64),
        })
      })
    })
  })

  // =========================================================================
  // Suite 3: Unlock Attempt Audit Trail & Secret Masking (ADMIN-PASS-03, T-32-01)
  // =========================================================================
  describe('Suite 3: Unlock Attempt Audit Trail & Secret Masking (ADMIN-PASS-03, T-32-01)', () => {
    it('records successful unlock attempt in audit trail with masked prefix', () => {
      const candidate = 'buka-kata'
      const candidateHashPrefix = crypto
        .createHash('sha256')
        .update(candidate)
        .digest('hex')
        .substring(0, 8)

      passkeyStore.verifyPasskeyWithStore('word', candidate, 'client-audit-success', '192.168.1.50')

      const logs = passkeyStore.getPasskeyAuditLogs({ limit: 10 })
      const recent = logs.find((l) => l.clientId === 'client-audit-success')

      assert.ok(recent, 'Successful unlock attempt must be recorded')
      assert.strictEqual(recent.success, true)
      assert.strictEqual(recent.courseId, 'word')
      assert.strictEqual(recent.attemptHashPrefix, candidateHashPrefix)
      assert.strictEqual(recent.ipAddress, '192.168.1.50')
    })

    it('records failed unlock attempt with failure reason and never leaks raw candidate secret', () => {
      const rawSecret = 'SUPER_SECRET_TYPO_PASSKEY_999'
      const secretHashPrefix = crypto
        .createHash('sha256')
        .update(rawSecret.toLowerCase())
        .digest('hex')
        .substring(0, 8)

      passkeyStore.verifyPasskeyWithStore('ai', rawSecret, 'client-audit-failed', '192.168.1.51')

      const logs = passkeyStore.getPasskeyAuditLogs({ limit: 10 })
      const recent = logs.find((l) => l.clientId === 'client-audit-failed')

      assert.ok(recent, 'Failed attempt must be logged')
      assert.strictEqual(recent.success, false)
      assert.strictEqual(recent.attemptHashPrefix, secretHashPrefix)
      assert.strictEqual(recent.attemptHashPrefix.length, 8)

      // Guarantee rawSecret is nowhere in the audit log JSON serialization
      const serializedLogs = JSON.stringify(logs)
      assert.strictEqual(
        serializedLogs.includes(rawSecret),
        false,
        'Audit trail must NEVER persist cleartext candidate passkeys'
      )
    })

    it('filters audit logs accurately by status, course, and search query', () => {
      passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', 'target-client-alpha')
      passkeyStore.verifyPasskeyWithStore('word', 'wrong-passkey', 'target-client-beta')

      // Filter by status = success
      const successOnly = passkeyStore.getPasskeyAuditLogs({ status: 'success' })
      assert.ok(successOnly.length > 0)
      for (const log of successOnly) {
        assert.strictEqual(log.success, true)
      }

      // Filter by status = failed
      const failedOnly = passkeyStore.getPasskeyAuditLogs({ status: 'failed' })
      assert.ok(failedOnly.length > 0)
      for (const log of failedOnly) {
        assert.strictEqual(log.success, false)
      }

      // Filter by course
      const aiOnly = passkeyStore.getPasskeyAuditLogs({ courseId: 'ai' })
      for (const log of aiOnly) {
        assert.strictEqual(log.courseId, 'ai')
      }

      // Search query
      const searched = passkeyStore.getPasskeyAuditLogs({ search: 'alpha' })
      assert.strictEqual(searched.length, 1)
      assert.strictEqual(searched[0].clientId, 'target-client-alpha')
    })
  })

  // =========================================================================
  // Suite 4: Sliding-Window Rate Limiting Guard (ADMIN-PASS-03, T-32-03)
  // =========================================================================
  describe('Suite 4: Sliding-Window Rate Limiting Guard (ADMIN-PASS-03, T-32-03)', () => {
    it('throttles client upon 5 consecutive failed attempts within 5 minutes', () => {
      const attackerId = 'test-attacker-client'

      // First 4 failed attempts should fail normally without rate limiting
      for (let i = 1; i <= 4; i++) {
        const res = passkeyStore.verifyPasskeyWithStore('word', `bad-pass-${i}`, attackerId)
        assert.strictEqual(res.success, false)
        assert.strictEqual(Boolean(res.rateLimited), false, `Attempt ${i} should not be rate limited`)
      }

      // 5th failed attempt reaches the threshold and triggers cooldown
      const fifthAttempt = passkeyStore.verifyPasskeyWithStore('word', 'bad-pass-5', attackerId)
      assert.strictEqual(fifthAttempt.success, false)
      assert.strictEqual(fifthAttempt.rateLimited, true, '5th failure should trigger rate limiting')
      assert.ok(fifthAttempt.cooldownRemainingMs > 0)

      // 6th attempt is blocked before hash check
      const sixthAttempt = passkeyStore.verifyPasskeyWithStore('word', 'buka-kata', attackerId)
      assert.strictEqual(sixthAttempt.success, false)
      assert.strictEqual(sixthAttempt.rateLimited, true, '6th attempt must be throttled')
      assert.ok(sixthAttempt.cooldownRemainingMs > 0)
    })

    it('ensures rate limiting is isolated per client and does not block legit clients', () => {
      const attackerId = 'isolated-attacker'
      const legitId = 'isolated-legit-user'

      // Exhaust attempts for attacker
      for (let i = 1; i <= 5; i++) {
        passkeyStore.verifyPasskeyWithStore('ai', `bad-${i}`, attackerId)
      }

      // Attacker is locked out
      const attackerCheck = passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', attackerId)
      assert.strictEqual(attackerCheck.rateLimited, true)

      // Legit user can still authenticate successfully with correct passkey
      const legitCheck = passkeyStore.verifyPasskeyWithStore('ai', 'buka-kelas', legitId)
      assert.strictEqual(legitCheck.success, true)
      assert.strictEqual(Boolean(legitCheck.rateLimited), false)
    })

    it('resets failure window upon successful unlock before reaching 5 failures', () => {
      const clientId = 'client-recovers'

      // 3 failed attempts
      for (let i = 1; i <= 3; i++) {
        passkeyStore.verifyPasskeyWithStore('word', `bad-${i}`, clientId)
      }

      // Successful unlock clears failure history
      const success = passkeyStore.verifyPasskeyWithStore('word', 'buka-kata', clientId)
      assert.strictEqual(success.success, true)

      // Next 3 failed attempts should start fresh counter from 1 (not trip limit)
      for (let i = 1; i <= 3; i++) {
        const res = passkeyStore.verifyPasskeyWithStore('word', `bad-again-${i}`, clientId)
        assert.strictEqual(res.success, false)
        assert.strictEqual(Boolean(res.rateLimited), false)
      }
    })
  })

  // =========================================================================
  // Suite 5: Admin Session Protection & Elevation of Privilege Gate (T-32-02)
  // =========================================================================
  describe('Suite 5: Admin Session Protection & Elevation of Privilege Gate (T-32-02)', () => {
    it('rejects unauthenticated requests to passkey admin authorization', () => {
      // Explicit invalid tokens
      assert.throws(() => {
        passkeyServer.assertAdminAuthorized('invalid-token')
      }, /UNAUTHORIZED/)

      assert.throws(() => {
        passkeyServer.assertAdminAuthorized(null)
      }, /UNAUTHORIZED/)

      assert.throws(() => {
        passkeyServer.assertAdminAuthorized('')
      }, /UNAUTHORIZED/)
    })

    it('authenticates valid Master Admin session token and authorizes administrative execution', () => {
      // Create valid session
      const session = sessionModule.createAdminSession('passkey')
      assert.ok(session.token)

      // Authorizes successfully
      const user = passkeyServer.assertAdminAuthorized(session.token)
      assert.ok(user)
      assert.strictEqual(user.role, 'admin')

      // Rotation executed via authenticated admin session
      const rotateResult = passkeyStore.rotatePasskey(
        {
          courseId: 'ai',
          newPasskey: 'admin-authorized-key',
          reason: 'Test Auth Verification',
        },
        user.role
      )
      assert.strictEqual(rotateResult.success, true)
      assert.strictEqual(rotateResult.version, 2)
    })
  })
})
