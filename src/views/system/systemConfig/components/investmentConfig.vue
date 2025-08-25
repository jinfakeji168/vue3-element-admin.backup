<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('touZiChanPinBenJin')">
      <el-radio-group v-model="getI('finance_capital_give_account').values">
        <el-radio v-for="item of store.accountTypeList" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
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
