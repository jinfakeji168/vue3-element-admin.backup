<template>
  <el-dialog :title="props.data?.id ? $t('bianJiBangDan') : $t('xinZengBangDan')" v-model="visible" @close="closeHandler" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item :label="$t('login.username')" prop="user_name">
        <el-input v-model="form.user_name" :placeholder="$t('login.message.username.required')" />
      </el-form-item>
      <el-form-item :label="$t('touXiang')" prop="avatar">
        <uploadPart v-model="form.avatar" />
      </el-form-item>
      <el-form-item :label="$t('shouRu')" prop="income">
        <el-input v-model="form.income" :placeholder="$t('qingShuRuShouRu')" />
      </el-form-item>
      <el-form-item :label="$t('bangDanLeiXing')" prop="type">
        <el-select v-model="form.type" :placeholder="$t('qingXuanZeLeiXing')">
          <el-option v-for="item in type_options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('paiMing')" prop="ranking">
        <el-input-number v-model="form.ranking" :min="1" :placeholder="$t('qingShuRuPaiMing')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeHandler">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitHandler">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/members/rankListSetting";
import type { FormInstance } from "element-plus";

/** 类型选项 */
const type_options = [
  { value: 1, label: $t("zhouBang") },
  { value: 2, label: $t("yueBang") },
  { value: 3, label: $t("nianBang") },
];

const props = defineProps<{
  data?: Form;
}>();

const emit = defineEmits(["finish"]);

const visible = defineModel<boolean>();

/** 表单ref */
const formRef = ref<FormInstance>();

/** 提交状态 */
const submitLoading = ref(false);

/** 表单数据 */
const form = reactive<Form>({
  user_name: "",
  avatar: "",
  income: "",
  type: 1,
  ranking: 1,
});

/** 表单校验规则 */
const rules = {
  user_name: [{ required: true, message: $t("login.message.username.required"), trigger: "blur" }],
  type: [{ required: true, message: $t("qingXuanZeLeiXing"), trigger: "change" }],
  ranking: [{ required: true, message: $t("qingShuRuPaiMing_0"), trigger: "blur" }],
};

/** 关闭处理 */
function closeHandler() {
  unref(formRef)?.resetFields();
  unref(formRef)?.clearValidate();
  visible.value = false;
}

/** 提交处理 */
async function submitHandler() {
  // ...提交逻辑实现
  await unref(formRef)?.validate();
  try {
    submitLoading.value = true;
    if (props.data?.id) {
      await api.edit(form);
    } else {
      await api.add(form);
    }
    emit("finish");
    closeHandler();
  } finally {
    submitLoading.value = false;
  }
}

/** 监听编辑数据更新 */
watch(visible, (val) => {
  if (val) {
    nextTick(() => {
      Object.assign(form, props.data);
    });
  }
});
</script>

<style></style>
