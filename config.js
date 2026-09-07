/**
 * learnwith Platform Configuration
 * Centralized settings for security, course gating, and instructor access.
 */
(function() {
  'use strict';

  window.LEARNWITH_CONFIG = {
    version: '2.2.0',
    security: {
      wordCourseLocked: true,
      // Automatic session timeout in minutes (inactivity auto-lock)
      sessionTimeoutMinutes: 15,
      // One-way SHA-256 hashes of authorized instructor passcodes.
      // Passcodes are NEVER stored in plaintext in the codebase.
      allowedPasscodeHashes: [
        'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b', // buka-kata
        '487da33ab431e57b68afa84059c0e7a95818f99cd9581054026f224fc7bba174'  // kata-sandi-asn
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.LEARNWITH_CONFIG;
  }
})();
