<template>
  <n-button @click="showModal = true"> 来吧 </n-button>
  <n-modal v-model:show="showModal">
    <n-card style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-upload
        ref="uploadRef"
        action="#"
        :max="1"
        :custom-request="customRequest"
        :default-upload="false"
        accept=".csv"
      >
        <n-button>导入</n-button>
      </n-upload>
      <n-input v-model="dataname" placeholder="请输入数据集名称" />
      <n-button style="margin-bottom: 12px" @click="handleClick"> 上传文件 </n-button>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UploadInst } from 'naive-ui';
import { uploadFile } from '@/service/api/file';

const dataname = ref('');
const uploadRef = ref<UploadInst | null>(null);
let formData = new FormData();
// 上传
// 上传
const customRequest = ({ file }) => {
  formData = new FormData();
  formData.append('file', file.file);
  // 上传接口
};
const showModal = ref(false);

const handleClick = () => {
  uploadRef.value?.submit();
  uploadFile(formData).then(res => {
    console.log(formData.get('file'));
    console.log(res);
  });
};
</script>

<style scoped></style>
