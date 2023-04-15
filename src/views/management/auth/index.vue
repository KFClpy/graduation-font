<template>
  <div class="h-full overflow-hidden">
    <n-card title="表格" class="h-full shadow-sm rounded-16px">
      <n-space :vertical="true">
        <n-space>
          <n-button @click="getDataSource">有数据</n-button>
          <n-button @click="getEmptyDataSource">空数据</n-button>
					<n-select v-model:value="value" :options="options" :consistent-menu-width="false" @update:value="handleUpdateValue" />
        </n-space>
        <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
          <n-data-table :columns="columns" :data="dataSource" :flex-height="true" class="h-480px" />
        </loading-empty-wrapper>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton, NPopconfirm, SelectOption } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { useLoadingEmpty } from '@/hooks';
import { getRandomInteger } from '@/utils';
import { getDataName } from '@/service/api/data';

interface DataSource {
  name: string;
  age: number;
  address: string;
}

const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

const columns: DataTableColumn[] = [
  {
    title: 'Name',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Age',
    key: 'age',
    align: 'center'
  },
  {
    title: 'Address',
    key: 'address',
    align: 'center'
  },
  {
    key: 'action',
    title: 'Action',
    align: 'center',
    render: () => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => {}}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => {}}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

const dataSource = ref<DataSource[]>([]);

function createDataSource(): DataSource[] {
  return Array(100)
    .fill(1)
    .map((_item, index) => {
      return {
        name: `Name${index}`,
        age: getRandomInteger(30, 20),
        address: '中国'
      };
    });
}

// 创建options，每个option都有label和value，value和option都是列表data_name_list中的值
const options = ref([]);
const value = ref();
function getDataSource() {
  startLoading();
  setTimeout(() => {
    dataSource.value = createDataSource();
    endLoading();
    setEmpty(!dataSource.value.length);
  }, 1000);
}

async function updateDataName() {
  const { data } = await getDataName();
	value.value=data?.data_name[0];
  console.log(data?.data_name);
  // 将data_name_list.data中的值赋给options
  options.value = data?.data_name.map(item => {
    return {
      label: item,
      value: item
    };
  });
  console.log(options);
}

function handleUpdateValue (value: string, option: SelectOption) {
	window?.$message?.info('value: ' + JSON.stringify(value))
	window?.$message?.info('option: ' + JSON.stringify(option))
}
function getEmptyDataSource() {
  startLoading();
  setTimeout(() => {
    dataSource.value = [];
    endLoading();
    setEmpty(!dataSource.value.length);
  }, 1000);
}

onMounted(() => {
  getDataSource();
  updateDataName();
});
</script>

<style scoped></style>
