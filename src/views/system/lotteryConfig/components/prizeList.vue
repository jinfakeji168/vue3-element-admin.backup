<template>
  <el-dialog v-model="visible" :title="title" width="70%" @closed="closeHandler">
    <el-form class="el_form" ref="formRef" :model="formData[_key]" label-width="100px">
      <el-form-item :label="`奖项${index + 1}`" prop="" v-for="(item, index) of formData[_key]">
        <div class="input_row">
          <div class="input_item">
            <span>最小金额/U</span>
            <el-input class="el_input" :disabled="disabled" v-model="item.min_prize_num" placeholder="请输入最小金额" />
          </div>
          <div class="input_item">
            <span>最大金额/U</span>
            <el-input class="el_input" :disabled="disabled" v-model="item.prize_id" placeholder="请输入最大金额" />
          </div>
          <div class="input_item">
            <span>概率/%</span>
            <el-input-number class="el_input" :disabled="disabled" v-model="item.probability" :min="0" :max="100" placeholder="请输入概率" />
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler" :disabled="disabled">保存</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/lotteryConfig";
import { FormInstance } from "element-plus";

const props = defineProps<{
  data: Form;
  _key: "lottery_invite_prize_set" | "lottery_recharge_prize_set" | "lottery_register_prize_set";
  disabled: boolean;
  title: string;
}>();
const visible = defineModel<boolean>();
watch(
  visible,
  () => {
    if (!visible.value) return;
    formData.value = { ...props.data };
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
async function submitHandler() {
  await api.setLotteryConfig(unref(formData));
  visible.value = false;
  emit("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>
<style scoped lang="scss">
.el_form {
  max-height: 70vh;
  overflow-y: auto;
  .input_row {
    display: flex;
    gap: 10px;
    .input_item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .el_input {
      width: 150px;
    }
  }
}
</style>
