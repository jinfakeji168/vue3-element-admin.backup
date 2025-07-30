<template>
  <el-dialog v-model="visible" width="70%" title="审核" :close-on-click-modal="false">
    <el-descriptions title="提现订单详情" :column="2" border v-if="data">
      <el-descriptions-item label="提现类型">{{ data.channel }}</el-descriptions-item>
      <el-descriptions-item label="提现地址">{{ data.rece_address }}</el-descriptions-item>
      <el-descriptions-item label="提现金额">{{ data.withdraw_amount }}</el-descriptions-item>
      <el-descriptions-item label="手续费">{{ data.fees }}</el-descriptions-item>
      <el-descriptions-item label="实际到账">{{ data.arrival_amount }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ data.created_at }}</el-descriptions-item>
    </el-descriptions>
    <el-form-item label="审核" style="margin-top: 20px">
      <el-radio-group v-model="model.status">
        <el-radio :label="1">通过</el-radio>
        <el-radio :label="3">拒绝</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="model.remark" type="textarea" />
    </el-form-item>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/bill/withdrawOrder";

const visible = defineModel<boolean>();
const props = defineProps<{ data: Form; ids: number[] }>();
const model = ref({
  ids: [0],
  status: 1,
  remark: "",
});

const emits = defineEmits<{
  finish: [];
}>();
const loading = ref(false);
async function submitHandler() {
  if (props.data) {
    model.value.ids = [props.data.id as number];
  } else if (props.ids) {
    model.value.ids = props.ids;
  }
  try {
    loading.value = true;
    await api.oneKeyAudit(model.value);
    visible.value = false;
    emits("finish");
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
