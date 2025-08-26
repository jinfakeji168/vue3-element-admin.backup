<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('vipMingCheng')" prop="title">
        <el-input v-model="formData.title" :placeholder="$t('qingShuRuVipMingChe')" />
      </el-form-item>
      <el-form-item :label="$t('vipDengJi')" prop="level">
        <el-input-number v-model="formData.level" :placeholder="$t('qingShuRuVipDengJi')" :min="1" />
      </el-form-item>
      <el-form-item :label="$t('tuBiao')" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('zhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('liangHuaCiShu')" prop="quant_num">
        <el-input-number v-model="formData.quant_num" :placeholder="$t('qingShuRuLiangHuaCi')" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('jieSuoJinE')" prop="min_unlock_amount">
        <el-input-number v-model="formData.min_unlock_amount" :placeholder="$t('qingShuRuJieSuoSuo')" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('jieSuoYaoQingRenShu_0')" prop="unlock_invitation_num">
        <el-tooltip :content="$t('gouMaiCiDengJiSuoX')" placement="top">
          <el-input-number v-model="formData.unlock_invitation_num" :min="0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('yaoQingJiSuanCengJi_0')" prop="invited_comp_level">
        <el-tooltip :content="$t('gouMaiCiDengJiSuoX_0')" placement="top">
          <el-input-number v-model="formData.invited_comp_level" :min="0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('yaoQingRenShuYouXia_0')" prop="invited_num_effect_recharge">
        <el-tooltip :content="$t('gouMaiCiDengJiSuoX_1')" placement="top">
          <el-input-number v-model="formData.invited_num_effect_recharge" :placeholder="$t('qingShuRuYaoQingRen')" :precision="2" :min="0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('liangHuaYouXiaoTian_0')" prop="quant_effect_days">
        <el-tooltip :content="$t('jieSuoCiDengJiKeYi')" placement="top">
          <el-input-number v-model="formData.quant_effect_days" :min="0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('shouYiShuaiFanWei_0')" prop="min_rate_of_return">
        <template #default>
          <el-tooltip :content="$t('danCiWanChengLiangH')" placement="top">
            <div class="flex-center gap-4">
              <el-input-number v-model="formData.min_rate_of_return" type="number" :placeholder="$t('zuiXiaoShouYiShuai')" :precision="2" :min="0" :max="100" />
              <span>-</span>
              <el-input-number v-model="formData.max_rate_of_return" type="number" :placeholder="$t('zuiDaShouYiShuai')" :precision="2" :min="0" :max="100" />
            </div>
          </el-tooltip>
        </template>
      </el-form-item>
      <el-form-item :label="$t('pingTaiFuWuFeiBiLi_0')" prop="service_fee_ratio">
        <el-tooltip :content="$t('pingTaiFuWuFeiBiLi_2')" placement="top">
          <el-input-number v-model="formData.service_fee_ratio" :placeholder="$t('qingShuRu_0100ZhiJia')" :precision="2" :min="0" :max="100" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('shiFouXianShiFuWuF')" prop="show_service_fee">
        <el-switch v-model="formData.show_service_fee" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('chongZhiFanLi_0')" prop="recharge_rebate_ratio">
        <el-tooltip :content="$t('geShi_123FenBieDaiB')" placement="top">
          <el-input v-model="formData.recharge_rebate_ratio" :placeholder="$t('qingShuRuFanLiBiLi_0')" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('liangHuaFanLi_0')" prop="quant_rebate_ratio">
        <el-tooltip :content="$t('geShi_123FenBieDaiB_0')" placement="top">
          <el-input v-model="formData.quant_rebate_ratio" :placeholder="$t('qingShuRuFanLiBiLi_0')" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('fuChongShouYiShuai')" prop="recharge_yield_ratio">
        <el-input-number v-model="formData.recharge_yield_ratio" :placeholder="$t('qingShuRuFuChongSho')" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('fuChongFengDing')" prop="recharge_cap">
        <el-input-number v-model="formData.recharge_cap" :placeholder="$t('qingShuRuFuChongFen')" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('shiFouKeJieSuoGouM')" prop="is_unlock_purchase">
        <el-switch v-model="formData.is_unlock_purchase" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('keTiXianXingQi')" prop="cash_withdrawal_week">
        <el-checkbox-group v-model="formData.cash_withdrawal_week">
          <el-checkbox-button :label="1">{{ $t("xingQiYi") }}</el-checkbox-button>
          <el-checkbox-button :label="2">{{ $t("xingQiEr") }}</el-checkbox-button>
          <el-checkbox-button :label="3">{{ $t("xingQiSan") }}</el-checkbox-button>
          <el-checkbox-button :label="4">{{ $t("xingQiSi") }}</el-checkbox-button>
          <el-checkbox-button :label="5">{{ $t("xingQiWu") }}</el-checkbox-button>
          <el-checkbox-button :label="6">{{ $t("xingQiLiu") }}</el-checkbox-button>
          <el-checkbox-button :label="7">{{ $t("xingQiRi") }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('keTiXianShiJian')" prop="cash_withdrawal_time">
        <el-time-picker
          is-range
          v-model="formData.cash_withdrawal_time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
        />
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
import api, { type Form } from "@/api/system/VipConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
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
      formData.value = { status: StatusEnum.False, is_unlock_purchase: StatusEnum.False, show_service_fee: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

/**
 * 格式化百分比，确保至少两位小数
 */
function formatPercentage(value: string): string {
  if (!value) return "0.00";
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

/**
 * 百分比输入框失焦处理
 */
function percentageBlurHandler(event: FocusEvent, field: keyof Form) {
  const target = event.target as HTMLInputElement;
  const formattedValue = formatPercentage(target.value);
  formData.value[field] = formattedValue;
}

// 修改验证规则，添加数字验证
const rules = {
  title: [{ required: true, message: $t("vipMingChengBuNengW"), trigger: "blur" }],
  level: [{ required: true, message: $t("vipDengJiBuNengWei"), trigger: "blur" }],
  icon: [{ required: true, message: $t("tuBiaoBuNengWeiKong"), trigger: "blur" }],
  status: [{ required: true, message: $t("zhuangTaiBuNengWeiK"), trigger: "blur" }],
  quant_num: [{ required: true, message: $t("liangHuaCiShuBuNeng"), trigger: "blur" }],
  min_unlock_amount: [{ required: true, message: $t("jieSuoJinebuNengWei"), trigger: "blur" }],
  unlock_invitation_num: [{ required: true, message: $t("jieSuoYaoQingRenShu_1"), trigger: "blur" }],
  invited_comp_level: [{ required: true, message: $t("yaoQingJiSuanCengJi_1"), trigger: "blur" }],
  invited_num_effect_recharge: [{ required: true, message: $t("yaoQingRenShuYouXia_1"), trigger: "blur" }],
  quant_effect_days: [{ required: true, message: $t("liangHuaYouXiaoTian_1"), trigger: "blur" }],
  min_rate_of_return: [{ required: true, message: $t("zuiXiaoShouYiShuaiB"), trigger: "blur" }],
  max_rate_of_return: [{ required: true, message: $t("zuiDaShouYiShuaiBu"), trigger: "blur" }],
  service_fee_ratio: [{ required: true, message: $t("pingTaiFuWuFeiBiLi_1"), trigger: "blur" }],
  show_service_fee: [{ required: true, message: $t("shiFouXianShiFuWuF_0"), trigger: "blur" }],
  recharge_rebate_ratio: [{ required: true, message: $t("chongZhiFanLiBuNeng"), trigger: "blur" }],
  quant_rebate_ratio: [{ required: true, message: $t("liangHuaFanLiBuNeng"), trigger: "blur" }],
  recharge_yield_ratio: [{ required: true, message: $t("fuChongShouYiShuaiB"), trigger: "blur" }],
  recharge_cap: [{ required: true, message: $t("fuChongFengDingBuNe"), trigger: "blur" }],
  is_unlock_purchase: [{ required: true, message: $t("shiFouKeJieSuoGouM_0"), trigger: "blur" }],
  cash_withdrawal_week: [{ required: true, message: $t("keTiXianXingQiBuNe"), trigger: "blur" }],
  cash_withdrawal_time: [{ required: true, message: $t("keTiXianShiJianBuN"), trigger: "blur" }],
};

import { useStore } from "@/store/modules/common";
const store = useStore();
const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
async function submitHandler() {
  await unref(formRef)?.validate();
  loading.value = true;
  try {
    if (props.data) {
      const formDataValue = unref(formData);
      await api.edit({
        ...formDataValue,
        quant_rebate_ratio: typeof formDataValue?.quant_rebate_ratio === "string" ? formDataValue.quant_rebate_ratio.split(",") : formDataValue?.quant_rebate_ratio,
        recharge_rebate_ratio: typeof formDataValue?.recharge_rebate_ratio === "string" ? formDataValue.recharge_rebate_ratio.split(",") : formDataValue?.recharge_rebate_ratio,
      });
    } else {
      await api.add({
        ...unref(formData),
        quant_rebate_ratio: unref(formData)!.quant_rebate_ratio!.split(","),
        recharge_rebate_ratio: unref(formData)!.recharge_rebate_ratio!.split(","),
      });
    }
  } finally {
    loading.value = false;
  }
  visible.value = false;
  store.updateVipList();
  emit("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
