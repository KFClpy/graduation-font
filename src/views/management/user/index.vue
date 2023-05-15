<template>
  <div class="h-full overflow-hidden">
    <n-card title="用户管理" :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-space>
            <n-button type="error" @click="handleDelete">
              <icon-ic-round-delete class="mr-4px text-20px" />
              删除
            </n-button>
          </n-space>
          <n-space>
            <n-button :disabled="!enabled" @click="searchUser">
              <icon-uil-search class="text-20px" />
            </n-button>
          </n-space>
          <n-space>
            <n-input v-model:value="searchValue" placeholder="请输入用户名" @input="handleInput"></n-input>
          </n-space>
        </n-space>
        <n-space align="center" :size="18">
          <n-button size="small" type="primary" @click="getTableData">
            <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
            刷新表格
          </n-button>
          <column-setting v-model:columns="columns" />
        </n-space>
      </n-space>
      <n-data-table
        :row-key="rowKey"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        @update:checked-row-keys="handleCheck"
      />
    </n-card>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
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
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps, FormRules, FormInst } from 'naive-ui';
import { genderLabels, roleLabels } from '@/constants';
import { deleteUser, deleteUsers, editUser, fetchUser, fetchUserList } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import { formRules, localStg } from '@/utils';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
import ColumnSetting from './components/column-setting.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const searchValue = ref('');
const tableData = ref([]);
const showModal = ref(false);
const selectRowName = ref('');
const formRef = ref<HTMLElement & FormInst>();
const checkedRowKeysRef = ref([]);
const enabled = ref(false);
const rowKey = row => row.userName;
const model = reactive({
  phone: '',
  email: '',
  gender: ''
});
const rules: FormRules = {
  phone: formRules.phone,
  email: formRules.email
};
function setTableData(data) {
  tableData.value = data.userList;
}
function handleInput() {
  enabled.value = searchValue.value.length > 0;
}

async function getTableData() {
  startLoading();
  const { data } = await fetchUserList();
  if (data) {
    setTableData(data);
    endLoading();
  }
}
async function searchUser() {
	startLoading();
  const { data } = await fetchUser(searchValue.value);
  if (data) {
    await setTableData(data);
		endLoading();
  }
}
const columns = ref([
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'index',
    title: '序号',
    align: 'center'
  },
  {
    key: 'userName',
    title: '用户名',
    align: 'center'
  },
  {
    key: 'gender',
    title: '性别',
    align: 'center',
    render: row => {
      if (row.gender) {
        const tagTypes: Record<UserManagement.GenderKey, NaiveUI.ThemeColor> = {
          '0': 'success',
          '1': 'warning'
        };
        return <NTag type={tagTypes[row.gender]}>{genderLabels[row.gender]}</NTag>;
      }

      return <span></span>;
    }
  },
  {
    key: 'role',
    title: '角色',
    align: 'center',
    render: row => {
      if (row.role) {
        const tagTypes: Record<UserManagement.RoleKey, NaiveUI.ThemeColor> = {
          super: 'success',
          admin: 'error',
          user: 'warning'
        };

        return <NTag type={tagTypes[row.role]}>{roleLabels[row.role]}</NTag>;
      }

      return <span></span>;
    }
  },
  {
    key: 'phone',
    title: '手机号码',
    align: 'center'
  },
  {
    key: 'email',
    title: '邮箱',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.userName)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.userName)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]);
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
async function handleDelete() {
  const { data } = await deleteUsers(checkedRowKeysRef.value);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`删除成功`);
  } else {
    window.$message?.error(`删除失败`);
  }
  await getTableData();
}
async function handleEditTable(rowName: string) {
  selectRowName.value = rowName;
  showModal.value = true;
  const findItem = tableData.value.find(item => item.userName === rowName);
  const array = {
    '0': '男',
    '1': '女'
  };
  model.gender = array[findItem.gender];
  model.phone = findItem.phone;
  model.email = findItem.email;
}

async function handleClick() {
  await formRef.value?.validate();
  if (model.gender === '男') {
    model.gender = '0';
  }
  if (model.gender === '女') {
    model.gender = '1';
  }
  const { data } = await editUser(selectRowName.value, model);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`编辑成功`);
    showModal.value = false;
  } else {
    window.$message?.error(`编辑失败`);
  }
  await getTableData();
}

async function handleDeleteTable(rowName: string) {
  const { data } = await deleteUser(rowName);
  if (data?.username === localStg.get('userInfo')?.userName) {
    window.$message?.success(`删除成功`);
  } else {
    window.$message?.error(`删除失败`);
  }
  await getTableData();
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

function handleCheck(rowKeys: string[]) {
  checkedRowKeysRef.value = rowKeys;
}

function init() {
  getTableData();
}

// 初始化
init();
</script>

<style scoped></style>
