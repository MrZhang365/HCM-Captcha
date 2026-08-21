<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CaptchaQuestion } from '../types/captcha'

const props = defineProps<{
  visible: boolean
  question: string | null
  imageUrl: string
  answer: number[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', result: boolean): void
  (e: 'refresh'): void
  (e: 'debug', result: number[]): void
}>()

const selectedCells = ref<Set<number>>(new Set())
const verifying = ref(false)
const verifyResult = ref<'idle' | 'success' | 'failure'>('idle')

const gridCells = computed(() => {
  return Array.from({ length: 9 }, (_, i) => i)
})

function toggleCell(index: number) {
  if (verifying.value || verifyResult.value !== 'idle') return
  const newSet = new Set(selectedCells.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  selectedCells.value = newSet
}

function getCellBackgroundStyle(index: number) {
  const row = Math.floor(index / 3)
  const col = index % 3
  const size = 100
  return {
    backgroundImage: `url(${props.imageUrl})`,
    backgroundSize: `${size * 3}px ${size * 3}px`,
    backgroundPosition: `-${col * size}px -${row * size}px`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

async function handleVerify() {
  if (selectedCells.value.size === 0) return
  verifying.value = true

  await new Promise((resolve) => setTimeout(resolve, 600))

  const selectedSorted = [...selectedCells.value].sort((a, b) => a - b)
  const answerSorted = [...props.answer].sort((a, b) => a - b)

  if (import.meta.env.VITE_DEBUG_MODE) {
    emit('debug', selectedSorted)
    resetState()
    verifying.value = false
    return
  }

  const isCorrect =
    selectedSorted.length === answerSorted.length &&
    selectedSorted.every((val, idx) => val === answerSorted[idx])

  if (isCorrect) {
    verifyResult.value = 'success'
    await new Promise((resolve) => setTimeout(resolve, 800))
    emit('submit', true)
    resetState()
  } else {
    verifyResult.value = 'failure'
    await new Promise((resolve) => setTimeout(resolve, 1200))
    verifyResult.value = 'idle'
    selectedCells.value = new Set()
  }
  verifying.value = false
}

function handleRefresh() {
  resetState()
  emit('refresh')
}

function handleClose() {
  resetState()
  emit('close')
}

function resetState() {
  selectedCells.value = new Set()
  verifying.value = false
  verifyResult.value = 'idle'
}

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      resetState()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="captcha-fade">
      <div v-if="visible" class="captcha-overlay" @click.self="handleClose">
        <div class="captcha-dialog">
          <div class="captcha-dialog-header">
            <span class="captcha-dialog-title">请验证您是火车迷</span>
            <button class="captcha-dialog-close" @click="handleClose" :disabled="verifying">
              ✕
            </button>
          </div>

          <div v-if="loading" class="captcha-dialog-loading">
            <div class="captcha-spinner"></div>
            <span>正在加载好货...</span>
          </div>

          <template v-else>
            <div class="captcha-question">
              <span v-html="question || ''"></span>
            </div>

            <div class="captcha-grid-wrapper">
              <div class="captcha-grid">
                <div
                  v-for="index in gridCells"
                  :key="index"
                  class="captcha-grid-cell"
                  :class="{
                    'captcha-grid-cell--selected': selectedCells.has(index),
                    'captcha-grid-cell--success': verifyResult === 'success' && selectedCells.has(index),
                    'captcha-grid-cell--failure': verifyResult === 'failure' && selectedCells.has(index),
                  }"
                  :style="getCellBackgroundStyle(index)"
                  @click="toggleCell(index)"
                >
                  <div class="captcha-grid-cell-overlay">
                    <span v-if="selectedCells.has(index)" class="captcha-grid-cell-check">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="captcha-dialog-footer">
              <button class="captcha-btn captcha-btn-refresh" @click="handleRefresh" :disabled="verifying">
                <span class="captcha-refresh-icon">↻</span>
                换一张
              </button>
              <button
                class="captcha-btn captcha-btn-verify"
                :class="{
                  'captcha-btn--success': verifyResult === 'success',
                  'captcha-btn--failure': verifyResult === 'failure',
                }"
                @click="handleVerify"
                :disabled="verifying || selectedCells.size === 0"
              >
                <template v-if="verifying">
                  <span class="captcha-spinner captcha-spinner--small"></span>
                  验证中...
                </template>
                <template v-else-if="verifyResult === 'success'">
                  ✓ 验证通过
                </template>
                <template v-else-if="verifyResult === 'failure'">
                  ✕ 请重试
                </template>
                <template v-else>
                  验证
                </template>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.captcha-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.captcha-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  width: 400px;
  max-width: 95vw;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.captcha-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.captcha-dialog-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.captcha-dialog-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  transition: all 0.15s;
}

.captcha-dialog-close:hover {
  background: #f0f0f0;
  color: #333;
}

.captcha-dialog-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: #666;
  font-size: 14px;
}

.captcha-question {
  padding: 16px 20px 12px;
  font-size: 14px;
  color: #444;
  line-height: 1.5;
}

.captcha-question :deep(b) {
  color: #1a73e8;
}

.captcha-grid-wrapper {
  padding: 0 20px 4px;
}

.captcha-grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 3px;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
}

.captcha-grid-cell {
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.15s, transform 0.1s;
  background-repeat: no-repeat;
}

.captcha-grid-cell:hover {
  border-color: #1a73e8;
  transform: scale(1.03);
  z-index: 1;
}

.captcha-grid-cell--selected {
  border-color: #1a73e8;
}

.captcha-grid-cell--success {
  border-color: #34a853;
}

.captcha-grid-cell--failure {
  border-color: #ea4335;
  animation: shake 0.4s ease-in-out;
}

.captcha-grid-cell-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 115, 232, 0.25);
  opacity: 0;
  transition: opacity 0.15s;
  border-radius: 2px;
}

.captcha-grid-cell--selected .captcha-grid-cell-overlay {
  opacity: 1;
}

.captcha-grid-cell--success .captcha-grid-cell-overlay {
  background: rgba(52, 168, 83, 0.3);
}

.captcha-grid-cell--failure .captcha-grid-cell-overlay {
  background: rgba(234, 67, 53, 0.3);
  opacity: 1;
}

.captcha-grid-cell-check {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.captcha-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 16px;
  gap: 10px;
}

.captcha-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 100px;
}

.captcha-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.captcha-btn-refresh {
  background: #f5f5f5;
  color: #555;
}

.captcha-btn-refresh:hover:not(:disabled) {
  background: #e8e8e8;
}

.captcha-btn-verify {
  background: #1a73e8;
  color: #fff;
  flex: 1;
}

.captcha-btn-verify:hover:not(:disabled) {
  background: #1557b0;
}

.captcha-btn--success {
  background: #34a853;
}

.captcha-btn--failure {
  background: #ea4335;
}

.captcha-refresh-icon {
  font-size: 16px;
}

.captcha-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e0e0e0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: captcha-spin 0.8s linear infinite;
}

.captcha-spinner--small {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-top-color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

@keyframes captcha-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.captcha-fade-enter-active,
.captcha-fade-leave-active {
  transition: opacity 0.2s ease;
}

.captcha-fade-enter-active .captcha-dialog,
.captcha-fade-leave-active .captcha-dialog {
  transition: transform 0.2s ease;
}

.captcha-fade-enter-from,
.captcha-fade-leave-to {
  opacity: 0;
}

.captcha-fade-enter-from .captcha-dialog {
  transform: scale(0.92);
}

.captcha-fade-leave-to .captcha-dialog {
  transform: scale(0.92);
}
</style>