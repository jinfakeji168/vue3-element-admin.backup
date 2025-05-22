<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type" :disabled="isEdit">
          <el-radio :label="1">拼手气红包</el-radio>
          <el-radio :label="2">普通红包</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="红包金额" prop="red_amount">
        <el-input-number v-model="formData.red_amount" :min="0" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="红包总数" prop="red_num">
        <el-input-number v-model="formData.red_num" :min="1" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="活动状态" prop="state" v-if="isEdit">
        <el-radio-group v-model="formData.state">
          <el-radio :label="1">未开始</el-radio>
          <el-radio :label="2">进行中</el-radio>
          <el-radio :label="3">已结束</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <el-date-picker v-model="formData.time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
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
import api, { type Form } from "@/api/system/redPacket";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs, FormInstance } from "element-plus";

const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
const isEdit = ref(false);
watch(
  visible,
  () => {
    if (!visible.value) return;
    if (props.data) {
      title.value = "编辑";
      formData.value = { ...props.data, time: [dayjs.unix(<number>props.data.start_time), dayjs.unix(<number>props.data.end_time)] };
      isEdit.value = true;
    } else {
      title.value = "新增";
      isEdit.value = false;
      formData.value = { type: 1 };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({
  time: [],
});

const rules = {
  red_amount: [{ required: true, message: "填写金额", trigger: "blur" }],
  red_num: [{ required: true, message: "填写总数", trigger: "blur" }],
  time: [{ required: true, message: "选择时间", trigger: "blur" }],
};

const formRef = ref<FormInstance>();

const emits = defineEmits(["finish"]);
async function submitHandler() {
  const valid = await unref(formRef)?.validate();
  if (!valid) return;
  formData.value.start_time = dayjs(formData.value.time![0]).unix();
  formData.value.end_time = dayjs(formData.value.time![1]).unix();
  if (props.data) {
    await api.edit(formData.value);
  } else {
    await api.add(formData.value);
  }
  visible.value = false;

  emits("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style lang="scss" scoped>
.tabBar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .header {
    display: flex;
    gap: 8px;
    & > div {
      padding: 10px 20px;
      font-size: 16px;
      color: black;
      cursor: pointer;
    }
    .checked {
      color: darkgreen;
      border-bottom: 2px solid darkgreen;
    }
  }
}
</style>
