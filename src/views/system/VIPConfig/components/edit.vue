<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="VIP名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入VIP名称" />
      </el-form-item>
      <el-form-item label="VIP等级" prop="level">
        <el-input v-model="formData.level" placeholder="请输入VIP等级" type="number" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="量化次数" prop="quant_num">
        <el-input v-model="formData.quant_num" placeholder="请输入量化次数" type="number" />
      </el-form-item>
      <el-form-item label="解锁金额" prop="min_unlock_amount">
        <el-input v-model="formData.min_unlock_amount" placeholder="请输入解锁所需金额" />
      </el-form-item>
      <el-form-item label="解锁邀请人数" prop="unlock_invitation_num">
        <template #label>
          <div class="flex-center">
            <span>解锁邀请人数</span>
            <el-tooltip content="购买此等级所需邀请人数(下三级人数都算)，0代表无需邀请" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.unlock_invitation_num" :min="0" />
      </el-form-item>
      <el-form-item label="邀请计算层级" prop="invited_comp_level">
        <template #label>
          <div class="flex-center">
            <span>邀请计算层级</span>
            <el-tooltip content="购买此等级所需邀请人数计算层级，1代表计算一级下级，3代表计算三级下级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.invited_comp_level" :min="0" />
      </el-form-item>
      <el-form-item label="邀请人数有效充值" prop="invited_num_effect_recharge">
        <template #label>
          <div class="flex-center">
            <span>邀请人数有效充值</span>
            <el-tooltip content="购买此等级所需邀请人数需要充值满多少才算有效邀请人" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.invited_num_effect_recharge" placeholder="请输入邀请人数需要达到的充值金额" />
      </el-form-item>
      <el-form-item label="量化有效天数" prop="quant_effect_days">
        <template #label>
          <div class="flex-center">
            <span>量化有效天数</span>
            <el-tooltip content="解锁此等级可以做量化的天数,到期后返还给用户解锁的本金" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.quant_effect_days" :min="0" />
      </el-form-item>
      <el-form-item label="收益率范围%" prop="min_rate_of_return">
        <template #label>
          <div class="flex-center">
            <span>收益率范围%</span>
            <el-tooltip content="单次完成量化的收益率范围。每次量化的收益率计算本金会在最小值到最大值中取一个" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default>
          <div class="flex-center gap-4">
            <el-input v-model="formData.min_rate_of_return" placeholder="最小收益率" @blur="percentageBlurHandler($event, 'min_rate_of_return')" />
            <span>-</span>
            <el-input v-model="formData.max_rate_of_return" placeholder="最大收益率" @blur="percentageBlurHandler($event, 'max_rate_of_return')" />
          </div>
        </template>
      </el-form-item>
      <el-form-item label="平台服务费比例%" prop="service_fee_ratio">
        <template #label>
          <div class="flex-center">
            <span>平台服务费比例%</span>
            <el-tooltip
              content="平台服务费比例。用户的收益平台收取的比例，单位百分比，范围0-100，例如设置50，用户收益是1，那么用户最终收益是0.5，平台服务费0.5 用户收益计算公式：用户量化账户金额 * 收益率范围随机值 * 用户最终收益折扣% *（1-平台服务费%），用户最终收益折扣默认100，当前配置预计单次量化收益范围，预计单日量化收益范围"
              placement="top"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.service_fee_ratio" placeholder="请输入0-100之间的数字" @blur="percentageBlurHandler($event, 'service_fee_ratio')" />
      </el-form-item>
      <el-form-item label="是否显示服务费" prop="show_service_fee">
        <el-switch v-model="formData.show_service_fee" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="充值返利%" prop="recharge_rebate_ratio">
        <template #label>
          <div class="flex-center">
            <span>充值返利%</span>
            <el-tooltip content="格式1,2,3分别代表第一二三下级的充值返利%,最多可设置六级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.recharge_rebate_ratio" placeholder="请输入返利比例，如：1,2,3" />
      </el-form-item>
      <el-form-item label="量化返利%" prop="quant_rebate_ratio">
        <template #label>
          <div class="flex-center">
            <span>量化返利%</span>
            <el-tooltip content="格式1,2,3分别代表第一二三下级的量化返利%,最多可设置六级" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="formData.quant_rebate_ratio" placeholder="请输入返利比例，如：1,2,3" />
      </el-form-item>
      <el-form-item label="复充收益率%" prop="recharge_yield_ratio">
        <el-input v-model="formData.recharge_yield_ratio" placeholder="请输入复充收益率" @blur="percentageBlurHandler($event, 'recharge_yield_ratio')" />
      </el-form-item>
      <el-form-item label="复充封顶" prop="recharge_cap">
        <el-input v-model="formData.recharge_cap" placeholder="请输入复充封顶金额" />
      </el-form-item>
      <el-form-item label="是否可解锁购买" prop="is_unlock_purchase">
        <el-switch v-model="formData.is_unlock_purchase" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="可提现星期" prop="cash_withdrawal_week">
        <el-checkbox-group v-model="formData.cash_withdrawal_week">
          <el-checkbox-button :label="1">星期一</el-checkbox-button>
          <el-checkbox-button :label="2">星期二</el-checkbox-button>
          <el-checkbox-button :label="3">星期三</el-checkbox-button>
          <el-checkbox-button :label="4">星期四</el-checkbox-button>
          <el-checkbox-button :label="5">星期五</el-checkbox-button>
          <el-checkbox-button :label="6">星期六</el-checkbox-button>
          <el-checkbox-button :label="7">星期日</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可提现时间" prop="cash_withdrawal_time">
        <el-time-picker is-range v-model="formData.cash_withdrawal_time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="HH:mm:ss" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
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
      title.value = "编辑";
      formData.value = { ...props.data };
    } else {
      title.value = "新增";
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
  title: [{ required: true, message: "VIP名称不能为空", trigger: "blur" }],
  level: [{ required: true, message: "VIP等级不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "图标不能为空", trigger: "blur" }],
  status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
  quant_num: [{ required: true, message: "量化次数不能为空", trigger: "blur" }],
  min_unlock_amount: [{ required: true, message: "解锁金额不能为空", trigger: "blur" }],
  unlock_invitation_num: [{ required: true, message: "解锁邀请人数不能为空", trigger: "blur" }],
  invited_comp_level: [{ required: true, message: "邀请计算层级不能为空", trigger: "blur" }],
  invited_num_effect_recharge: [{ required: true, message: "邀请人数有效充值不能为空", trigger: "blur" }],
  quant_effect_days: [{ required: true, message: "量化有效天数不能为空", trigger: "blur" }],
  min_rate_of_return: [
    { required: true, message: "最小收益率不能为空", trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: "请输入正确的百分比格式(至少两位小数)", trigger: "blur" },
  ],
  max_rate_of_return: [
    { required: true, message: "最大收益率不能为空", trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: "请输入正确的百分比格式(至少两位小数)", trigger: "blur" },
  ],
  service_fee_ratio: [
    { required: true, message: "平台服务费比例不能为空", trigger: "blur" },
    { pattern: /^\d+(\.\d{2})?$/, message: "请输入正确的百分比格式(至少两位小数)", trigger: "blur" },
  ],
  show_service_fee: [{ required: true, message: "是否显示服务费不能为空", trigger: "blur" }],
  recharge_rebate_ratio: [{ required: true, message: "充值返利不能为空", trigger: "blur" }],
  quant_rebate_ratio: [{ required: true, message: "量化返利不能为空", trigger: "blur" }],
  recharge_yield_ratio: [{ required: true, message: "复充收益率不能为空", trigger: "blur" }],
  recharge_cap: [{ required: true, message: "复充封顶不能为空", trigger: "blur" }],
  is_unlock_purchase: [{ required: true, message: "是否可解锁购买不能为空", trigger: "blur" }],
  cash_withdrawal_week: [{ required: true, message: "可提现星期不能为空", trigger: "blur" }],
  cash_withdrawal_time: [{ required: true, message: "可提现时间不能为空", trigger: "blur" }],
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
