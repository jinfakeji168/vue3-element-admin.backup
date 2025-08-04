<template>
  <el-card class="el_card" v-loading="loading[0]">
    <template #header>
      <h4 style="margin: 0">{{ $t("yongHuXieYi") }}</h4>
    </template>
    <content v-model="formData" :keys="['original', 'translation']" @init-before="initBefore" :disabled="!hasEditAuth" />
    <template #footer>
      <el-button class="button" type="primary" @click="submitHandler" v-hasPerm="['userPolicy:editExplain']" :loading="loading[1]">{{ $t("baoCun") }}</el-button>
      <el-button class="button" type="primary" @click="resertHandler" :disabled="!hasChange">{{ $t("zhongZhi") }}</el-button>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import api, { type policyForm } from "@/api/system/policy";
import { hasAuth } from "@/plugins/permission";
const hasEditAuth = hasAuth("userPolicy:editExplain");
const formData = ref<policyForm>({});
const loading = ref<boolean[]>([]);

let backupData = ref<policyForm>();

const hasChange = computed(() => {
  const res = unref(formData).translation?.some((val, index) => {
    const result = val.content != unref(backupData)?.translation![index].content;
    return result;
  });
  return res || unref(formData).original != unref(backupData)?.original;
});
function initBefore() {
  nextTick(() => {
    // 备份数据要在dom渲染完成之后运行，因为content会初始化formData
    backupData.value = JSON.parse(JSON.stringify(unref(formData)));
  });
}

async function getPolicy() {
  loading.value[0] = true;
  const res = await api.getUserPolicy();
  formData.value = res;
  loading.value[0] = false;
}
async function submitHandler() {
  loading.value[1] = true;
  try {
    await api.updatePolicy({ ...unref(formData), type: 1 });
  } finally {
    loading.value[1] = false;
  }
}
function resertHandler() {
  ElMessageBox.confirm($t("queDingZhongZhiMa"), {
    type: "warning",
  }).then(() => {
    formData.value = JSON.parse(JSON.stringify(backupData));
  });
}
getPolicy();
</script>

<style lang="scss" scoped>
.el_card {
  height: 100%;
  overflow: auto;
  :deep(.el-card__footer) {
    position: sticky;
    bottom: 0;
    background-color: #fff;
  }
}
</style>
