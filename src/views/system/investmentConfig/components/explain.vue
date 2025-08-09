<template>
  <el-dialog v-model="visible" title="$t('jieShao')" width="90%" @closed="closeHandler">
    <el-tabs type="border-card">
      <el-tab-pane label="$t('biaoTi')">
        <content v-model="formData" :keys="['title_original', 'title_translation']" type="public" style="height: 60vh" />
      </el-tab-pane>
      <el-tab-pane label="$t('shuoMing')">
        <content v-model="formData" :keys="['remark_original', 'remark_translation']" style="height: 60vh" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">{{ $t("queDing") }}</el-button>
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/investmentConfig";
import { FormInstance } from "element-plus";
import content from "@/components/WangEditor/content.vue";
const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
watch(
  visible,
  () => {
    if (!visible.value) return;
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
    title_original: unref(formData).title_original,
    title_translation: unref(formData).title_translation?.filter((item: TranslationItem) => item.content),
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
