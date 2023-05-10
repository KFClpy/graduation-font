<template>
  <div class="h-full overflow-hidden">
    <n-card title="数据集管理" class="h-full shadow-sm rounded-16px">
      <n-space :vertical="true">
        <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
          <n-data-table :columns="columns" :data="dataSource" :flex-height="true" class="h-480px" />
        </loading-empty-wrapper>
      </n-space>
    </n-card>
    <n-modal v-model:show="showModal">
      <n-card style="width: 800px" title="数据集编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-space>
          <n-button @click="handleClickAddColumn">增加列</n-button>
        </n-space>
        <n-space :vertical="true">
          <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
            <n-data-table :columns="columns_edit" :data="dataSource_edit" :flex-height="true" class="h-480px" />
          </loading-empty-wrapper>
        </n-space>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showModalInside">
      <n-card style="width: 600px" title="名称编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" size="large" :show-label="false">
          <n-form-item>
            <n-input v-model:value="valueEditInput" placeholder="请输入更改完的属性名" />
          </n-form-item>
          <n-form-item>
            <n-button @click="handleEditColumn(columnId, valueEditInput)"> 确定 </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showModalAdd">
      <n-card style="width: 600px" title="添加列" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-spin :show="show">
          <n-form ref="formRef1" size="large" :show-label="false">
            <n-form-item>
              <n-input v-model:value="valueAddInput" placeholder="请输入新增的列名" />
            </n-form-item>
            <n-form-item>
              <n-input v-model:value="valueAddDefault" placeholder="请输入列的默认值" />
            </n-form-item>
            <n-form-item>
              <n-button @click="handleAddColumn(valueAddInput, valueAddDefault)"> 确定 </n-button>
            </n-form-item>
          </n-form>
        </n-spin>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { useLoadingEmpty } from '@/hooks';
import { localStg } from '@/utils';
import {
  deleteOneColumn,
  deleteDataInfo,
  getColumnInfo,
  getDataInfo,
  editOneColumn,
  addOneColumn
} from '@/service/api/data';

const { loading, startLoading, endLoading, empty } = useLoadingEmpty();
const valueAddInput = ref('');
const valueAddDefault = ref('');
const showModalAdd = ref(false);
const showModal = ref(false);
const showModalInside = ref(false);
const valueEditInput = ref('');
const show = ref(false);
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
          <NButton size={'small'} onClick={() => handleEditTable(row.data_name)}>
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
const columns_edit: DataTableColumn[] = [
  {
    title: '列id',
    key: 'column_id',
    align: 'center'
  },
  {
    title: '列名称',
    key: 'column_name',
    align: 'center'
  },
  {
    key: 'action',
    title: 'Action',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditColumnOpen(row.column_id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteColumn(row.column_id)}>
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
const dataSource_edit = ref([]);
const dataname = ref('');
const columnId = ref('');
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

async function handleAddColumn(column_name: string, default_value: string) {
  const { data } = await addOneColumn(dataname.value, column_name, default_value);
  show.value = true;
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`添加成功`);
  } else {
    window.$message?.error(`添加失败`);
  }
  await updateColumnTable();
  await updateDataTable();
  show.value = false;
  showModalAdd.value = false;
}
async function handleDeleteColumn(column_id: string) {
  const { data } = await deleteOneColumn(dataname.value, column_id);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`删除成功`);
  } else {
    window.$message?.error(`删除失败`);
  }
  await updateColumnTable();
  await updateDataTable();
}
async function handleClickAddColumn() {
  valueAddInput.value = '';
  valueAddDefault.value = '';
  showModalAdd.value = true;
}
async function handleEditColumn(column_id: string, new_data_name: string) {
  const { data } = await editOneColumn(dataname.value, column_id, new_data_name);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`编辑成功`);
    showModalInside.value = false;
  } else {
    window.$message?.error(`编辑失败`);
  }
  await updateColumnTable();
  await updateDataTable();
}
async function handleEditColumnOpen(column_id: string) {
  showModalInside.value = true;
  valueEditInput.value = dataSource_edit.value?.find(item => item.column_id === Number(column_id)).column_name;
  columnId.value = column_id;
}
async function handleEditTable(data_name: string) {
  showModal.value = true;
  dataname.value = data_name;
  await updateColumnTable();
}
async function updateColumnTable() {
  startLoading();
  const { data } = await getColumnInfo(dataname.value);
  dataSource_edit.value = data;
  endLoading();
}
onMounted(() => {
  updateDataTable();
});
</script>

<style scoped></style>
