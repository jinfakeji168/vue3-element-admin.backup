<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('mingCheng')" prop="title">
        <el-input v-model="formData.title" :placeholder="$t('qingShuRuMingCheng')" />
      </el-form-item>
      <el-form-item :label="$t('tuPian')" prop="icon">
        <upload-part v-model="formData.img_url"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('qiYongZhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('xianShiPaiXu')" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
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
import api, { type Form } from "@/api/system/carouselSetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs, FormInstance } from "element-plus";
import Content from "@/components/WangEditor/content.vue";
import systemConfig from "@/api/system/systemConfig";

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
      formData.value = { sort: 1, status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const loading = ref(false);
const formData = ref<Form>({});

const rules = {
  push_time: { required: true, message: $t("qingXuanZeFaBuShiJ"), trigger: "blur" },
};
const formRef = ref<FormInstance>();

import { useStore } from "@/store/modules/common";
const commonStore = useStore();
const emits = defineEmits(["finish"]);
async function submitHandler() {
  const valid = await unref(formRef)?.validate();
  if (!valid) return;
  const enableLogoGoogle = await commonStore.keyByConfigValue("update_banner_is_google");
  if (enableLogoGoogle == 1) {
    const res = await ElMessageBox.prompt($t("shuRuGuGeYanZhengM"), {});
    if (res.action == "confirm" && res.value) {
      await systemConfig.verifyGoogleAuth(res.value);
    } else {
      return;
    }
  }
  loading.value = true;
  try {
    if (props.data) {
      await api.edit(unref(formData));
    } else {
      await api.add(unref(formData));
    }
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emits("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}

const currentIndex = ref(0);
</script>

<style lang="scss" scoped>
.content {
  height: 70vh;
  overflow: auto;
}
</style>
