<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('shiFouXianShiXiaZai')">
      <el-switch v-model="getI('package_app_download_show_switch').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('xiaZaiDiZhiUrl')">
      <el-input v-model="getI('app_download_url').values" :placeholder="$t('keHuDuanDianJiXiaZ')" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
</script>

<style></style>
