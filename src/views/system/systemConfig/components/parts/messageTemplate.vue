<template>
  <el-dialog v-model="visible" :title="title" width="90%" @closed="closeHandler">
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="1">
        <content v-model="formData" type="public" :disabled="!hasEditAuth" :keys="['title_original', 'title_translation']" style="height: 70vh" />
      </el-tab-pane>
      <el-tab-pane label="内容" :name="2">
        <div class="flex flex-col">
          <span>这是会员注册成功后的自动消息模板。模板中的花括号{}是占位符变量，实际发送时会自动替换为真实的用户信息：</span>
          <span>{account} → 替换为用户的注册账号/用户名</span>
          <span>{register_time} → 替换为具体的注册时间戳</span>
          <span>{register_ip} → 替换为用户的注册IP地址</span>
        </div>
        <content v-model="formData" :disabled="!hasEditAuth" :keys="['content_original', 'content_translation']" style="height: 70vh" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing") }}</el-button>
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
const currentIndex = ref(1);
const props = defineProps<{
  data: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    title.value = $t("shuoMing");
    formData.value = props.data.values;
    console.log("🚀 ~ formData.value:", formData.value);
    if (!Object.hasOwn(formData.value, "translation")) {
      formData.value = {
        original: "",
        translation: [],
      };
    }
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

    const data = { ...props.data, values: formData.value };

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
