/**
 * Automated Unit, Integration & Regression Test Suite for Phase 33:
 * Global Platform Configuration, Announcement Banner & E2E Zero-Regression
 * Requirements: ADMIN-CFG-01, ADMIN-CFG-02, ADMIN-QA-01, ADMIN-QA-02, T-33-01..T-33-05
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

describe('Phase 33: Global Platform Configuration & Announcement Banner Suite', () => {
  let platformStore
  let platformServer
  let platformSchemas
  let sessionModule
  let configModule

  before(async () => {
    platformStore = await import('../app/server/platformStore.ts')
    platformServer = await import('../app/server/platform.ts')
    platformSchemas = await import('../app/schemas/platformConfig.ts')
    sessionModule = await import('../app/server/session.ts')
    configModule = await import('../app/server/config.ts')
  })

  beforeEach(() => {
    platformStore.clearPlatformStoreForTesting()
    sessionModule.clearAllSessionsForTesting()
  })

  // =========================================================================
  // Suite 1: Platform Configuration Store & Defaults (ADMIN-CFG-01)
  // =========================================================================
  describe('Suite 1: Platform Configuration Store & Defaults (ADMIN-CFG-01)', () => {
    it('initializes with default mode pretraining and disabled banner', () => {
      const config = platformStore.getPublicPlatformConfig()
      assert.strictEqual(config.workshopMode, 'pretraining')
      assert.strictEqual(config.banner.enabled, false)
      assert.strictEqual(config.banner.type, 'info')
      assert.strictEqual(config.banner.id, 'banner_init_v1')
      assert.ok(config.serverTimestamp > 0)
    })

    it('clearPlatformStoreForTesting deterministically restores default state', () => {
      platformStore.updateWorkshopMode('live-class', 'admin-tester', 'testing reset')
      assert.strictEqual(platformStore.getPublicPlatformConfig().workshopMode, 'live-class')

      platformStore.clearPlatformStoreForTesting()
      const restored = platformStore.getPublicPlatformConfig()
      assert.strictEqual(restored.workshopMode, 'pretraining')
      assert.strictEqual(restored.banner.enabled, false)
    })

    it('increments monotonic version counter upon state mutations', () => {
      const v1 = platformStore.getAdminPlatformConfig().version
      platformStore.updateWorkshopMode('live-class', 'admin-user-1')
      const v2 = platformStore.getAdminPlatformConfig().version
      assert.strictEqual(v2, v1 + 1)

      platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Versi kedua',
        type: 'warning',
      }, 'admin-user-1')
      const v3 = platformStore.getAdminPlatformConfig().version
      assert.strictEqual(v3, v2 + 1)
    })
  })

  // =========================================================================
  // Suite 2: Workshop Mode Toggle Engine (ADMIN-CFG-01)
  // =========================================================================
  describe('Suite 2: Workshop Mode Toggle Engine (ADMIN-CFG-01)', () => {
    it('toggles mode to live-class and tracks audit metadata', () => {
      const res = platformStore.updateWorkshopMode('live-class', 'admin-bpsdm', 'Hari-H Workshop')
      assert.strictEqual(res.success, true)
      assert.strictEqual(res.mode, 'live-class')

      const adminConfig = platformStore.getAdminPlatformConfig()
      assert.strictEqual(adminConfig.workshopMode, 'live-class')
      assert.ok(adminConfig.lastModeChange)
      assert.strictEqual(adminConfig.lastModeChange.mode, 'live-class')
      assert.strictEqual(adminConfig.lastModeChange.changedBy, 'admin-bpsdm')
      assert.strictEqual(adminConfig.lastModeChange.reason, 'Hari-H Workshop')
    })

    it('toggles mode back to pretraining cleanly', () => {
      platformStore.updateWorkshopMode('live-class', 'admin-bpsdm')
      assert.strictEqual(platformStore.getPublicPlatformConfig().workshopMode, 'live-class')

      const res = platformStore.updateWorkshopMode('pretraining', 'admin-bpsdm', 'Workshop selesai')
      assert.strictEqual(res.success, true)
      assert.strictEqual(res.mode, 'pretraining')
      assert.strictEqual(platformStore.getPublicPlatformConfig().workshopMode, 'pretraining')
    })

    it('rejects invalid workshop mode via schema validation', () => {
      const invalidParse = platformSchemas.updateWorkshopModeInputSchema.safeParse({
        mode: 'invalid-workshop-mode',
      })
      assert.strictEqual(invalidParse.success, false)
    })
  })

  // =========================================================================
  // Suite 3: Global Announcement Banner Lifecycle & Dismissal (ADMIN-CFG-02)
  // =========================================================================
  describe('Suite 3: Global Announcement Banner Lifecycle & Dismissal (ADMIN-CFG-02)', () => {
    it('broadcasts an announcement banner and generates a unique banner id', () => {
      const result = platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Sesi Live Class dipindahkan ke Ruang Pleno B',
        type: 'alert',
        linkText: 'Buka Google Meet',
        linkUrl: 'https://meet.google.com/abc-defg-hij',
      }, 'admin-instructor')

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.banner.enabled, true)
      assert.strictEqual(result.banner.type, 'alert')
      assert.strictEqual(result.banner.message, 'Sesi Live Class dipindahkan ke Ruang Pleno B')
      assert.strictEqual(result.banner.linkUrl, 'https://meet.google.com/abc-defg-hij')
      assert.ok(result.banner.id.startsWith('banner_'))
      assert.notStrictEqual(result.banner.id, 'banner_init_v1')

      const pub = platformStore.getPublicPlatformConfig()
      assert.strictEqual(pub.banner.enabled, true)
      assert.strictEqual(pub.banner.id, result.banner.id)
    })

    it('simulates client dismissal and auto-reappearance on banner update', () => {
      // 1. Admin publishes banner A
      const resA = platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Pengumuman A: Sesi Pagi',
        type: 'info',
      }, 'admin-1')
      const bannerAId = resA.banner.id

      // 2. Client simulates dismissing banner A
      let clientDismissedId = bannerAId
      let shouldClientRender = (banner) => banner.enabled && banner.id !== clientDismissedId

      assert.strictEqual(shouldClientRender(platformStore.getPublicPlatformConfig().banner), false)

      // 3. Admin updates banner to announcement B
      const resB = platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Pengumuman B: Update Penting!',
        type: 'warning',
      }, 'admin-1')
      const bannerBId = resB.banner.id

      assert.notStrictEqual(bannerBId, bannerAId)
      // Client now automatically detects ID mismatch and shows the new banner
      assert.strictEqual(shouldClientRender(platformStore.getPublicPlatformConfig().banner), true)
    })

    it('deactivates banner cleanly when enabled is false', () => {
      platformStore.updateAnnouncementBanner({
        enabled: true,
        message: 'Aktif sementara',
        type: 'info',
      }, 'admin-1')
      assert.strictEqual(platformStore.getPublicPlatformConfig().banner.enabled, true)

      const deactivated = platformStore.updateAnnouncementBanner({
        enabled: false,
      }, 'admin-1')
      assert.strictEqual(deactivated.banner.enabled, false)
      assert.strictEqual(platformStore.getPublicPlatformConfig().banner.enabled, false)
    })

    it('rejects empty message or message exceeding 280 characters', () => {
      const emptyMsg = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: '',
        type: 'info',
      })
      assert.strictEqual(emptyMsg.success, false)

      const longMsg = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: 'a'.repeat(281),
        type: 'info',
      })
      assert.strictEqual(longMsg.success, false)

      const validMsg = platformSchemas.updateAnnouncementBannerInputSchema.safeParse({
        enabled: true,
        message: 'a'.repeat(280),
        type: 'info',
      })
      assert.strictEqual(validMsg.success, true)
    })
  })

  // =========================================================================
  // Suite 4: Public Config vs Admin Config Secret Isolation (ADMIN-QA-01, ADMIN-QA-02, T-33-02, T-33-05)
  // =========================================================================
  describe('Suite 4: Public Config vs Admin Config Secret Isolation (T-33-02, T-33-05)', () => {
    it('ensures getPublicPlatformConfig strictly returns only public fields', () => {
      const pub = platformStore.getPublicPlatformConfig()
      const rootKeys = Object.keys(pub).sort()
      assert.deepStrictEqual(rootKeys, ['banner', 'serverTimestamp', 'workshopMode'])

      const bannerKeys = Object.keys(pub.banner)
      assert.strictEqual(bannerKeys.includes('updatedBy'), false)
      assert.strictEqual(bannerKeys.includes('createdAt'), false)
      assert.strictEqual(bannerKeys.includes('adminPasskeyHash'), false)
      assert.strictEqual(bannerKeys.includes('aiPasskeyHash'), false)
      assert.strictEqual(bannerKeys.includes('wordPasskeyHash'), false)
      assert.strictEqual(bannerKeys.includes('googleClientSecret'), false)
      assert.strictEqual(bannerKeys.includes('sessionToken'), false)
    })

    it('ensures getAdminPlatformConfig provides diagnostics without leaking raw secrets', () => {
      const admin = platformStore.getAdminPlatformConfig()
      assert.ok(admin.authReadiness)
      assert.strictEqual(typeof admin.authReadiness.adminPasskeyConfigured, 'boolean')
      assert.strictEqual(typeof admin.authReadiness.googleOAuthReady, 'boolean')

      const serialized = JSON.stringify(admin)
      assert.strictEqual(serialized.includes('googleClientSecret'), false)
      assert.strictEqual(serialized.includes('passkeyHash'), false)
    })
  })

  // =========================================================================
  // Suite 5: Admin Session Authorization Enforcement (ADMIN-QA-01)
  // =========================================================================
  describe('Suite 5: Admin Session Authorization Enforcement (ADMIN-QA-01)', () => {
    it('rejects unauthorized mutations with UNAUTHORIZED error', () => {
      assert.throws(
        () => platformServer.assertAdminAuthorized(undefined),
        /UNAUTHORIZED/
      )
      assert.throws(
        () => platformServer.assertAdminAuthorized('fake-token-123'),
        /UNAUTHORIZED/
      )
    })

    it('authorizes requests with a valid Master Admin session token', () => {
      const session = sessionModule.createAdminSession('passkey')
      const user = platformServer.assertAdminAuthorized(session.token)
      assert.strictEqual(user.role, 'admin')
      assert.strictEqual(user.authMethod, 'passkey')
    })
  })

  // =========================================================================
  // Suite 6: Public Routes & Participant Pages Layout Integrity (ADMIN-QA-02)
  // =========================================================================
  describe('Suite 6: Public Routes & Participant Pages Layout Integrity (ADMIN-QA-02)', () => {
    it('verifies __root.tsx mounts GlobalAnnouncementBanner before .app-container', () => {
      const rootPath = path.join(__dirname, '../app/routes/__root.tsx')
      const content = fs.readFileSync(rootPath, 'utf8')

      assert.ok(content.includes('GlobalAnnouncementBanner'), '__root.tsx must import GlobalAnnouncementBanner')
      assert.ok(content.includes('<GlobalAnnouncementBanner />'), '__root.tsx must mount <GlobalAnnouncementBanner />')
      
      const bannerIndex = content.indexOf('<GlobalAnnouncementBanner />')
      const appContainerIndex = content.indexOf('app-container')
      assert.ok(bannerIndex < appContainerIndex, 'GlobalAnnouncementBanner must precede app-container to preserve 2-row CSS grid')
    })

    it('verifies components.css provides complete announcement banner styles', () => {
      const cssPath = path.join(__dirname, '../assets/css/components.css')
      const css = fs.readFileSync(cssPath, 'utf8')

      assert.ok(css.includes('.global-announcement-banner'), 'components.css must define .global-announcement-banner')
      assert.ok(css.includes('.announcement-info'), 'components.css must define .announcement-info')
      assert.ok(css.includes('.announcement-warning'), 'components.css must define .announcement-warning')
      assert.ok(css.includes('.announcement-alert'), 'components.css must define .announcement-alert')
      assert.ok(css.includes('.banner-close-btn'), 'components.css must define .banner-close-btn')
    })
  })
})
