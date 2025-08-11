<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item :label="$t('biaoTi')" prop="title">
        <el-input v-model="formData.title" :placeholder="$t('qingShuRuBiaoTi')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/members/groupingSetting";
import { FormInstance } from "element-plus";

/**
 * 组件属性定义
 */
const props = defineProps<{
  data?: Form;
}>();

const visible = defineModel<boolean>();

/** 表单标题 */
const title = ref("");

// /** 监听弹窗显示 */
watch(
  visible,
  () => {
    if (!visible.value) return;
    if (props.data) {
      title.value = $t("bianJiFenZu");
      formData.value = { ...props.data };
    } else {
      title.value = $t("xinZengFenZu");
      formData.value = {};
    }
  },
  {
    flush: "post",
  }
);

/** 表单数据 */
const formData = ref<Form>({});

/** 表单校验规则 */
const rules = {
  title: [{ required: true, message: $t("qingShuRuBiaoTi_0"), trigger: "blur" }],
};

import { useStore } from "@/store/modules/common";
const store = useStore();

const formRef = ref<FormInstance>();
const emits = defineEmits(["finish"]);
const loading = ref(false);
/** 提交处理 */
async function submitHandler() {
  const valid = await unref(formRef)?.validate();
  loading.value = true;
  if (!valid) return;
  try {
    if (props.data) {
      await api.edit(formData.value);
    } else {
      await api.add(formData.value);
    }
  } finally {
    loading.value = false;
  }
  visible.value = false;
  store.updateGroupList();
  emits("finish");
}

/** 关闭处理 */
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
