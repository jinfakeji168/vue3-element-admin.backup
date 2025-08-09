<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('trc20GuiJiDiZhi')">
      <el-input v-model="getI('collection_wallet').values" :placeholder="$t('qingShuRuTrc20GuiJi')" />
    </el-form-item>
    <el-form-item :label="$t('bep20GuiJiDiZhi')">
      <el-input v-model="getI('bep20_collection_wallet').values" :placeholder="$t('qingShuRuBep20GuiJi')" />
    </el-form-item>
  </el-form>

  <explain v-model="visible[0]" :data="getI('withdraw_instructions_settings').values" />
  <withdraw-auto-trigger v-model="visible[1]" />
</template>

<script setup lang="ts">
import explain from "./parts/explain.vue";
import withdrawAutoTrigger from "./parts/withdrawAutoTrigger.vue";
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false, false]);
</script>

<style></style>
