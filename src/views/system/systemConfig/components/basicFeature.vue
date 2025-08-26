<template>
  <el-form label-width="300px">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('wangZhanXinXi')" name="1">
        <el-form-item :label="$t('zhuTiYangShi')">
          <el-select v-model="getI('website_skin_style').values" style="width: 300px">
            <el-option v-for="item of themeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('wangZhanLogo')">
          <uploadPart v-model="getI('website_logo').values" />
        </el-form-item>
        <el-form-item :label="$t('keFuLogo')">
          <uploadPart v-model="getI('website_operator_icon').values" />
        </el-form-item>
        <el-form-item :label="$t('wangZhanMingCheng')">
          <el-input v-model="getI('website_name').values" style="width: 300px" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item :title="$t('yongHuDuanPeiZhi')" name="2">
        <el-form-item :label="$t('yongHuDuanTuanDuiYo')">
          <el-select v-model="getI('client_show_spread_level').values" style="width: 300px">
            <el-option v-for="item of groupLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('yongHuDuanTuanDuiDa')">
          <el-select v-model="getI('client_proxy_team_show_level').values" style="width: 300px">
            <el-option v-for="item of groupLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('yongHuDuanTuanDuiTo')">
          <el-radio-group v-model="getI('client_user_team_count_time').values">
            <el-radio :label="1">{{ $t("anXiTongShiQu") }}</el-radio>
            <el-radio :label="2">{{ $t("anYongHuShiQu") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('yongHuDuanShiFouKai')">
          <el-switch v-model="getI('client_google_secret_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('yongHuXieYiHeYinSi')">
          <el-switch v-model="getI('client_is_show_user_protocol').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('touZiGongNengShiFou')">
          <el-switch v-model="getI('client_invest_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('qianDuanMoRenYuYan')">
          <el-radio-group v-model="getI('client_system_default_lang_type').values">
            <el-radio :label="1">{{ $t("genJuYongHuSheBeiZ") }}</el-radio>
            <el-radio :label="2">{{ $t("genJuXiTongMoRenSh") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('qianDuanMoRenYuYan_0')" v-if="getI('client_system_default_lang_type').values == 2">
          <el-select v-model="getI('client_system_default_lang').values" style="width: 300px">
            <el-option v-for="item of store.langList" :key="item.mark" :label="item.name" :value="item.mark" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('qianDuanShouJiHaoMo')">
          <el-select v-model="getI('client_system_default_phone_code').values" style="width: 300px">
            <el-option v-for="item of photoCodeAreaOptions" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('salesmartlyLiaoTianCh')">
          <el-input v-model="getI('client_salesmartly').values" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item :title="$t('zhuanZhangPeiZhi')" name="3">
        <el-form-item :label="'量化账户可转入'">
          <el-checkbox-group v-model="getI('quant_transfer_targets').values">
            <el-checkbox v-for="item of store.accountTypeList.toSpliced(0, 1)" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="'佣金账户可转入'">
          <el-checkbox-group v-model="getI('brokerage_transfer_targets').values">
            <el-checkbox v-for="item of store.accountTypeList.toSpliced(1, 1)" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="'智能账户可转入'">
          <el-checkbox-group v-model="getI('smart_transfer_targets').values">
            <el-checkbox v-for="item of store.accountTypeList.toSpliced(2, 1)" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="'合约账户可转入'">
          <el-checkbox-group v-model="getI('second_contract_transfer_targets').values">
            <el-checkbox v-for="item of store.accountTypeList.toSpliced(3, 1)" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item :label="$t('liRunZhangHuZhuanCh')">
          <el-input-number v-model="getI('transfer_transfer_out_ratio').values" :precision="2" />
        </el-form-item>
        <el-form-item :label="$t('liRunZhangHuZhuanCh_0')">
          <el-input-number v-model="getI('transfer_transfer_out_min').values" :precision="2" />
        </el-form-item>
        <el-form-item :label="$t('liRunZhangHuZhuanCh_1')">
          <el-input-number v-model="getI('transfer_transfer_out_max').values" :precision="2" />
        </el-form-item>
        <el-form-item :label="$t('qiTaZhangHuZhuanChu')">
          <el-input-number v-model="getI('transfer_other_transfer_out_ratio').values" :precision="2" />
        </el-form-item>
        <el-form-item :label="$t('qiTaZhangHuZhuanChu_0')">
          <el-input-number v-model="getI('transfer_other_transfer_out_min').values" :precision="2" />
        </el-form-item>
        <el-form-item :label="$t('qiTaZhangHuZhuanChu_1')">
          <el-input-number v-model="getI('transfer_other_transfer_out_max').values" :precision="2" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item :title="$t('yuYinPeiZhi')" name="4">
        <el-form-item :label="$t('yuYinTiXingKaiGuan')">
          <el-switch v-model="getI('voice_reminder_switch').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('tiBiDingDanShiFouZ')">
          <el-switch v-model="getI('voice_is_repeat_extract_voice').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('chongZhiYuYinWenJia')">
          <uploadPart v-model="getI('voice_recharge_voice_file').values" type="files" />
        </el-form-item>
        <el-form-item :label="$t('tiXianYuYinWenJian')">
          <uploadPart v-model="getI('voice_withdraw_voice_file').values" type="files" />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const activeNames = ["1", "2", "3", "4"];
const groupLevelOptions = [
  { label: $t("erJi"), value: 2 },
  { label: $t("sanJi"), value: 3 },
  { label: $t("siJi"), value: 4 },
  { label: $t("wuJi"), value: 5 },
  { label: $t("liuJi"), value: 6 },
];
const themeOptions = [
  { label: $t("sizeSelect.default"), value: 1 },
  { label: $t("baiSe"), value: 2 },
];
const photoCodeAreaOptions = ref<{ key: string; val: string }[]>([]);
async function getPhotoCodeArea() {
  const res = await api.getPhoneCodeOptions();
  photoCodeAreaOptions.value = res;
}
getPhotoCodeArea();
</script>

<style></style>
