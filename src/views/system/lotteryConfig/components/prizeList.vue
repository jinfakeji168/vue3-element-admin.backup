<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <el-form ref="formRef" :model="formData[key]" label-width="100px">
      <el-form-item label="抽奖说明" prop="" v-for="item of formData[key]">
        <e-input v-model="item.prize_id" placeholder="请输入抽奖说明" />
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
import api, { type Form } from "@/api/system/lotteryConfig";
import { FormInstance } from "element-plus";

const props = defineProps<{
  data: Form;
  key: "lottery_invite_prize_set" | "lottery_recharge_prize_set" | "lottery_register_prize_set";
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    title.value = "抽奖说明";
    formData.value = { ...props.data };
    console.log("🚀 ~ props.data:", props.data);
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finally"]);
async function submitHandler() {
  await api.setLotteryConfigTranslation({
    lottery_remark_original: unref(formData).lottery_remark_original,
    lottery_remark_translation: unref(formData).lottery_remark_translation?.filter((item: TranslationItem) => item.content),
  });
  visible.value = false;
  emit("finally");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>
