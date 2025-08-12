<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('chanPinLeiXing_0')" prop="type">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("chanPinLeiXing_0") }}</span>
            <el-tooltip :content="$t('puTongTouZiChanPin')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-radio-group v-model="formData.type" :disabled="Boolean(data)">
          <el-radio v-for="item of productTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('mingCheng')" prop="title">
        <el-input v-model="formData.title" placeholder="" />
      </el-form-item>
      <el-form-item :label="$t('tuPian')" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('gouMaiJiaGe')" prop="purchase_price">
        <el-input-number v-model="formData.purchase_price" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('touZiZhouQi')" prop="invest_cycle">
        <el-input-number v-model="formData.invest_cycle" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('meiRiShouYiShuai')" prop="daily_yield">
        <el-input-number v-model="formData.daily_yield" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('shouYiLeiXing_0')" prop="yield_type">
        <el-select v-model="formData.yield_type" :placeholder="$t('qingXuanZeShouYiLei')">
          <el-option v-for="item in yieldTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('xianGouShuLiang')" prop="sales_quota">
        <template #label>
          <div class="flex-center">
            <span>{{ $t("xianGouShuLiang") }}</span>
            <el-tooltip :content="$t('0BiaoShiBuXianZhi')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.sales_quota" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('shengYuShuLiang')" prop="residual_num">
        <el-input-number v-model="formData.residual_num" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('shengYuShuLiangShiF')" prop="show_residual_num">
        <el-switch v-model="formData.show_residual_num" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item :label="$t('xiaoShouZhuangTai_0')" prop="sales_status">
        <el-switch v-model="formData.sales_status" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item :label="$t('zhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item :label="$t('paiXu')" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
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
import api, { type Form, yieldTypeOptions, productTypeOptions } from "@/api/system/investmentConfig"; // 确保api路径正确
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
      formData.value = {
        type: 1, // 设置默认值
        sort: 0,
        status: 1,
        title: "",
        icon: "",
        purchase_price: "",
        invest_cycle: 0,
        daily_yield: "",
        yield_type: 1,
        sales_quota: 0,
        residual_num: 0,
        show_residual_num: 1,
        sales_status: 1,
      };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  type: [{ required: true, message: $t("chanPinLeiXingBuNen"), trigger: "change" }],
  sort: [{ required: true, message: $t("paiXuBuNengWeiKong"), trigger: "blur" }],
  status: [{ required: true, message: $t("zhuangTaiBuNengWeiK"), trigger: "change" }],
  title: [{ required: true, message: $t("mingChengBuNengWeiK"), trigger: "blur" }],
  icon: [{ required: true, message: $t("tuPianBuNengWeiKong"), trigger: "blur" }],
  purchase_price: [{ required: true, message: $t("gouMaiJiaGeBuNengW"), trigger: "blur" }],
  invest_cycle: [{ required: true, message: $t("touZiZhouQiBuNengW"), trigger: "blur" }],
  daily_yield: [{ required: true, message: $t("meiRiShouYiShuaiBu"), trigger: "blur" }],
  yield_type: [{ required: true, message: $t("shouYiLeiXingBuNeng"), trigger: "change" }],
  sales_quota: [{ required: true, message: $t("xianGouShuLiangBuNe"), trigger: "blur" }],
  residual_num: [{ required: true, message: $t("shengYuShuLiangBuNe"), trigger: "blur" }],
  show_residual_num: [{ required: true, message: $t("shengYuShuLiangShiF_0"), trigger: "change" }],
  sales_status: [{ required: true, message: $t("xiaoShouZhuangTaiBu"), trigger: "change" }],
};

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
function submitHandler() {
  unref(formRef)?.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      if (props.data) {
        await api.edit(formData.value);
      } else {
        await api.add(formData.value);
      }
      visible.value = false;
      emit("finish");
    } finally {
      loading.value = false;
    }
  });
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style></style>
