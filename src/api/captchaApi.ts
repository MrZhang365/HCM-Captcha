import type { CaptchaQuestion, CaptchaChallenge } from '../types/captcha'

let currentAnswer: number[] = []

function generateRandomAnswer(): number[] {
  const count = Math.floor(Math.random() * 3) + 2
  const indices: number[] = []
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    const removed = pool.splice(idx, 1)[0]
    if (removed !== undefined) {
      indices.push(removed)
    }
  }
  return indices.sort((a, b) => a - b)
}

function generateImageUrl(): string {
  const seed = Date.now() + Math.floor(Math.random() * 1000)
  return `https://picsum.photos/seed/${seed}/300/300`
}

export function setAnswer(answer: number[]): void {
  currentAnswer = [...answer]
}

export function getAnswer(): number[] {
  return [...currentAnswer]
}

export async function loadImage(): Promise<string> {
  await simulateNetworkDelay(300, 600)
  return generateImageUrl()
}

function simulateNetworkDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}