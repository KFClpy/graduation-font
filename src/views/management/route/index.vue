<template>
  <div>
    <n-spin :show="show">
      <n-card title="自动模糊连接" class="h-full shadow-sm rounded-16px">
        <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
          <n-form-item path="data_name_left">
            <n-space>
              <n-select v-model:value="valuel" :options="options" :consistent-menu-width="false" />
            </n-space>
          </n-form-item>
          <n-form-item path="data_name_right">
            <n-space>
              <n-select v-model:value="valuer" :options="options" :consistent-menu-width="false" />
            </n-space>
          </n-form-item>
          <n-form-item path="data_name_generate">
            <n-input v-model:value="model.data_name_generate" placeholder="请输入生成数据集名称" />
          </n-form-item>
        </n-form>
        <n-button style="margin-bottom: 12px" @click="handleClick"> 提交 </n-button>
      </n-card>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { NSpace } from 'naive-ui';
import { formRules, localStg } from '@/utils';
import { autoFuzzyJoin, getDataName } from '@/service/api/data';
const valuel = ref('请选择第一个数据集');
const valuer = ref('请选择第二个数据集');
const options = ref([]);
const show = ref(false);
const formRef = ref<HTMLElement & FormInst>();
const model = reactive({
  data_name_generate: ''
});
const rules: FormRules = {
  data_name_generate: formRules.dataname
};
async function updateDataName() {
  const { data } = await getDataName();
  // value.value=data?.data_name[0];
  // 将data_name_list.data中的值赋给options
  options.value = data?.data_name.map(item => {
    return {
      label: item,
      value: item
    };
  });
}
async function handleClick() {
  await formRef.value?.validate();
  show.value = true;
	const { data }=await autoFuzzyJoin(valuel.value, valuer.value, model.data_name_generate);
	if (data?.username === localStg.get('userInfo')?.userName) {
		window.$message?.success(`连接成功`);
	}
  await updateDataName();
  show.value = false;
}
onMounted(() => {
  // getDataSource();
  updateDataName();
});
</script>

<style scoped></style>
