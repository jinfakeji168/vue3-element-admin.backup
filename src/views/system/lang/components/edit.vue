<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="语言名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" disabled />
      </el-form-item>
      <el-form-item label="语言编码" prop="mark">
        <el-input v-model="formData.mark" placeholder="请输入编码" />
      </el-form-item>

      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" controls-position="right" :min="0" style="width: 100px" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/lang";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    if (props.data) {
      title.value = "编辑";
      formData.value = { ...props.data };
    } else {
      title.value = "新增";
      formData.value = { status: StatusEnum.False, sort: 1 };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  name: [{ required: true, message: "请输入语言名称", trigger: "blur" }],
  mark: [{ required: true, message: "请输入语言编码", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
function submitHandler() {
  unref(formRef)?.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (props.data) {
        await api.edit(formData.value);
      } else {
        await api.add(formData.value);
      }
      visible.value = false;
      emit("finish");
    } finally {
      loading.value = false;
    }
  });
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
