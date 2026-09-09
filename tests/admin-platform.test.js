/**
 * Automated Unit & Integration Tests for Phase 33:
 * Global Platform Configuration Store, Announcement Banner & Admin Settings
 * Requirements: ADMIN-CFG-01, ADMIN-CFG-02, T-33-01, T-33-02, T-33-05
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')

describe('Phase 33 Platform Configuration & Announcement Banner Suite', () => {
  let platformStore
  let platformServer
  let platformSchemas
  let sessionModule

  before(async () => {
    platformStore = await import('../app/server/platformStore.ts')
    platformServer = await import('../app/server/platform.ts')
    platformSchemas = await import('../app/schemas/platformConfig.ts')
    sessionModule = await import('../app/server/session.ts')
  })

  beforeEach(() => {
    platformStore.clearPlatformStoreForTesting()
    sessionModule.clearAllSessionsForTesting()
  })

  // =========================================================================
  // Suite 1: In-Memory Platform Configuration Store & Defaults (ADMIN-CFG-01)
  // =========================================================================
  describe('Suite 1: In-Memory Platform Configuration Store & Defaults (ADMIN-CFG-01)', () => {
    it('initializes with default mode pretraining and disabled banner', () => {
      const config = platformStore.getPublicPlatformConfig()
      assert.strictEqual(config.workshopMode, 'pretraining')
      assert.strictEqual(config.banner.enabled, false)
      assert.strictEqual(config.banner.id, 'banner_init_v1')
      assert.ok(config.serverTimestamp > 0)
    })

    it('updates workshop mode dynamically and tracks audit metadata', () => {
      const result = platformStore.updateWorkshopMode('live-class', 'admin-user-1', 'BPSDM Hari-H Batch 1')
      assert.strictEqual(result.success, true)
      assert.strictEqual(result.mode, 'live-class')
      assert.strictEqual(result.version, 2)

      const adminConfig = platformStore.getAdminPlatformConfig()
      assert.strictEqual(adminConfig.workshopMode, 'live-class')
      assert.strictEqual(adminConfig.version, 2)
      assert.ok(adminConfig.lastModeChange)
      assert.strictEqual(adminConfig.lastModeChange.mode, 'live-class')
      assert.strictEqual(adminConfig.lastModeChange.changedBy, 'admin-user-1')
      assert.strictEqual(adminConfig.lastModeChange.reason, 'BPSDM Hari-H Batch 1')
    })
  })

  // =========================================================================
  // Suite 2: Announcement Banner Rotation & Validation (ADMIN-CFG-02)
  // =========================================================================
  describe('Suite 2: Announcement Banner Rotation & Validation (ADMIN-CFG-02)', () => {
    it('updates announcement banner and generates a unique banner id', async () => {
      const result = platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Perhatian: Checkpoint 2 dimulai!',
        type: 'warning',
        linkText: 'Lihat Panduan',
        linkUrl: '/course/ai#checkpoint-2',
      }, 'admin-instructor')

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.banner.enabled, true)
      assert.strictEqual(result.banner.message, 'Perhatian: Checkpoint 2 dimulai!')
      assert.strictEqual(result.banner.type, 'warning')
      assert.strictEqual(result.banner.linkText, 'Lihat Panduan')
      assert.strictEqual(result.banner.linkUrl, '/course/ai#checkpoint-2')
      assert.ok(result.banner.id.startsWith('banner_'))
      assert.notStrictEqual(result.banner.id, 'banner_init_v1')
      assert.strictEqual(result.version, 2)

      // Verify public projection
      const pub = platformStore.getPublicPlatformConfig()
      assert.strictEqual(pub.banner.enabled, true)
      assert.strictEqual(pub.banner.id, result.banner.id)
    })

    it('validates banner schema constraints via Zod', () => {
      // Valid banner input
      const valid = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: 'Pengumuman singkat',
        type: 'info',
      })
      assert.strictEqual(valid.success, true)

      // Empty message should fail
      const emptyMsg = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: '',
        type: 'info',
      })
      assert.strictEqual(emptyMsg.success, false)

      // Invalid urgency type should fail
      const invalidType = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: 'Halo',
        type: 'critical',
      })
      assert.strictEqual(invalidType.success, false)
    })
  })

  // =========================================================================
  // Suite 3: Strict Secret Quarantine & Boundary Isolation (T-33-02, T-33-05)
  // =========================================================================
  describe('Suite 3: Strict Secret Quarantine & Boundary Isolation (T-33-02, T-33-05)', () => {
    it('ensures getPublicPlatformConfig never exposes server secrets, tokens, or audit metadata', () => {
      const pub = platformStore.getPublicPlatformConfig()
      const keys = Object.keys(pub)
      assert.deepStrictEqual(keys.sort(), ['banner', 'serverTimestamp', 'workshopMode'].sort())

      const bannerKeys = Object.keys(pub.banner)
      assert.strictEqual(bannerKeys.includes('updatedBy'), false)
      assert.strictEqual(bannerKeys.includes('createdAt'), false)
      assert.strictEqual(bannerKeys.includes('passkeyHash'), false)
      assert.strictEqual(bannerKeys.includes('googleClientSecret'), false)
      assert.strictEqual(bannerKeys.includes('sessionToken'), false)
    })

    it('ensures admin projection includes diagnostics but isolates client secrets', () => {
      const admin = platformStore.getAdminPlatformConfig()
      assert.ok(admin.authReadiness)
      assert.strictEqual(typeof admin.authReadiness.adminPasskeyConfigured, 'boolean')
      assert.strictEqual(typeof admin.authReadiness.googleOAuthReady, 'boolean')
      assert.strictEqual(admin.authReadiness.sessionTtlHours, 24)

      // Ensure raw hashes are never placed on admin config projection
      const rawJson = JSON.stringify(admin)
      assert.strictEqual(rawJson.includes('googleClientSecret'), false)
    })
  })

  // =========================================================================
  // Suite 4: Admin RPC Session Authorization Gating
  // =========================================================================
  describe('Suite 4: Admin RPC Session Authorization Gating', () => {
    it('rejects unauthenticated requests to adminUpdateWorkshopMode', () => {
      assert.throws(
        () => {
          platformServer.assertAdminAuthorized('invalid-session-token')
        },
        /UNAUTHORIZED/
      )
    })

    it('allows access to admin functions with valid session token', () => {
      const session = sessionModule.createAdminSession('passkey')
      const user = platformServer.assertAdminAuthorized(session.token)
      assert.strictEqual(user.role, 'admin')
      assert.strictEqual(user.authMethod, 'passkey')
    })
  })
})
