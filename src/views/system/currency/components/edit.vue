<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="名称" prop="show_name">
        <el-input v-model="formData.show_name" placeholder="" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item label="最小提现金额" prop="min_withdraw">
        <el-input-number v-model="formData.min_withdraw" :min="0" />
      </el-form-item>
      <el-form-item label="最大提现金额" prop="max_withdraw">
        <el-input-number v-model="formData.max_withdraw" :min="0" />
      </el-form-item>
      <el-form-item label="提现手续费(%)" prop="withdraw_fee_ratio">
        <el-input v-model="formData.withdraw_fee_ratio" type="text" :formatter="parserHandler" :parser="parserHandler" />
      </el-form-item>
      <el-form-item label="最大手续费(当前币种单位)" prop="max_withdraw_fee">
        <el-input-number v-model="formData.max_withdraw_fee" :min="0" />
      </el-form-item>
      <el-form-item label="最小手续费(当前币种单位)" prop="min_withdraw_fee">
        <el-input-number v-model="formData.min_withdraw_fee" :min="0" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="充值" porp="open_recharge">
        <el-radio-group v-model="formData.open_recharge">
          <el-radio :label="StatusEnum.False">正常</el-radio>
          <el-radio :label="StatusEnum.True">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提现" prop="open_withdraw">
        <el-radio-group v-model="formData.open_withdraw">
          <el-radio :label="StatusEnum.False">正常</el-radio>
          <el-radio :label="StatusEnum.True">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提款金额类型" prop="withdraw_type">
        <el-radio-group v-model="formData.withdraw_type">
          <el-radio :label="1">用户输入</el-radio>
          <el-radio :label="2">固定金额</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提款金额配置" prop="withdraw_config" v-if="formData.withdraw_type == 2">
        <el-input v-model="formData.withdraw_config" />
      </el-form-item>
      <el-form-item label="汇率" prop="exchange_rate">
        <el-input v-model="formData.exchange_rate" />
      </el-form-item>
      <el-form-item label="商户号" prop="merchant_num">
        <el-input v-model="formData.merchant_num" />
      </el-form-item>
      <el-form-item label="商户key" prop="merchant_key">
        <el-input v-model="formData.merchant_key" />
      </el-form-item>
      <el-form-item label="充值地址" prop="recharge_address">
        <el-input v-model="formData.recharge_address" />
      </el-form-item>
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
import api, { type Form } from "@/api/system/currency";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
import { parserHandler } from "@/utils/index";
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
      formData.value = { withdraw_type: 1, open_recharge: StatusEnum.False, open_withdraw: StatusEnum.False, status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  show_name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  min_withdraw: [{ required: true, message: "最小提现金额不能为空", trigger: "blur" }],
  max_withdraw: [{ required: true, message: "最大提现金额不能为空", trigger: "blur" }],
  withdraw_fee_ratio: [{ required: true, message: "提现手续费不能为空", trigger: "blur" }],
  max_withdraw_fee: [{ required: true, message: "最大手续费(当前币种单位)不能为空", trigger: "blur" }],
  min_withdraw_fee: [{ required: true, message: "最小手续费(当前币种单位)不能为空", trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const emit = defineEmits(["finally"]);
function submitHandler() {
  unref(formRef)?.validate(async (valid) => {
    if (!valid) return;
    console.log(formData.value);
    if (props.data) {
      await api.edit(formData.value);
    } else {
      await api.add(formData.value);
    }
    visible.value = false;
    emit("finally");
  });
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
