<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="username">
      <n-input v-model:value="model.username" placeholder="用户名" />
    </n-form-item>
    <n-form-item path="pwd">
      <n-input v-model:value="model.pwd" type="password" show-password-on="click" placeholder="密码" />
    </n-form-item>
    <n-form-item path="confirmPwd">
      <n-input v-model:value="model.confirmPwd" type="password" show-password-on="click" placeholder="确认密码" />
    </n-form-item>
    <n-space :vertical="true" :size="18">
      <n-button
        type="primary"
        size="large"
        :block="true"
        :round="true"
        :loading="auth.registerLoading"
        @click="handleSubmit"
        >确定</n-button
      >
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">返回</n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { useSmsCode } from '@/hooks';
import { formRules, getConfirmPwdRule } from '@/utils';

const auth = useAuthStore();
const { register } = useAuthStore();
const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, start } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  username: '',
  code: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
  username: formRules.username,
  code: formRules.code,
  pwd: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

const agreement = ref(false);

function handleSmsCode() {
  start();
}

async function handleSubmit() {
  await formRef.value?.validate();
  const { username, pwd } = model;
  register(username, pwd);
}
</script>

<style scoped></style>
