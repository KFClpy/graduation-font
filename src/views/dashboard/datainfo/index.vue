<template>
  <div class="h-full overflow-hidden">
    <n-card title="数据集管理" class="h-full shadow-sm rounded-16px">
      <n-space :vertical="true">
        <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
          <n-data-table :columns="columns" :data="dataSource" :flex-height="true" class="h-480px" />
        </loading-empty-wrapper>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { useLoadingEmpty } from '@/hooks';
import { localStg } from '@/utils';
import { deleteDataInfo, getDataInfo } from '@/service/api/data';

const { loading, startLoading, endLoading, empty } = useLoadingEmpty();

const columns: DataTableColumn[] = [
  {
    title: '数据集名称',
    key: 'data_name',
    align: 'center'
  },
  {
    title: '列数',
    key: 'columns',
    align: 'center'
  },
  {
    title: '行数',
    key: 'rows',
    align: 'center'
  },
  {
    key: 'action',
    title: 'Action',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => {}}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.data_name)}>
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

const dataSource = ref([]);

async function updateDataTable() {
  startLoading();
  const { data } = await getDataInfo();
  dataSource.value = data;
  endLoading();
}
async function handleDeleteTable(data_name: string) {
  const { data } = await deleteDataInfo(data_name);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`删除成功`);
  } else {
    window.$message?.error(`删除失败`);
  }
  await updateDataTable();
}
onMounted(() => {
  updateDataTable();
});
</script>

<style scoped></style>
