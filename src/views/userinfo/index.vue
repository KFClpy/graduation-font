<template>
  <div class="h-full">
    <n-card title="用户信息更改" class="h-full shadow-sm rounded-16px">
      <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
        <n-form-item path="gender">
          <n-select v-model:value="model.gender" :options="options" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item path="phone">
          <n-input v-model:value="model.phone" placeholder="请输入手机号码" />
        </n-form-item>
        <n-form-item path="email">
          <n-input v-model:value="model.email" placeholder="请输入电子邮箱" />
        </n-form-item>
        <n-form-item path="button">
          <n-button type="primary" @click="handleClick">确定</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormRules, FormInst } from 'naive-ui';
import { NButton } from 'naive-ui';
import { changeUserInfo, fetchSelf } from '@/service';
import { formRules, localStg } from '@/utils';
import { getUserInfo } from '@/store/modules/auth/helpers';

const formRef = ref<HTMLElement & FormInst>();
const model = reactive({
  phone: '',
  email: '',
  gender: ''
});
const options = ref([
  {
    label: '男',
    value: 0
  },
  {
    label: '女',
    value: 1
  }
]);
const rules: FormRules = {
  phone: formRules.phone,
  email: formRules.email
};
async function updateFormData() {
	const array = {
		'0': '男',
		'1': '女'
	};
  const { data } = await fetchSelf();
  model.phone = data.userInfo.phone;
  model.email = data.userInfo.email;
  model.gender = array[data.userInfo.gender];
}
async function handleClick() {
  await formRef.value?.validate();
  if (model.gender === '男') {
    model.gender = '0';
  }
  if (model.gender === '女') {
    model.gender = '1';
  }
  const { data } = await changeUserInfo(model);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`修改成功`);
    await updateFormData();
  } else {
    window.$message?.error(`修改失败`);
  }
}
onMounted(() => {
  // getDataSource();
  updateFormData();
});
</script>

<style scoped></style>
