<template>
  <el-form label-width="240px">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('chuKuanZhangHu')" name="1">
        <el-form-item :label="$t('trc20ChuKuanZhangHu')">
          <el-input v-model="getI('payment_wallet').values" :placeholder="$t('qingShuRuTrc20ChuKu')" />
        </el-form-item>
        <el-form-item :label="$t('bep20ChuKuanZhangHu')">
          <el-input v-model="getI('bep20_payment_wallet').values" :placeholder="$t('qingShuRuBep20ChuKu')" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item :title="$t('tiXianPeiZhi')" name="2">
        <el-form-item :label="$t('tiXianKaiGuan')">
          <el-switch v-model="getI('extract_switch').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('chongZhiDaYuDuoShao')">
          <el-input-number v-model="getI('recharge_num_is_withdrawal').values" :min="0" :placeholder="$t('chongZhiDaYuDuoShao_0')" />
        </el-form-item>
        <el-form-item :label="$t('yongHuChuKuanGongNe')">
          <el-radio-group v-model="getI('withdrawal_activation_type').values">
            <el-radio :label="1">{{ $t("shengJiWeiVip") }}</el-radio>
            <el-radio :label="2">{{ $t("shengJiWeiVipHuoGou") }}</el-radio>
            <el-radio :label="3">{{ $t("zhuCeJiJiHuo") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('meiRiTiXianCiShu')">
          <el-input-number v-model="getI('extract_num_day').values" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('zhiYunXuYiGeTiXian')">
          <el-switch v-model="getI('extract_address_channel').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('yunXuXiuGaiQuKuanD')">
          <el-switch v-model="getI('is_change_withdrawal_address').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('yunXuZhongFuQuKuan')">
          <el-switch v-model="getI('is_repeat_withdrawal_address').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <!-- <el-form-item :label="$t('shouCiTiXianXuLian')">
          <el-switch v-model="getI('extract_input_contact').values" :active-value="1" :inactive-value="2" />
        </el-form-item> -->
        <el-form-item :label="$t('ziDongChuKuanKaiGua')">
          <el-switch v-model="getI('auto_payment').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('ziDongChuKuanAnQuan')">
          <el-input-number v-model="getI('auto_payment_safety_value').values" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('zuiXiaoTiXianPeiZhi')">
          <el-tooltip :content="$t('xuanZeQuanJuYouChon')" placement="right">
            <el-radio-group v-model="getI('min_extract_config').values">
              <el-radio :label="1">{{ $t("quanJu") }}</el-radio>
              <el-radio :label="2">{{ $t("juBu") }}</el-radio>
            </el-radio-group>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('quKuanShuoMingSheZh')">
          <el-button type="primary" @click="visible[0] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('tiXianZiDongChuFaS')">
          <el-button type="primary" @click="visible[1] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item :title="$t('shouXuFeiSheZhi')" name="3">
        <el-form-item :label="$t('mianShouXuFeiBiShu')">
          <el-input-number v-model="getI('free_fee_num').values" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('mianShouXuFeiBiShu_0')">
          <el-radio v-model="getI('extract_free_fee_type').values" :label="1">{{ $t("meiRiCiShu") }}</el-radio>
          <el-radio v-model="getI('extract_free_fee_type').values" :label="2">{{ $t("zongCiShu") }}</el-radio>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <explain v-model="visible[0]" :data="getI('withdraw_instructions_settings')" />
  <withdraw-auto-trigger v-model="visible[1]" />
</template>

<script setup lang="ts">
import explain from "./parts/explain.vue";
import withdrawAutoTrigger from "./parts/withdrawAutoTrigger.vue";
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const activeNames = ["1", "2", "3"];

const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false, false]);
</script>

<style></style>
