<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('mingCheng')" prop="show_name">
        <el-input v-model="formData.show_name" placeholder="" />
      </el-form-item>
      <el-form-item :label="$t('tuBiao')" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('zuiXiaoTiXianJinE_0')" prop="min_withdraw">
        <el-input-number v-model="formData.min_withdraw" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('zuiDaTiXianJinE')" prop="max_withdraw">
        <el-input-number v-model="formData.max_withdraw" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('tiXianShouXuFei')" prop="withdraw_fee_ratio">
        <el-input-number v-model="formData.withdraw_fee_ratio" :precision="2" :min="0" :step="0.1" />
      </el-form-item>
      <el-form-item :label="$t('zuiDaShouXuFeiDang')" prop="max_withdraw_fee">
        <el-input-number v-model="formData.max_withdraw_fee" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('zuiXiaoShouXuFeiDan')" prop="min_withdraw_fee">
        <el-input-number v-model="formData.min_withdraw_fee" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('qiYongZhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('chongZhi')" porp="open_recharge">
        <el-radio-group v-model="formData.open_recharge">
          <el-radio :label="StatusEnum.False">{{ $t("zhengChang") }}</el-radio>
          <el-radio :label="StatusEnum.True">{{ $t("jinYong") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('tiXian')" prop="open_withdraw">
        <el-radio-group v-model="formData.open_withdraw">
          <el-radio :label="StatusEnum.False">{{ $t("zhengChang") }}</el-radio>
          <el-radio :label="StatusEnum.True">{{ $t("jinYong") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('tiKuanJineleiXing')" prop="withdraw_type">
        <el-radio-group v-model="formData.withdraw_type">
          <el-radio :label="1">{{ $t("yongHuShuRu") }}</el-radio>
          <el-radio :label="2">{{ $t("guDingJinE") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('tiKuanJinepeiZhi')" prop="withdraw_config" v-if="formData.withdraw_type == 2">
        <el-input v-model="formData.withdraw_config" />
      </el-form-item>
      <el-form-item :label="$t('huiShuai')" prop="exchange_rate">
        <el-input-number v-model="formData.exchange_rate" :precision="2" />
      </el-form-item>
      <el-form-item :label="$t('shangHuHao')" prop="merchant_num">
        <el-input v-model="formData.merchant_num" />
      </el-form-item>
      <el-form-item :label="$t('shangHuKey')" prop="merchant_key">
        <el-input v-model="formData.merchant_key" />
      </el-form-item>
      <el-form-item :label="$t('chongZhiDiZhi')" prop="recharge_address">
        <el-input v-model="formData.recharge_address" />
      </el-form-item>
      <el-form-item :label="$t('xianShiPaiXu')" prop="sort">
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
import api, { type Form } from "@/api/system/currency";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
import { parserHandler } from "@/utils/index";
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
      formData.value = { withdraw_type: 1, open_recharge: StatusEnum.False, open_withdraw: StatusEnum.False, status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  show_name: [{ required: true, message: $t("mingChengBuNengWeiK"), trigger: "blur" }],
  min_withdraw: [{ required: true, message: $t("zuiXiaoTiXianJinebu"), trigger: "blur" }],
  max_withdraw: [{ required: true, message: $t("zuiDaTiXianJinebuNe"), trigger: "blur" }],
  withdraw_fee_ratio: [{ required: true, message: $t("tiXianShouXuFeiBuN"), trigger: "blur" }],
  max_withdraw_fee: [{ required: true, message: $t("zuiDaShouXuFeiDang_0"), trigger: "blur" }],
  min_withdraw_fee: [{ required: true, message: $t("zuiXiaoShouXuFeiDan_0"), trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
async function submitHandler() {
  await unref(formRef)?.validate();
  loading.value = true;
  try {
    if (props.data) {
      await api.edit(formData.value);
    } else {
      await api.add(formData.value);
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
