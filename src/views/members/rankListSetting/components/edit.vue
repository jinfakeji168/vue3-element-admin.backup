<template>
  <el-dialog :title="props.data?.id ? '编辑榜单' : '新增榜单'" v-model="visible" @close="closeHandler" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <uploadPart v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="收入" prop="income">
        <el-input v-model="form.income" placeholder="请输入收入" />
      </el-form-item>
      <el-form-item label="榜单类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option v-for="item in type_options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排名" prop="ranking">
        <el-input-number v-model="form.ranking" :min="1" placeholder="请输入排名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeHandler">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitHandler">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/members/rankListSetting";
import type { FormInstance } from "element-plus";

/** 类型选项 */
const type_options = [
  { value: 1, label: "周榜" },
  { value: 2, label: "月榜" },
  { value: 3, label: "年榜" },
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
  user_name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  ranking: [{ required: true, message: "请输入排名", trigger: "blur" }],
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
