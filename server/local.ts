/**
 * Yêu cầu có đến từ chính máy này không.
 * - Chạy trực tiếp: chỉ nhận loopback (127.0.0.1, ::1).
 * - Chạy trong Docker (TOEIC_DOCKER=1): cổng được publish chỉ ở 127.0.0.1 của máy chủ, nên kết nối đi qua mạng ảo
 *   của Docker (địa chỉ riêng 10.x, 172.16–31.x, 192.168.x) cũng được coi là cục bộ.
 */
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])
const PRIVATE = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/

export function isLocalAddress(addr: string | undefined): boolean {
  if (!addr) return false
  if (LOOPBACK.has(addr)) return true
  if (process.env.TOEIC_DOCKER !== '1') return false
  return PRIVATE.test(addr.replace(/^::ffff:/, ''))
}
