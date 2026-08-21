<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CaptchaWidget from './components/CaptchaWidget.vue'
import { setAnswer, loadImage } from './api/captchaApi'
import type { CaptchaSubmitEvent } from './types/captcha'
import { QUESTIONS, MIN_IMG, MAX_IMG, getQuestion } from './api/questions'

const captchaRef = useTemplateRef<InstanceType<typeof CaptchaWidget>>('captchaRef')
const lastResult = ref<string | null>(null)
const markSelect = ref<string>('')
const imgId = ref<number>(0)
const debugMode = ref<boolean>(!!import.meta.env.VITE_DEBUG_MODE)

async function handleStart() {
  lastResult.value = null

  const selected = getQuestion()
  const imageUrl = `${location.protocol}//${location.host}/images/${selected.imgId}.jpg`
  captchaRef.value?.openChallenge({ question: selected.text, imageUrl, answer: selected.answer })
}

function handleDebug(result: number[]) {
  console.info(JSON.stringify({
    tag: markSelect.value,
    answer: result,
  }))

  if (imgId.value < MAX_IMG) {
    imgId.value++
  }
}

async function handleRefresh() {
  await handleStart()
}

function handleSubmit(payload: CaptchaSubmitEvent) {
  const status = payload.result ? '绿灯通过（LKJ语气）' : '你不是火车迷，出去出去（站务语气）'
  lastResult.value = status
}
</script>

<template>
  <div class="test-page">
    <h1 class="test-title">你是火车迷吗？</h1>
    <p class="test-desc">
      这是一个为火车迷打造的人机验证组件，你要来试试吗？
    </p>

    <div class="test-section">
      <h2 class="test-section-title">验证组件</h2>
      <div class="test-widget-area">
        <CaptchaWidget
          ref="captchaRef"
          @start="handleStart"
          @submit="handleSubmit"
          @refresh="handleRefresh"
          @debug="handleDebug"
        />
      </div>
    </div>

    <div class="test-section" v-if="debugMode">
      <h2 class="test-section-title">标定模式</h2>
      <select v-model="markSelect">
        <template v-for="question in QUESTIONS">
          <option :value="question.tag">{{ question.text }}</option>
        </template>
      </select>
      <br />
      <input v-model="imgId" type="range" :min="MIN_IMG" :max="MAX_IMG" />
      <span>{{ imgId }}</span>
    </div>

    <div class="test-section">
      <h2 class="test-section-title">验证结果</h2>
      <div v-if="lastResult" class="test-result" :class="{ 'test-result--success': lastResult.includes('通过'), 'test-result--failure': lastResult.includes('失败') }">
        {{ lastResult }}
      </div>
      <div v-else class="test-result test-result--empty">尚未进行验证</div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.test-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
}

.test-desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.test-section {
  margin-bottom: 28px;
}

.test-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.test-widget-area {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.test-result {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.test-result--empty {
  background: #f5f5f5;
  color: #999;
}

.test-result--success {
  background: #e6f4ea;
  color: #1e7e34;
}

.test-result--failure {
  background: #fce8e6;
  color: #c5221f;
}

.test-log {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 14px 16px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}

.test-log-empty {
  color: #666;
  font-size: 13px;
  padding: 8px 0;
}

.test-log-item {
  color: #a0d468;
  font-size: 12px;
  line-height: 1.8;
  padding: 2px 0;
  border-bottom: 1px solid #2a2a2a;
}

.test-log-item:last-child {
  border-bottom: none;
}
</style>