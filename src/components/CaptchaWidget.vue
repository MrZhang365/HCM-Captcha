<script setup lang="ts">
import { ref } from 'vue'
import CaptchaDialog from './CaptchaDialog.vue'
import type { CaptchaQuestion } from '../types/captcha'

export interface ChallengeData {
  question: string
  imageUrl: string
  answer: number[]
}

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'submit', payload: { result: boolean }): void
  (e: 'refresh'): void
  (e: 'debug', result: number[]): void
}>()

const state = ref<'idle' | 'loading' | 'verified' | 'failed'>('idle')
const dialogVisible = ref(false)
const question = ref<string | null>(null)
const imageUrl = ref('')
const answer = ref<number[]>([])
const dialogLoading = ref(false)

function handleClick() {
  if (state.value === 'loading' || state.value === 'verified') return

  state.value = 'loading'
  emit('start')
}

function openChallenge(data: ChallengeData) {
  question.value = data.question
  answer.value = data.answer
  imageUrl.value = data.imageUrl
  dialogLoading.value = false
  state.value = 'loading'
  dialogVisible.value = true
}

function handleDialogClose() {
  dialogVisible.value = false
  if (state.value !== 'verified') {
    state.value = 'idle'
  }
}

function handleDialogSubmit(result: boolean) {
  dialogVisible.value = false
  if (result) {
    state.value = 'verified'
  } else {
    state.value = 'failed'
  }
  emit('submit', { result })
}

function handleDebug(result: number[]) {
  dialogVisible.value = false
  state.value = 'idle'
  emit('debug', result)
}

function handleRefresh() {
  dialogLoading.value = true
  emit('refresh')
}

defineExpose({ openChallenge })
</script>

<template>
  <div class="captcha-widget-wrapper">
    <div
      class="captcha-widget"
      :class="{
        'captcha-widget--loading': state === 'loading',
        'captcha-widget--verified': state === 'verified',
        'captcha-widget--failed': state === 'failed',
      }"
      @click="handleClick"
    >
      <div class="captcha-widget-checkbox">
        <template v-if="state === 'idle' || state === 'failed'">
          <div class="captcha-widget-checkbox-box"></div>
        </template>
        <template v-else-if="state === 'loading'">
          <div class="captcha-widget-spinner"></div>
        </template>
        <template v-else-if="state === 'verified'">
          <svg class="captcha-widget-check" viewBox="0 0 24 24" width="28" height="28">
            <path
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
              fill="#34a853"
            />
          </svg>
        </template>
      </div>
      <span class="captcha-widget-label">
        <template v-if="state === 'idle'">我是火车迷</template>
        <template v-else-if="state === 'loading'">验证中...</template>
        <template v-else-if="state === 'verified'">绿灯通过</template>
        <template v-else-if="state === 'failed'">验证失败，出去出去</template>
      </span>
    </div>

    <div class="captcha-widget-brand">
      <span>火车迷验证</span>
      <span class="captcha-widget-brand-icon">🛡️</span>
    </div>

    <CaptchaDialog
      :visible="dialogVisible"
      :question="question"
      :image-url="imageUrl"
      :answer="answer"
      :loading="dialogLoading"
      @close="handleDialogClose"
      @submit="handleDialogSubmit"
      @debug="handleDebug"
      @refresh="handleRefresh"
    />
  </div>
</template>

<style scoped>
.captcha-widget-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.captcha-widget {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9f9f9;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.captcha-widget:hover {
  border-color: #b3b3b3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.captcha-widget--loading {
  border-color: #1a73e8;
  background: #fff;
  cursor: default;
}

.captcha-widget--verified {
  border-color: #34a853;
  background: #f6fef6;
  cursor: default;
}

.captcha-widget--failed {
  border-color: #ea4335;
  background: #fff;
}

.captcha-widget-checkbox {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-widget-checkbox-box {
  width: 24px;
  height: 24px;
  border: 2px solid #c1c1c1;
  border-radius: 2px;
  background: #fff;
  transition: border-color 0.15s;
}

.captcha-widget:hover .captcha-widget-checkbox-box {
  border-color: #999;
}

.captcha-widget-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: widget-spin 0.8s linear infinite;
}

.captcha-widget-check {
  display: block;
}

.captcha-widget-label {
  font-size: 14px;
  color: #333;
  font-weight: 400;
  white-space: nowrap;
}

.captcha-widget--verified .captcha-widget-label {
  color: #34a853;
}

.captcha-widget--failed .captcha-widget-label {
  color: #ea4335;
}

.captcha-widget-brand {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #555;
  width: 100%;
  justify-content: flex-end;
}

.captcha-widget-brand-icon {
  font-size: 12px;
}

@keyframes widget-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>