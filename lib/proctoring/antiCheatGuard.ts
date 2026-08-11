/**
 * Anti-Cheat & Proctoring Guard Engine for EchoYou
 * 
 * Rules Enforced:
 * 1. Mandatory Video + Audio mode (No audio-only allowed).
 * 2. Multi-Face Detection (Warn on 2+ faces; Terminate if persistent).
 * 3. Abusive / Irrelevant Language Detector (Warn on abuse/gibberish; Terminate on repeat).
 */

export interface AntiCheatState {
  warningsCount: number
  isTerminated: boolean
  terminationReason: string | null
  activeWarningMessage: string | null
}

const ABUSIVE_PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'crap', 'dick', 'pussy', 'slut', 'whore',
  'poda', 'loosu', 'thayoli', 'pundai', 'othane', 'kamnati', 'naaye'
]

export function checkAbusiveOrIrrelevantContent(userText: string): { isAbusive: boolean; isIrrelevant: boolean; reason?: string } {
  if (!userText || userText.trim().length < 2) return { isAbusive: false, isIrrelevant: false }

  const lower = userText.toLowerCase().trim()

  // 1. Check profanity / abuse
  for (const word of ABUSIVE_PROFANITY_LIST) {
    if (lower.includes(word)) {
      return { isAbusive: true, isIrrelevant: false, reason: 'Abusive language detected' }
    }
  }

  // 2. Check random keyboard mash / gibberish (e.g. "asdfghjkl", "qwertyuiop", "123456789")
  const gibberishRegex = /(asdf|qwerty|zxcv|123456|abcdef)/i
  if (gibberishRegex.test(lower)) {
    return { isAbusive: false, isIrrelevant: true, reason: 'Keyboard mash / irrelevant gibberish' }
  }

  return { isAbusive: false, isIrrelevant: false }
}

/**
 * Basic canvas face boundary density scanner
 * Analyzes video element frame to estimate human face bounding regions
 */
export function analyzeVideoFaceCount(videoElement: HTMLVideoElement): number {
  try {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) return 0

    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 120
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return 1

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data

    let skinPixelCount = 0
    let leftSkinPixels = 0
    let rightSkinPixels = 0

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // YCbCr / RGB skin tone detection heuristic
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && (r - Math.min(g, b)) > 15) {
        skinPixelCount++
        const pixelIndex = i / 4
        const x = pixelIndex % canvas.width
        if (x < canvas.width / 2) {
          leftSkinPixels++
        } else {
          rightSkinPixels++
        }
      }
    }

    const totalPixels = canvas.width * canvas.height
    const skinRatio = skinPixelCount / totalPixels

    if (skinRatio < 0.05) return 0 // No face detected

    // If two distinct heavy skin clusters exist on opposite sides of camera frame -> 2 faces
    const leftRatio = leftSkinPixels / (totalPixels / 2)
    const rightRatio = rightSkinPixels / (totalPixels / 2)

    if (leftRatio > 0.25 && rightRatio > 0.25 && Math.abs(leftRatio - rightRatio) < 0.15) {
      return 2 // 2 faces detected side-by-side
    }

    return 1 // Exactly 1 face
  } catch (e) {
    return 1
  }
}
