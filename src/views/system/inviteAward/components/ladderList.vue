<template>
  <el-dialog v-model="visible" title="邀请阶梯设置" width="70vw">
    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button v-hasPerm="['lotteryConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table v-loading="table.loading.value" :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="people_invited" label="邀请几个人" min-width="120" />
        <el-table-column prop="gift_amount" label="赠送金额" min-width="120" />
        <!-- <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['lotteryConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <!-- <el-button v-hasPerm="['lotteryConfig:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button> -->
            <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination background :total="table.pageTotal.value" :page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
  <el-dialog v-model="table.visible.value[0]" :title="dialogTitle" width="50vw">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="邀请几个人" prop="people_invited">
        <el-input-number v-model="formData.people_invited" placeholder="请输入签到天数" :min="0" />
      </el-form-item>
      <el-form-item label="赠送金额" prop="gift_amount">
        <el-input-number v-model="formData.gift_amount" placeholder="请输入充值奖励金额" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">取消</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type LadderListForm } from "@/api/system/inviteAward";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const table = new TableInstance<LadderListForm>(api.ladder, {}, 20);

const dialogTitle = ref("");
const formData = reactive<LadderListForm>({});
watch(
  () => unref(table.visible)[0],
  (val) => {
    if (val) {
      nextTick(() => {
        if (unref(table.currentData)) {
          Object.assign(formData, unref(table.currentData));
          dialogTitle.value = "编辑";
        } else {
          dialogTitle.value = "新增";
          Object.assign(formData, { id: undefined });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);
const rules = {
  people_invited: [{ required: true, message: "请输入邀请几个人", trigger: "blur" }],
  gift_amount: [{ required: true, message: "请输入赠送金额", trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (unref(table.currentData)) await api.ladder.edit(formData);
      else await api.ladder.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
