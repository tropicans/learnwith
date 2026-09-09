import crypto from 'node:crypto'

// Default hashes matching legacy test fixtures for backward compatibility
// SHA-256 of 'buka-kelas': b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f
// Also recognizing 4452077e60e86b8ee876b509f61b09b52a9261a9953c8965a3c03565e33d26aa if set in env
const DEFAULT_AI_PASSKEY_HASH = 'b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f'
// SHA-256 of 'buka-kata': ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b
const DEFAULT_WORD_PASSKEY_HASH = 'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b'
// SHA-256 of 'admin-learnwith': 5e5dc93b4232b40fc465e93816ffed9075952c54d9c7536cded05ec4bb255fe3
const DEFAULT_ADMIN_PASSKEY_HASH = '5e5dc93b4232b40fc465e93816ffed9075952c54d9c7536cded05ec4bb255fe3'

export function getServerConfig() {
  return {
    aiPasskeyHash: process.env.AI_PASSKEY_HASH || DEFAULT_AI_PASSKEY_HASH,
    wordPasskeyHash: process.env.WORD_PASSKEY_HASH || DEFAULT_WORD_PASSKEY_HASH,
    adminPasskeyHash: process.env.ADMIN_PASSKEY_HASH || DEFAULT_ADMIN_PASSKEY_HASH,
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    nodeEnv: process.env.NODE_ENV || 'development',
  }
}

export function verifyAdminPasskey(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') {
    return false
  }

  const config = getServerConfig()
  const targetHash = config.adminPasskeyHash
  const candidateHash = crypto
    .createHash('sha256')
    .update(candidate.trim())
    .digest('hex')

  const targetBuf = Buffer.from(targetHash, 'hex')
  const candidateBuf = Buffer.from(candidateHash, 'hex')

  if (targetBuf.length !== candidateBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(targetBuf, candidateBuf)
}

export function verifyPasskeyWithHash(courseId: 'ai' | 'word', candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') {
    return false
  }

  const config = getServerConfig()
  const targetHash = courseId === 'ai' ? config.aiPasskeyHash : config.wordPasskeyHash
  const candidateHash = crypto
    .createHash('sha256')
    .update(candidate.trim().toLowerCase())
    .digest('hex')

  const targetBuf = Buffer.from(targetHash, 'hex')
  const candidateBuf = Buffer.from(candidateHash, 'hex')

  if (targetBuf.length !== candidateBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(targetBuf, candidateBuf)
}
