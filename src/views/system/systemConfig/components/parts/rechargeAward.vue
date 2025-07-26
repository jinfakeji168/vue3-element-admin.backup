<template>
  <el-dialog v-model="visible" :title="title" width="70vw">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
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
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)" style="height: 40vh">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="min_recharge" label="最低充值金额" min-width="120" />
        <el-table-column prop="max_recharge" label="最高充值金额" min-width="120" />
        <el-table-column prop="first_charge_ratio" label="送款比例(%)" min-width="120" />
        <el-table-column prop="first_charge_cap" label="送款封顶金额" min-width="120" />

        <el-table-column label="操作" fixed="right" align="left" width="auto">
          <template #default="{ row }">
            <el-button v-hasPerm="['lotteryConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
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
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
  <el-dialog v-model="table.visible.value[0]" :title="dialogTitle" width="50vw">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="最低充值金额(包含)" prop="min_recharge">
        <el-input v-model="formData.min_recharge" placeholder="请输入最低充值金额" />
      </el-form-item>
      <el-form-item label="最高充值金额(不包含)" prop="max_recharge">
        <el-input v-model="formData.max_recharge" placeholder="请输入最低充值金额" />
      </el-form-item>
      <el-form-item label="送款比例(%)" prop="first_charge_ratio">
        <el-input-number v-model="formData.first_charge_ratio" placeholder="请输入送款比例(%)" :precision="2" :step="1" :max="100" :min="0" />
      </el-form-item>
      <el-form-item label="送款封顶金额" prop="first_charge_cap">
        <el-input v-model="formData.first_charge_cap" placeholder="请输入送款封顶金额" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">取消</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type RechargeAward } from "@/api/system/systemConfig";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = withDefaults(defineProps<{}>(), {});
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const queryParams = reactive({});
const table = new TableInstance<RechargeAward>(api.rechargeAward, queryParams, 20);

const title = ref("首充奖励区间配置");

watch(visible, (val) => {
  if (val) {
    table.queryHandler();
    getLevelMap();
  }
});

const dialogTitle = ref("");

const levelMap = ref<{ key: number; val: string }[]>([]);

async function getLevelMap() {
  levelMap.value = await store.getTeamLevelListAsync();
}

/**表单数据 */
const formData = reactive<RechargeAward>({
  min_recharge: "",
  max_recharge: "",
  first_charge_cap: "",
  first_charge_ratio: "",
});

/**表单验证规则 */
const rules = {
  recharge_amount: [{ required: true, message: "请输入充值金额", trigger: "blur" }],
  gift_amount: [{ required: true, message: "请输入赠送金额", trigger: "blur" }],
  grade_id: [{ required: true, message: "请输入等级ID", trigger: "blur" }],
  recharge_type: [{ required: true, message: "请选择充值类型", trigger: "change" }],
};

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

const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (table.currentData.value) await api.rechargeAward.edit(formData);
      else await api.rechargeAward.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
