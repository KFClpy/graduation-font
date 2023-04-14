<template>
  <n-button @click="showModal = true"> 数据导入 </n-button>
  <n-modal v-model:show="showModal">
    <n-card style="width: 600px" title="数据导入" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-spin :show="show">
        <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
          <n-form-item path="uploadData">
            <n-upload
              ref="uploadRef"
              action="#"
              :max="1"
              :custom-request="customRequest"
              :default-upload="false"
              accept=".csv"
            >
              <n-button>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item path="dataname">
            <n-input v-model:value="model.dataname" placeholder="请输入数据集名称" />
          </n-form-item>
          <n-form-item path="submit">
            <n-button style="margin-bottom: 12px" @click="handleClick"> 提交 </n-button>
          </n-form-item>
        </n-form>
      </n-spin>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { UploadInst, FormRules, FormInst } from 'naive-ui';
import { formRules, localStg } from '@/utils';
import { uploadFile } from '@/service/api/file';
const formRef = ref<HTMLElement & FormInst>();
const uploadRef = ref<UploadInst | null>(null);
let formData = new FormData();
// 上传
// 上传
const customRequest = ({ file }) => {
  formData = new FormData();
  formData.append('data_file', file.file);
  // 上传接口
};
const show = ref(false);
const showModal = ref(false);
const model = reactive({
  dataname: ''
});
const rules: FormRules = {
  dataname: formRules.dataname
};
async function handleClick() {
  await formRef.value?.validate();
  await uploadRef.value?.submit();
  formData.append('data_name', model.dataname);
  if (formData.get('data_file') !== null) {
    show.value = true;
    const userflag = await uploadFile(formData);
    const username = userflag.data?.username;
    console.log('username', username);
    console.log('username2', localStg.get('userInfo')?.userName);
    if (username === localStg.get('userInfo')?.userName) {
      window.$message?.success('上传成功');
    }
    show.value = false;
  } else {
    window.$message?.error('请先上传文件');
  }
}
</script>

<style scoped></style>
