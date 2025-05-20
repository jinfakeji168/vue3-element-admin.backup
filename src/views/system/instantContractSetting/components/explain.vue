<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <content v-model="formData" :disabled="!hasEditAuth" :keys="['contract_remark_original', 'contract_remark_translation']" style="height: 70vh" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/instantContractSetting";
import { FormInstance } from "element-plus";
import content from "@/components/WangEditor/content.vue";
import { hasAuth } from "@/plugins/permission";
const hasEditAuth = hasAuth("lotteryConfig:explain:edit");

const props = defineProps<{
  data: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    title.value = "合约说明";
    formData.value = { ...props.data };
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finally"]);
async function submitHandler() {
  await api.setContractRemark({
    contract_remark_original: unref(formData).contract_remark_original,
    contract_remark_translation: unref(formData).contract_remark_translation?.filter((item: TranslationItem) => item.content),
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
