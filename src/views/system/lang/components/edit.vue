<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('qianDuanXianShiMing')" prop="display_name">
        <el-input v-model="formData.display_name" :placeholder="$t('qingShuRuMingCheng')" />
      </el-form-item>
      <el-form-item :label="$t('yuYanMingCheng')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('qingShuRuMingCheng')" />
      </el-form-item>
      <el-form-item :label="$t('yuYanBianMa')" prop="mark">
        <el-input v-model="formData.mark" :placeholder="$t('qingShuRuBianMa')" />
      </el-form-item>

      <el-form-item :label="$t('qiYongZhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('paiXu')" prop="sort">
        <el-input-number v-model="formData.sort" controls-position="right" :min="0" style="width: 100px" />
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
      title.value = $t("bianJi");
      formData.value = { ...props.data };
    } else {
      title.value = $t("xinZeng");
      formData.value = { status: StatusEnum.False, sort: 1 };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  display_name: [{ required: true, message: $t("qingShuRuQianDuanXi"), trigger: "blur" }],
  name: [{ required: true, message: $t("qingShuRuYuYanMing"), trigger: "blur" }],
  mark: [{ required: true, message: $t("qingShuRuYuYanBian"), trigger: "blur" }],
  status: [{ required: true, message: $t("qingXuanZeZhuangTai"), trigger: "blur" }],
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
