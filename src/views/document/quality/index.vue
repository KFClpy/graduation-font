<template>
  <div>
    <n-spin :show="show">
      <n-card title="连接质量评测" class="h-full shadow-sm rounded-16px">
        <n-form ref="formRef" size="large" :show-label="false">
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
        </n-form>
        <n-button style="margin-bottom: 12px" @click="handleClick"> 提交 </n-button>
        <div v-if="fontShow" class="mt-10" style="font-size: 20px; text-align: center">
          准确率:{{ precison }}&nbsp;&nbsp;&nbsp;召回率:{{ recall }}&nbsp;&nbsp;&nbsp;F1:{{ f1 }}
        </div>
      </n-card>
    </n-spin>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { localStg } from '@/utils';
import { getDataName, qualityEvaluate } from '@/service/api/data';

const valuel = ref('请选择合成数据集');
const valuer = ref('请选择真实数据集');
const precison = ref(0);
const recall = ref(0);
const f1 = ref(0);
const options = ref([]);
const show = ref(false);
const fontShow = ref(false);
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
  show.value = true;
  const { data } = await qualityEvaluate(valuel.value, valuer.value);
  if (data?.username === localStg.get('userInfo')?.userName) {
    precison.value = data?.precision;
    recall.value = data?.recall;
    f1.value = data?.f1;
    fontShow.value = true;
    window.$message?.success(`计算成功`);
  } else {
    window.$message?.error(`计算失败`);
    fontShow.value = false;
  }
  show.value = false;
}
onMounted(() => {
  updateDataName();
});
</script>
<style scoped></style>
