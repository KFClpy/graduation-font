<template>
  <div class="h-full overflow-hidden">
    <n-card title="数据集编辑" class="h-full shadow-sm rounded-16px">
      <n-space :vertical="true">
        <n-space>
          <n-select
            v-model:value="value"
            :options="options"
            :consistent-menu-width="false"
            @update:value="handleUpdateValue"
          />
        </n-space>
        <n-button @click="download(value)"> 下载csv文件 </n-button>
        <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
          <n-data-table
            :columns="columns"
            :data="dataSource"
            :flex-height="true"
            :pagination="pagination"
            class="h-480px"
          />
        </loading-empty-wrapper>
      </n-space>
    </n-card>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="数据编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" size="large" :show-label="false">
          <n-form-item>
            <n-select
              v-model:value="valueSelect"
              :options="options_edit"
              :consistent-menu-width="false"
              @update:value="handleUpdateValueEdit"
            />
          </n-form-item>
          <n-form-item>
            <n-input v-model:value="valueEditInput[valueSelect]" placeholder="请输入更改完的属性值" />
          </n-form-item>
          <n-form-item>
            <n-button @click="handleClick"> 修改 </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import type { DataTableColumn, SelectOption, PaginationProps } from 'naive-ui';
import { useLoadingEmpty } from '@/hooks';
import { localStg } from '@/utils';
import { deleteOneData, editOneData, getDataName, getDataTable } from '@/service/api/data';

const { loading, startLoading, endLoading, empty } = useLoadingEmpty();

let columns: DataTableColumn[] = [];
const dataSource = ref([]);
// 创建options，每个option都有label和value，value和option都是列表data_name_list中的值
const options = ref([]);
const value = ref(' 请选择数据 ');
const valueSelect = ref(' 请选择属性 ');
const options_edit = ref([]);
const valueEditInput = ref({});
const showModal = ref(false);
const rowID = ref(0);
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
const download = (data_name: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3200/proxy-pattern/file/download', true);
  xhr.responseType = 'blob';
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.setRequestHeader('Authorization', `Bearer ${localStg.get('token')}`);
  // eslint-disable-next-line func-names
  xhr.onload = function () {
    if (this.status === 200) {
      const blob = this.response;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      // eslint-disable-next-line func-names
      reader.onload = function (e) {
        const a = document.createElement('a');
        a.download = `${data_name}.csv`;
        if (typeof e.target.result === 'string') {
          a.href = e.target.result;
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };
  xhr.send(JSON.stringify({ data_name }));
};
async function updateDataTable() {
  startLoading();
  const { data } = await getDataTable(value.value);
  const data_header = Object.keys(data);
  const data_value = Object.values(data);
  const data_header_now = [];
  for (let i = 0; i < data_header.length; i++) {
    if (data_header[i] !== 'tid') {
      data_header_now.push(data_header[i]);
    }
  }
  columns = [];
  columns = data_header_now.map(item => {
    return {
      title: item,
      key: item,
      align: 'center'
    };
  });
  columns.push({
    key: 'action',
    title: 'Action',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.tid)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.tid)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  });
  dataSource.value = [];
  // data_value是一个类，内容是二维数组，他的行号是data_header的下标，列号是每个data_header的值，把每一行的值赋给data_source
  let rowlen = 0;
  for (let i = 0; i < data_value.length; i++) {
    for (let j = 0; j < 1; j++) {
      rowlen = data_value[i].length;
    }
  }
  for (let i = 0; i < rowlen; i++) {
    const data_source = {};
    for (let j = 0; j < data_header.length; j++) {
      data_source[data_header[j]] = data_value[j][i];
    }
    dataSource.value.push(data_source);
  }
  endLoading();
}
const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});
function handleEditTable(rowId: string) {
  const findItem = dataSource.value.find(item => item.tid === Number(rowId));
  const changeKeys = [];
  Object.keys(findItem).forEach(item => {
    if (item !== 'tid') {
      changeKeys.push(item);
    }
  });
  options_edit.value = changeKeys.map(item => {
    return {
      label: item,
      value: item
    };
  });
  valueSelect.value = Object.keys(findItem)[0];
  const findItemNew = {};
  Object.keys(findItem).forEach(item => {
    findItemNew[item] = String(findItem[item]);
  });
  valueEditInput.value = findItemNew;
  rowID.value = Number(rowId);
  showModal.value = true;
}
function handleUpdateValue(value: string, option: SelectOption) {
  // window?.$message?.info(`value: ${JSON.stringify(value)}`);
  // window?.$message?.info(`option: ${JSON.stringify(option)}`);
  updateDataTable();
}
function handleUpdateValueEdit() {}
async function handleDeleteTable(rowId: string) {
  const { data } = await deleteOneData(Number(rowId));
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`删除成功`);
  } else {
    window.$message?.error(`删除失败`);
  }
  await updateDataTable();
}
async function handleClick() {
  const { data } = await editOneData(rowID.value, valueEditInput.value);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`编辑成功`);
    showModal.value = false;
  } else {
    window.$message?.error(`编辑失败`);
  }
  await updateDataTable();
}
onMounted(() => {
  // getDataSource();
  updateDataName();
  updateDataTable();
});
</script>

<style scoped></style>
