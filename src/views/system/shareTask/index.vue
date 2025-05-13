<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryParams.name" @keyup.enter="queryHandler" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable class="!w-[100px]">
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="queryHandler">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button v-hasPerm="['currency:add']" type="success" @click="editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['currency:delete']" type="danger" @click="deleteHandler()" :disabled="selectList.length <= 0">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table v-loading="loading" :data="list" row-key="id" @selection-change="selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="icon" label="分享任务图片" min-width="100">
          <template #default="{ row }">
            <img :src="row.icon" class="icon" />
          </template>
        </el-table-column>

        <el-table-column prop="type" label="奖励类型" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="success">账户佣金</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">奖励VIP</el-tag>
            <el-tag v-else type="warning">基础账户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reward_type" label="奖励次数(类型)" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.reward_type == 1" type="success">总共一次</el-tag>
            <el-tag v-else-if="row.reward_type == 2" type="info">每日一次</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="share_amount" label="佣金金额" min-width="120" />

        <el-table-column prop="reward_vip_level" label="奖励VIP等级" min-width="120" />
        <el-table-column prop="reward_vip_days" label="奖励VIP天数" min-width="120" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['currency:edit']" type="primary" link size="small" @click.stop="editHandler(row, 0)">
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <el-button v-hasPerm="['currency:delete']" type="danger" link size="small" @click.stop="deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['currency:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="changeStatus(row)">
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <editPart v-model="visible[0]" :data="currentData" @finally="queryHandler" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type Form, Query } from "@/api/system/shareTask";
import { StatusEnum } from "@/enums/MenuTypeEnum";

const queryFormRef = ref(ElForm);
const loading = ref(false);
const queryParams = reactive<Query>({
  page: 1,
  limit: 20,
});
const list = ref<Form[]>();

/** 查询 */
async function queryHandler() {
  loading.value = true;
  const temp = await api.getList(queryParams);
  list.value = temp.list;
  loading.value = false;
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryHandler();
}

const visible = ref([false, false]);
const currentData = ref<Form>();
function editHandler(item?: Form, type: 0 | 1 = 0) {
  visible.value[type] = true;
  currentData.value = item;
}

const selectList = ref<number[]>([]);
function selectionChangeHandler(data: Form[]) {
  selectList.value = data.map((val) => <number>val.id);
}

async function deleteHandler(id?: number) {
  const params = id ? [id] : unref(selectList);
  const res = await api.delete(params);
  if (res) queryHandler();
}
async function changeStatus(item: Form) {
  await api.changeStatus(item, item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True);
  queryHandler();
}

onMounted(() => {
  queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
