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
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)" style="height:40vh">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="奖品ID" min-width="120" />
        <el-table-column prop="reach_amount" label="充值金额满足" min-width="120" />
        <el-table-column prop="gift_num" label="赠送抽奖次数" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="left" width="200">
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
            <el-button v-hasPerm="['lotteryConfig:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
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
      <el-form-item label="充值金额满足于" prop="reach_amount">
        <el-input-number v-model="formData.reach_amount" placeholder="请输入充值金额满足于" :min="0" />
      </el-form-item>
      <el-form-item label="赠送抽奖次数" prop="gift_num">
        <el-input-number v-model="formData.gift_num" placeholder="请输入充值赠送抽奖次数" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">取消</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type rechargeForm } from "@/api/system/lotteryConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
const props = withDefaults(defineProps<{ title: string ,index:number}>(), {});
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const queryParams=reactive({type:props.index})
const table = new TableInstance<rechargeForm>(api, queryParams, 20);

watch(()=>props.index,val=>{
  if(val)queryParams.type=val
})
watch(visible,val=>{
  if(val){
    table.queryHandler();
  }
})

const dialogTitle = ref("");
const formData = reactive<rechargeForm>({});
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
          Object.assign(formData, { id: undefined,type:props.index });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);
const rules = {
  reach_amount: [{ required: true, message: "请输入充值金额满足于", trigger: "blur" }],
  gift_num: [{ required: true, message: "请输入充值赠送抽奖次数", trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (table.currentData.value) await api.edit(formData);
      else await api.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
