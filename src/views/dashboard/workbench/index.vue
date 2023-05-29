<template>
  <div>
    <n-card title="数据上传" class="h-full shadow-sm rounded-16px">
      <n-space>
        <n-space>
          <n-button @click="showModal = true"> 以文件导入 </n-button>
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
        </n-space>
        <n-space>
          <n-button @click="dataModal = true"> 数据库导入 </n-button>
          <n-modal v-model:show="dataModal">
            <n-card style="width: 600px" title="数据导入" :bordered="false" size="huge" role="dialog" aria-modal="true">
              <n-spin :show="show">
                <n-form ref="formRef1" :model="model1" size="large" :show-label="false">
                  <n-form-item path="username">
                    <n-input v-model:value="model1.username" placeholder="请输入数据库用户名称" />
                  </n-form-item>
                  <n-form-item path="password">
                    <n-input v-model:value="model1.password" placeholder="请输入数据库用户密码" />
                  </n-form-item>
                  <n-form-item path="hostname">
                    <n-input v-model:value="model1.hostname" placeholder="请输入数据库地址" />
                  </n-form-item>
                  <n-form-item path="port">
                    <n-input v-model:value="model1.port" placeholder="请输入数据库端口" />
                  </n-form-item>
                  <n-form-item path="database">
                    <n-input v-model:value="model1.database" placeholder="请输入数据库名称" />
                  </n-form-item>
                  <n-form-item path="db_type">
                    <n-select v-model:value="model1.db_type" :options="options" placeholder="请选择数据库类型">
                    </n-select>
                  </n-form-item>
                  <n-form-item path="submit">
                    <n-button style="margin-bottom: 12px" @click="handleTest(model1)"> 测试连接 </n-button>
                  </n-form-item>
                  <n-form-item path="sql">
                    <n-input v-model:value="model1.sql" placeholder="请输入sql语句" />
                  </n-form-item>
                  <n-form-item path="data_name">
                    <n-input v-model:value="model1.data_name" placeholder="请输入数据集名称" />
                  </n-form-item>
                  <n-form-item path="submit">
                    <n-button style="margin-bottom: 12px" @click="handleExecute(model1)"> 提交 </n-button>
                  </n-form-item>
                </n-form>
              </n-spin>
            </n-card>
          </n-modal>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, UnwrapNestedRefs } from 'vue';
import type { UploadInst, FormRules, FormInst } from 'naive-ui';
import { formRules, localStg } from '@/utils';
import { uploadFile } from '@/service/api/file';
import { checkValid, executeSql } from '@/service/api/data';
const formRef = ref<HTMLElement & FormInst>();
const formRef1 = ref<HTMLElement & FormInst>();
const uploadRef = ref<UploadInst | null>(null);
let formData = new FormData();
// 上传
// 上传
const customRequest = ({ file }) => {
  formData = new FormData();
  formData.append('data_file', file.file);
  // 上传接口
};
const options = ref([
  {
    label: 'postgresql',
    value: 'postgresql'
  },
  {
    label: 'mysql',
    value: 'mysql'
  }
]);
const show = ref(false);
const showModal = ref(false);
const dataModal = ref(false);
const model = reactive({
  dataname: ''
});
const model1 = reactive({
  username: '',
  password: '',
  hostname: '',
  port: '',
  database: '',
  db_type: 'postgresql',
  sql: '',
  data_name: ''
});
const rules: FormRules = {
  dataname: formRules.dataname
};
async function handleClick() {
  await formRef.value?.validate();
  await uploadRef.value?.submit();
  await uploadRef.value?.clear();
  formData.append('data_name', model.dataname);
  if (formData.get('data_file') !== null) {
    show.value = true;
    const userflag = await uploadFile(formData);
    const username = userflag.data?.username;
    if (username === localStg.get('userInfo')?.userName) {
      window.$message?.success('上传成功');
      showModal.value = false;
    } else {
      window.$message?.error('上传失败');
    }
    show.value = false;
  } else {
    window.$message?.error('请先上传文件');
  }
}
async function handleTest(model1: UnwrapNestedRefs<{
	db_type: string;
	password: string;
	hostname: string;
	database: string;
	data_name: string;
	port: string;
	username: string;
	sql: string
}>) {
  show.value = true;
  const { data } = await checkValid(model1);
  if (data.is_valid) {
    window.$message?.success('正确连接');
  } else {
    window.$message?.error('无法连接');
  }
  show.value = false;
}

async function handleExecute(model1: UnwrapNestedRefs<{
	db_type: string;
	password: string;
	hostname: string;
	database: string;
	data_name: string;
	port: string;
	username: string;
	sql: string
}>) {
  show.value = true;
  const userflag = await executeSql(model1);
  const username = userflag.data?.username;
  if (username === localStg.get('userInfo')?.userName) {
    window.$message?.success('上传成功');
    showModal.value = false;
  } else {
    window.$message?.error('上传失败');
  }
  show.value = false;
}
</script>

<style scoped></style>
