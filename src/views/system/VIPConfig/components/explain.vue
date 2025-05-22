<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <content v-model="formData" :keys="['remark_original', 'remark_translation']" style="height: 70vh; overflow: auto" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/VipConfig";
import { FormInstance } from "element-plus";
import content from "@/components/WangEditor/content.vue";
const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    title.value = "充值说明";
    formData.value = JSON.parse(JSON.stringify(props.data));
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
async function submitHandler() {
  await api.updateRemark({
    id: unref(formData).id,
    remark_original: unref(formData).remark_original,
    remark_translation: unref(formData).remark_translation?.filter((item: TranslationItem) => item.content),
  });
  visible.value = false;
  emit("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>
