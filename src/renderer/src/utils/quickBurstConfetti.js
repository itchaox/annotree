/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-07-16 01:02
 * @LastAuthor : itchaox
 * @LastTime   : 2024-07-16 01:05
 * @desc       :
 */
import confetti from 'canvas-confetti'

// 彩带
export function quickBurstConfetti() {
  console.log(222)

  // 左侧
  confetti({
    particleCount: 300,
    angle: 60,
    spread: 40,
    origin: { x: 0, y: 0.85 },
    startVelocity: 70,
    gravity: 0.8,
    scalar: 1.2,
    drift: 0.5
  })

  // 右侧
  confetti({
    particleCount: 300,
    angle: 120,
    spread: 40,
    origin: { x: 1, y: 0.85 },
    startVelocity: 70,
    gravity: 0.8,
    scalar: 1.2,
    drift: -0.5
  })
}
