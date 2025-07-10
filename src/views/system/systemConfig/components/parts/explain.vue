<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <content v-model="formData" :disabled="!hasEditAuth" :keys="['original', 'translation']" style="height: 70vh" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from "element-plus";
import content from "@/components/WangEditor/content.vue";
import systemConfig, { type Form } from "@/api/system/systemConfig";

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
    title.value = "说明";
    formData.value = props.data.values;
    console.log("🚀 ~ formData.value:", formData.value);
    if (!Object.hasOwn(formData.value, "translation")) {
      formData.value = {
        original: "",
        translation: [],
      };
    }
    console.log("🚀 ~ props.data:", formData.value);
  },
  {
    flush: "post",
  }
);
const formData = ref<typeof props.data.values>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
async function submitHandler() {
  await formRef.value?.validate();
  try {
    loading.value = true;

    const data = { ...props.data };

    const res = await systemConfig.setConfig([data]);
  } finally {
    loading.value = false;
  }
  visible.value = false;
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>
