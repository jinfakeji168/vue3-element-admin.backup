<template>
  <el-dialog v-model="visible" width="50%" title="手动提现" :close-on-click-modal="false">
    <el-form :model="model" label-width="140px" :rules="rules" ref="formRef">
      <el-form-item label="用户" prop="uid">
        <el-select filterable remote :remote-method="searchMemberHandler" v-model="model.uid" placeholder="请输入关键字搜索账号并选择">
          <el-option v-for="item of memberList" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提现金额" prop="amount">
        <el-input-number v-model="model.amount" :min="0" :precision="2" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/bill/withdrawOrder";
import { searchMember } from "@/utils";
import { useTemplateRef } from "vue";

const visible = defineModel<boolean>();
const model = ref({
  uid: undefined,
  amount: undefined,
});
const rules = {
  uid: [{ required: true, message: "请选择用户", trigger: "change" }],
  amount: [{ required: true, message: "请输入提现金额", trigger: "change" }],
};
const formRef = useTemplateRef("formRef");
const emits = defineEmits<{ finish: [] }>();
const loading = ref(false);
async function submitHandler() {
  await formRef.value?.validate();
  try {
    loading.value = true;
    await api.manuallyWithdraw(model.value);
    visible.value = false;
    emits("finish");
  } finally {
    loading.value = false;
  }
}

const memberList = ref<any>([]);
async function searchMemberHandler(str: string) {
  memberList.value = await searchMember({ account: str });
}
</script>

<style></style>
