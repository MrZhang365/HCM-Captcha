<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CaptchaWidget from './components/CaptchaWidget.vue'
import type { CaptchaSubmitEvent } from './types/captcha'
import { QUESTIONS, MIN_IMG, MAX_IMG, getQuestion } from './api/questions'

const captchaRef = useTemplateRef<InstanceType<typeof CaptchaWidget>>('captchaRef')
const markSelect = ref<string>('')
const imgId = ref<number>(0)
const debugMode = ref<boolean>(!!import.meta.env.VITE_DEBUG_MODE)

async function handleStart() {
  const selected = await getQuestion()
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
  // 暂时留空
}
</script>

<template>
  <div class="test-page">
    <h1 class="test-title">这是什么？</h1>
    <p class="test-desc">
      这是一个专为火车迷打造的人机验证组件（CAPTCHA），由 <a href="https://blog.zhangsoft.top/" target="_blank">MrZhang365</a> 在 TRAE AI 的协助下开发。
      项目纯属娱乐，理论上说不具备实用价值 <br />
      你说什么？你想看源码？<a href="https://github.com/MrZhang365/hcm-captcha">如你所愿</a> 不要忘记给我star！
    </p>

    <div class="test-section">
      <h2 class="test-section-title">你是火车迷吗？</h2>
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

    <div class="test-section">
      <h2 class="test-section-title">关于作者 MrZhang365...</h2>
      <p class="test-desc">
        <del>入站信号好???????????????????</del>（这是哪只黑客写的（恼<br />
        出站信号好！这里是 MrZhang365，一位 <del>刚满十八岁～ 的</del> 编程爱好者兼火车迷，偶尔搞一些奇怪的项目（比如这个），时不时全国乱跑探访机位，学老裴站在车窗处看火车迷<br />
        B站：<a href="https://space.bilibili.com/3493087114430866" target="_blank">@MrZhang365</a><br />
        抖音：<a href="https://www.douyin.com/user/MS4wLjABAAAAPWot5UtE2Hlh2hCaggw1zWiDIX3XFdFv02oucTzfA1jOYr-g7gc3h5U0Y4U8Jqlz" target="_blank">MrZhang365</a><br />
        微信视频号：<a>@MrZhang365</a>
      </p>
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