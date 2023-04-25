<template>
  <div class="h-full">
    <n-card title="多级菜单 - 三级菜单" class="h-full shadow-sm rounded-16px">
      <div class="flex flex-col items-center justify-center h-full">
        <n-button type="primary" @click="handleClick">点击调用OpenAI</n-button>
        <div class="mt-10">{{ res }}</div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanChatMessage } from 'langchain/schema';
import { OPENAI_API_KEY } from '@/views/multi-menu/first/second-new/third/aikey';

const res = ref('');
const chat = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 });
async function handleClick() {
  res.value = (
    await chat.call([new HumanChatMessage('Translate this sentence from English to French. I love programming.')])
  ).text;
}
</script>

<style scoped></style>
