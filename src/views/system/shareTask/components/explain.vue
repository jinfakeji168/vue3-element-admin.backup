<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <content v-model="contentData" />
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
import { FormInstance } from "element-plus";
import langApi, { contentModel } from "@/api/system/lang";
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
    formData.value = { ...props.data };
    contentData.value = {
      original: "",
      translation: [],
    };
    getLangOptions();
    currentEditIndex.value = -1;
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finally"]);
function submitHandler() {
  contentData.value.translation = contentData.value.translation?.filter((val) => val.content);
  api.updateRemark({
    id: unref(formData).id,
    remark_original: unref(contentData).original,
    remark_translation: unref(contentData).translation,
  });
  visible.value = false;
  emit("finally");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}

const currentEditIndex = ref(-1);
let temp: any;
async function getOptions() {
  temp = await langApi.getOpenOptions();
}
getOptions();

const contentData = ref<contentModel>({
  original: "",
  translation: [],
});
async function getLangOptions() {
  //初始化remark_translation
  contentData.value.original = unref(formData).remark_original || "";
  for (let item of temp) {
    const result = unref(formData).remark_translation?.findIndex((val) => val.lang == item.mark);
    if (result !== undefined && result >= 0) {
      unref(contentData).translation.push({
        lang: item.mark || "",
        name: item.name || "",
        content: unref(formData).remark_translation![result].content || "",
      });
    } else {
      unref(contentData).translation?.push({
        lang: item.mark || "",
        name: item.name || "",
        content: "",
      });
    }
  }
}
</script>
