<template>
  <div>
    <n-spin :show="show">
      <n-card title="手动模糊连接" class="h-full shadow-sm rounded-16px">
        <n-form ref="formRef" :model="model" :rules="rules" size="large" label-placement="top">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="8" path="data_name_left" label="左数据集">
              <n-space>
                <n-select v-model:value="valuel" :options="options" :consistent-menu-width="false" />
              </n-space>
            </n-form-item-gi>
            <n-form-item-gi :span="16" path="data_name_right" label="右数据集">
              <n-space>
                <n-select v-model:value="valuer" :options="options" :consistent-menu-width="false" />
              </n-space>
            </n-form-item-gi>
            <n-form-item-gi :span="8" path="preprocessor" label="预处理方法">
              <n-space>
                <n-select
                  v-model:value="value_preprocessor"
                  :options="options_preprocessor"
                  :consistent-menu-width="false"
                />
              </n-space>
            </n-form-item-gi>
            <n-form-item-gi :span="8" path="tokenizer" label="分词方法">
              <n-space>
                <n-select v-model:value="value_tokenizer" :options="options_tokenizer" :consistent-menu-width="false" />
              </n-space>
            </n-form-item-gi>
            <n-form-item-gi :span="8" path="DistanceFunction" label="距离函数">
              <n-button @click="handleClickInside">添加距离函数</n-button>
            </n-form-item-gi>
            <n-form-item-gi :span="24" path="DistanceAdd">
              <n-dynamic-tags v-show="tagIf" v-model:value="tags" :input-props="InputProps" @update:value="updateTag" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" path="data_name_generate">
              <n-input v-model:value="model.data_name_generate" placeholder="请输入生成数据集名称" />
            </n-form-item-gi>
          </n-grid>
        </n-form>
        <n-modal v-model:show="showModal">
          <n-card
            style="width: 800px"
            title="添加距离函数"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
          >
            <n-space :vertical="true">
              <n-form ref="formRef_inside" :model="model" :rules="rules" size="large" :show-label="false">
                <n-form-item path="distance_function">
                  <n-space>
                    <n-select
                      v-model:value="value_distance_function"
                      :options="options_distance_function"
                      :consistent-menu-width="false"
                    />
                  </n-space>
                </n-form-item>
                <n-form-item path="threshold">
                  <n-slider v-model:value="threshold" :step="0.01" :max="1" />
                  <n-input-number v-model:value="threshold" :max="1" :step="0.01" placeholder="请输入阈值" />
                </n-form-item>
                <n-form-item path="submitButtonInside">
                  <n-button @click="handleClickAdd">确定</n-button>
                </n-form-item>
              </n-form>
            </n-space>
          </n-card>
        </n-modal>
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
import { getDataName, manualFuzzyJoin } from '@/service/api/data';
import { getDistanceFunction, getPreprocessor, getTokenizer } from '@/service/api/config';
const valuel = ref('请选择第一个数据集');
const valuer = ref('请选择第二个数据集');
const value_preprocessor = ref('请选择预处理方法');
const value_tokenizer = ref('请选择分词方法');
const value_distance_function = ref('请选择距离函数');
const options = ref([]);
const options_preprocessor = ref([]);
const options_tokenizer = ref([]);
const options_distance_function = ref([]);
const show = ref(false);
const formRef = ref<HTMLElement & FormInst>();
const formRef_inside = ref<HTMLElement & FormInst>();
const showModal = ref(false);
const threshold = ref(1);
const tags = ref([]);
const tagIf = ref(false);
const InputProps = ref({
  disabled: true
});
const model = reactive({
  data_name_generate: ''
});
const rules: FormRules = {
  data_name_generate: formRules.dataname
};
async function updateTag() {
  if (tags.value.length === 0) tagIf.value = false;
}
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
async function updatePreprocessor() {
  const { data } = await getPreprocessor();
  options_preprocessor.value = data?.preprocessor.map(item => {
    return {
      label: item,
      value: item
    };
  });
}
async function updateTokenizer() {
  const { data } = await getTokenizer();
  options_tokenizer.value = data?.tokenizer.map(item => {
    return {
      label: item,
      value: item
    };
  });
}
async function updateDistanceFunction() {
  const { data } = await getDistanceFunction();
  options_distance_function.value = data?.distance_function.map(item => {
    return {
      label: item,
      value: item
    };
  });
}
async function handleClick() {
  await formRef.value?.validate();
  show.value = true;
  const distance_submit = {};
  tags.value.forEach(item => {
    const obj = JSON.parse(item);
    Object.assign(distance_submit, obj);
  });
  const result = JSON.stringify({
    distance_function: distance_submit,
    preprocessor: value_preprocessor.value,
    tokenizer: value_tokenizer.value
  });
  const { data } = await manualFuzzyJoin(
    valuel.value,
    valuer.value,
    model.data_name_generate,
    result
  );
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`连接成功`);
  }
  await updateDataName();
  show.value = false;
}

async function handleClickInside() {
  showModal.value = true;
  value_distance_function.value = '请选择距离函数';
  threshold.value = 1;
}

async function handleClickAdd() {
  if (value_distance_function.value !== '请选择距离函数') {
    const currentTag = {};
    currentTag[value_distance_function.value] = threshold.value;
    tags.value.push(JSON.stringify(currentTag));
    showModal.value = false;
    tagIf.value = true;
  } else {
    window.$message?.error(`请选择距离函数`);
  }
}
onMounted(() => {
  updateDataName();
  updateDistanceFunction();
  updatePreprocessor();
  updateTokenizer();
});
</script>

<style scoped></style>
