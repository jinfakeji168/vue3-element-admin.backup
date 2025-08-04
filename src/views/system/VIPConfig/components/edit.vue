<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('vipMingCheng')" prop="title">
        <el-input v-model="formData.title" :placeholder="$t('qingShuRuVipMingChe')" />
      </el-form-item>
      <el-form-item :label="$t('vipDengJi')" prop="level">
        <el-input v-model="formData.level" :placeholder="$t('qingShuRuVipDengJi')" type="number" :min="1" />
      </el-form-item>
      <el-form-item :label="$t('tuBiao')" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('zhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('liangHuaCiShu')" prop="quant_num">
        <el-input v-model="formData.quant_num" :placeholder="$t('qingShuRuLiangHuaCi')" type="number" />
      </el-form-item>
      <el-form-item :label="$t('jieSuoJinE')" prop="min_unlock_amount">
        <el-input v-model="formData.min_unlock_amount" :placeholder="$t('qingShuRuJieSuoSuo')" />
      </el-form-item>
      <el-form-item :label="$t('jieSuoYaoQingRenShu_0')" prop="unlock_invitation_num">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("jieSuoYaoQingRenShu_0") }}</span>
            <el-tooltip content="购买此等级所需邀请人数(下三级人数都算)，0代表无需邀请" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.unlock_invitation_num" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('yaoQingJiSuanCengJi_0')" prop="invited_comp_level">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("yaoQingJiSuanCengJi_0") }}</span>
            <el-tooltip content="购买此等级所需邀请人数计算层级，1代表计算一级下级，3代表计算三级下级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.invited_comp_level" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('yaoQingRenShuYouXia_0')" prop="invited_num_effect_recharge">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("yaoQingRenShuYouXia_0") }}</span>
            <el-tooltip content="购买此等级所需邀请人数需要充值满多少才算有效邀请人" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.invited_num_effect_recharge" :placeholder="$t('qingShuRuYaoQingRen')" />
      </el-form-item>
      <el-form-item :label="$t('liangHuaYouXiaoTian_0')" prop="quant_effect_days">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("liangHuaYouXiaoTian_0") }}</span>
            <el-tooltip content="解锁此等级可以做量化的天数,到期后返还给用户解锁的本金" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.quant_effect_days" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('shouYiShuaiFanWei_0')" prop="min_rate_of_return">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("shouYiShuaiFanWei_0") }}</span>
            <el-tooltip content="单次完成量化的收益率范围。每次量化的收益率计算本金会在最小值到最大值中取一个" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default>
          <div class="flex-center gap-4">
            <el-input v-model="formData.min_rate_of_return" :placeholder="$t('zuiXiaoShouYiShuai')" @blur="percentageBlurHandler($event, 'min_rate_of_return')" />
            <span>-</span>
            <el-input v-model="formData.max_rate_of_return" :placeholder="$t('zuiDaShouYiShuai')" @blur="percentageBlurHandler($event, 'max_rate_of_return')" />
          </div>
        </template>
      </el-form-item>
      <el-form-item :label="$t('pingTaiFuWuFeiBiLi_0')" prop="service_fee_ratio">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("pingTaiFuWuFeiBiLi_0") }}</span>
            <el-tooltip
              content="平台服务费比例。用户的收益平台收取的比例，单位百分比，范围0-100，例如设置50，用户收益是1，那么用户最终收益是0.5，平台服务费0.5 用户收益计算公式：用户量化账户金额 * 收益率范围随机值 * 用户最终收益折扣% *（1-平台服务费%），用户最终收益折扣默认100，当前配置预计单次量化收益范围，预计单日量化收益范围"
              placement="top"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.service_fee_ratio" :placeholder="$t('qingShuRu_0100ZhiJia')" @blur="percentageBlurHandler($event, 'service_fee_ratio')" />
      </el-form-item>
      <el-form-item :label="$t('shiFouXianShiFuWuF')" prop="show_service_fee">
        <el-switch v-model="formData.show_service_fee" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('chongZhiFanLi_0')" prop="recharge_rebate_ratio">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("chongZhiFanLi_0") }}</span>
            <el-tooltip content="格式1,2,3分别代表第一二三下级的充值返利%,最多可设置六级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.recharge_rebate_ratio" :placeholder="$t('qingShuRuFanLiBiLi_0')" />
      </el-form-item>
      <el-form-item :label="$t('liangHuaFanLi_0')" prop="quant_rebate_ratio">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("liangHuaFanLi_0") }}</span>
            <el-tooltip content="格式1,2,3分别代表第一二三下级的量化返利%,最多可设置六级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.quant_rebate_ratio" :placeholder="$t('qingShuRuFanLiBiLi_0')" />
      </el-form-item>
      <el-form-item :label="$t('fuChongShouYiShuai')" prop="recharge_yield_ratio">
        <el-input v-model="formData.recharge_yield_ratio" :placeholder="$t('qingShuRuFuChongSho')" @blur="percentageBlurHandler($event, 'recharge_yield_ratio')" />
      </el-form-item>
      <el-form-item :label="$t('fuChongFengDing')" prop="recharge_cap">
        <el-input v-model="formData.recharge_cap" :placeholder="$t('qingShuRuFuChongFen')" />
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
  min_rate_of_return: [
    { required: true, message: $t("zuiXiaoShouYiShuaiB"), trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: $t("qingShuRuZhengQueDe_1"), trigger: "blur" },
  ],
  max_rate_of_return: [
    { required: true, message: $t("zuiDaShouYiShuaiBu"), trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: $t("qingShuRuZhengQueDe_1"), trigger: "blur" },
  ],
  service_fee_ratio: [
    { required: true, message: $t("pingTaiFuWuFeiBiLi_1"), trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: $t("qingShuRuZhengQueDe_1"), trigger: "blur" },
  ],
  show_service_fee: [{ required: true, message: $t("shiFouXianShiFuWuF_0"), trigger: "blur" }],
  recharge_rebate_ratio: [{ required: true, message: $t("chongZhiFanLiBuNeng"), trigger: "blur" }],
  quant_rebate_ratio: [{ required: true, message: $t("liangHuaFanLiBuNeng"), trigger: "blur" }],
  recharge_yield_ratio: [{ required: true, message: $t("fuChongShouYiShuaiB"), trigger: "blur" }],
  recharge_cap: [{ required: true, message: $t("fuChongFengDingBuNe"), trigger: "blur" }],
  is_unlock_purchase: [{ required: true, message: $t("shiFouKeJieSuoGouM_0"), trigger: "blur" }],
  cash_withdrawal_week: [{ required: true, message: $t("keTiXianXingQiBuNe"), trigger: "blur" }],
  cash_withdrawal_time: [{ required: true, message: $t("keTiXianShiJianBuN"), trigger: "blur" }],
};

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
  emit("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
