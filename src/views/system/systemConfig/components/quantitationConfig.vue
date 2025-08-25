<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('yongHuDuanZhanShiSh')">
      <el-radio-group v-model="getI('task_show_income_type').values">
        <el-radio :label="1">{{ $t("xianShiDanCiLiangHu") }}</el-radio>
        <el-radio :label="2">{{ $t("xianShiMeiRiLiangHu") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="'VIP升级模式'">
      <el-tooltip effect="dark" placement="right" :content="'手动升级，需要用户在满足VIP要求后支付费用，量化天数到期返还或者设置不返还'">
        <el-radio-group v-model="getI('vip_upgrade_mode').values">
          <el-radio :label="1">自动升级</el-radio>
          <el-radio :label="2">手动升级</el-radio>
        </el-radio-group>
      </el-tooltip>
    </el-form-item>
    <el-form-item :label="$t('ziDongKaiQiShengJi')">
      <el-tooltip effect="dark" placement="right" :content="$t('dengJiSheZhiYaoQing')">
        <el-switch v-model="getI('auto_is_upgrade_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>
    <el-form-item :label="$t('liangHuaBiZhong')">
      <el-tooltip effect="dark" placement="right">
        <template #content>{{ $t("buSheZhiDaiBiaoSui") }}</template>
        <el-select v-model="getI('quan_currency').values" :placeholder="$t('qingXuanZeLiangHuaB')" clearable style="width: 300px">
          <el-option v-for="item in store.tradeList" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-tooltip>
    </el-form-item>
    <el-form-item :label="$t('liangHuaGuoChengShi')">
      <el-tooltip effect="dark" placement="right" :content="$t('kaiShiLiangHuaDaoJi')">
        <el-input-number v-model="getI('quan_time').values" :min="1" :placeholder="$t('qingShuRuLiangHuaGu')" />
      </el-tooltip>
    </el-form-item>
    <el-form-item :label="$t('liangHuaZhongZhiFang')">
      <el-radio-group v-model="getI('task_reset_type').values">
        <el-radio :label="1">{{ $t("jueDui_24XiaoShi") }}</el-radio>
        <el-radio :label="2">{{ $t("mouGeShiJianDianZho") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="getI('task_reset_type').values === 2">
      <el-form-item :label="$t('liangHuaZhongZhiShi')">
        <el-time-picker v-model="getI('quant_reset_time').values" format="HH:mm" value-format="HH:mm" :placeholder="$t('qingXuanZeLiangHuaZ')" />
      </el-form-item>
    </template>
    <el-form-item :label="$t('shiFouKaiQiTiYanJi')">
      <el-tooltip effect="dark" placement="right" :content="$t('kaiQiHouTiYanJinKe')">
        <el-switch v-model="getI('is_show_experience').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>

    <el-form-item :label="$t('zhuCeZengSongTiYan')">
      <el-input-number v-model="getI('register_give_experience').values" :min="0" :placeholder="$t('qingShuRuZhuCeZeng')" />
    </el-form-item>

    <el-form-item :label="$t('tiYanJinYouXiaoQiT')">
      <el-input-number v-model="getI('experience_validity_period').values" :min="1" :placeholder="$t('qingShuRuTiYanJinY')" />
    </el-form-item>

    <el-form-item :label="$t('tiYanJinShiFouCanY')">
      <el-switch v-model="getI('experience_is_level').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('yongHuShouChongHouS')">
      <el-switch v-model="getI('recharge_empty_experience').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('liangHuaGaiShuaiZhi')">
      <el-tooltip effect="dark" placement="right">
        <template #content>
          <div>{{ $t("1AnGaiShuaiZhiKong") }}</div>
          <div>{{ $t("2AnGaiShuaiZhiZheK") }}</div>
        </template>
        <el-radio-group v-model="getI('quan_income_probability_type').values">
          <el-radio :label="1">{{ $t("anGaiShuaiZhiKongZh") }}</el-radio>
          <el-radio :label="2">{{ $t("anGaiShuaiZhiZheKou") }}</el-radio>
        </el-radio-group>
      </el-tooltip>
    </el-form-item>
    <el-form-item :label="$t('liangHuaShouYiZhang')">
      <el-radio-group v-model="getI('task_brokerage_account').values">
        <el-radio v-for="item of store.accountTypeList" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('shengJiShiFouZhongZ')">
      <el-tooltip effect="dark" placement="right" :content="$t('biRuHuiYuanChongZhi')">
        <el-switch v-model="getI('is_upgrade_reset_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>

    <el-form-item :label="$t('zuiHouYiCiLiangHua')">
      <el-switch v-model="getI('last_task_clear_level').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('daoQiShiFouGuiHuan')">
      <el-switch v-model="getI('last_task_clear_level_type').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('guiHuanJieSuoBenJin')">
      <el-radio-group v-model="getI('level_unlock_return_type').values">
        <el-radio v-for="item of store.accountTypeList" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('shiFouKaiQiLiangHua')">
      <el-tooltip effect="dark" placement="right" :content="$t('guanBiHouQuanTiYong')">
        <el-switch v-model="getI('is_distribute_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
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
const visible = ref([false, false]);
</script>

<style></style>
