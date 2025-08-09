<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('shouYeShiFouXuYaoD')">
      <el-switch v-model="getI('index_is_login').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('shouYeQiangZhiDanCh')">
      <el-switch v-model="getI('index_force_notice').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('danChuangGongGao')">
      <el-button type="primary" @click="visible[0] = true">{{ $t("bianJiGongGao") }}</el-button>
    </el-form-item>
    <el-form-item :label="$t('shouYeXianShiJiaShu')">
      <el-switch v-model="getI('is_show_fake_data').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('shouYeXianShiHangQi')">
      <el-switch v-model="getI('index_show_market_data').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('shouYeShiFouZhanShi')">
      <el-switch v-model="getI('index_video_is_show').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('shouYeShiPinDiZhi')">
      <el-input v-model="getI('index_video_url').values" />
    </el-form-item>
    <el-form-item :label="$t('shouYeDingBuTiShiL')">
      <el-input v-model="getI('home_top_tips_name').values" />
    </el-form-item>

    <el-form-item :label="$t('shouYeDingBuTiShiL_0')">
      <el-input v-model="getI('home_top_tips_url').values" />
    </el-form-item>

    <el-form-item :label="$t('baiPiShuDiZhi')">
      <uploadPart v-model="getI('white_paper_url').values" type="files" />
    </el-form-item>

    <el-form-item :label="$t('shouYeGunDongHuiYua')">
      <el-input-number v-model="getI('index_user_income_min').values" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('shouYeGunDongHuiYua_0')">
      <el-input-number v-model="getI('index_user_income_max').values" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('shouYeLeiJiLiRun')">
      <el-input-number v-model="getI('index_profit_fake_num').values" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('leiJiLiRunZengChang')">
      <el-input-number v-model="getI('index_profit_fake_increase_low').values" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('leiJiLiRunZengChang_0')">
      <el-input-number v-model="getI('index_profit_fake_increase_up').values" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('xiTongAnQuanYunHang')">
      <el-date-picker v-model="getI('start_operation_time').values" type="date" />
    </el-form-item>
  </el-form>
  <explain v-model="visible[0]" :data="getI('index_notice_content')" />
</template>

<script setup lang="ts">
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
import explain from "./parts/explain.vue";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false]);
const groupLevelOptions = [
  { label: $t("quanBu"), value: 0 },
  { label: $t("erJi"), value: 2 },
  { label: $t("sanJi"), value: 3 },
  { label: $t("siJi"), value: 4 },
  { label: $t("wuJi"), value: 5 },
  { label: $t("liuJi"), value: 6 },
];
</script>

<style></style>
