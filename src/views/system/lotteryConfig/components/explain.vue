<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <content v-model="formData" v-model:visible="visible" :keys="['lottery_remark_original', 'lottery_remark_translation']" />
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
import content from "@/components/WangEditor/content.vue";
const props = defineProps<{
  data: Form;
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
