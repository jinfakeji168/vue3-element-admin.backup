<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="140px">
      <el-form-item label="名称" prop="show_name">
        <el-input v-model="formData.show_name" placeholder="" />
      </el-form-item>
      <el-form-item label="最小提现金额" prop="min_withdraw">
        <el-input-number v-model="formData.min_withdraw" :min="0" />
      </el-form-item>
      <el-form-item label="最大提现金额" prop="max_withdraw">
        <el-input-number v-model="formData.max_withdraw" :min="0" />
      </el-form-item>
      <el-form-item label="提现手续费" prop="withdraw_fee">
        <el-input-number v-model="formData.withdraw_fee_ratio" :min="0" />
      </el-form-item>
      <el-form-item label="最大手续费(按当前币种单位)" prop="max_withdraw_fee">
        <el-input-number v-model="formData.withdraw_fee_ratio" :min="0" />
      </el-form-item>
      <el-form-item label="最小手续费(按当前币种单位)" prop="min_withdraw_fee">
        <el-input-number v-model="formData.withdraw_fee_ratio" :min="0" />
      </el-form-item>
      <el-form-item label="部门状态">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="充值">
        <el-radio-group v-model="formData.open_recharge">
          <el-radio :label="StatusEnum.False">正常</el-radio>
          <el-radio :label="StatusEnum.True">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提现">
        <el-radio-group v-model="formData.open_withdraw">
          <el-radio :label="StatusEnum.False">正常</el-radio>
          <el-radio :label="StatusEnum.True">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提款金额类型"></el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Form } from "@/api/system/currency";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";

const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    if (props.data) {
      title.value = "编辑";
      formData.value = { ...props.data };
    } else {
      title.value = "新增";
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});
const rules = {};

const formRef = ref<FormInstance>();

function submitHandler() {}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
