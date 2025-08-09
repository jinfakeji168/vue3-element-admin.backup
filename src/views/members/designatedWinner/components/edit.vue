<template>
  <el-dialog v-model="visible" :title="title" width="800px" :close-on-click-modal="false" append-to-body @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('piLiangFangShi')" prop="batch_type">
        <el-radio-group v-model="formData.batch_type">
          <el-radio :label="1">{{ $t("zhiDingHuiYuan") }}</el-radio>
          <el-radio :label="2">{{ $t("anDengJi") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formData.batch_type === 1" :label="$t('zhiDingHuiYuanZhang')" prop="account">
        <el-input v-model="formData.account" type="textarea" :placeholder="$t('qingShuRuHuiYuanZha')" :rows="3" />
      </el-form-item>

      <el-form-item v-if="formData.batch_type === 2" :label="$t('vipDengJi')" prop="vip_level">
        <el-select v-model="formData.vip_level" :placeholder="$t('qingXuanZeVipDengJi')">
          <el-option v-for="i of store.vipList" :key="i.id" :label="i.title" :value="i.level" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('leiXing_0')" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button label="1">{{ $t("chongZhiZengSong") }}</el-radio-button>
          <el-radio-button label="2">{{ $t("zhuCeZengSong") }}</el-radio-button>
          <el-radio-button label="3">{{ $t("yaoQingZengSong") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('jiangXiang')" prop="bonus">
        <el-select v-model="formData.bonus" :placeholder="$t('qingXuanZeJiangXiang')">
          <el-option v-for="item in getPrizeList" :key="item.prize_id" ::label="$t('itemMinPrizeNumItem', [item.min_prize_num, item.probability])" :value="item.prize_id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading[0]">{{ $t("queDing") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, unref, reactive, watch, computed } from "vue";
import commonApi from "@/api/common";
import type { FormInstance, FormRules } from "element-plus";
import api, { type addForm } from "@/api/members/designatedWinner";
import { useStore } from "@/store/modules/common";

const store = useStore();
const visible = defineModel<boolean>();
const title = ref("");

const lotteryConfig = ref<any>(null);

async function getLotteryConfig() {
  const res = await commonApi.getPrizeList();
  lotteryConfig.value = res;
}

const getPrizeList = computed(() => {
  if (!lotteryConfig.value) return [];
  switch (formData.value.type) {
    case "1":
      return lotteryConfig.value.lottery_recharge_prize_set || [];
    case "2":
      return lotteryConfig.value.lottery_register_prize_set || [];
    case "3":
      return lotteryConfig.value.lottery_invite_prize_set || [];
    default:
      return [];
  }
});

const formData = ref<addForm>({
  batch_type: 1,
  account: "",
  vip_level: "",
  type: "1",
  bonus: undefined,
});
watch(
  () => unref(formData).type,
  (val) => {
    formData.value.bonus = undefined;
  }
);

const rules = reactive<FormRules>({
  batch_type: [{ required: true, message: $t("qingXuanZePiLiangFa"), trigger: "change" }],
  account: [{ required: true, message: $t("qingShuRuHuiYuanZha_0"), trigger: "blur" }],
  vip_level: [{ required: true, message: $t("qingXuanZeVipDengJi_0"), trigger: "change" }],
  type: [{ required: true, message: $t("qingXuanZeLeiXing"), trigger: "change" }],
  bonus: [{ required: true, message: $t("qingXuanZeJiangXiang_0"), trigger: "change" }],
});

const formRef = ref<FormInstance>();
const loading = ref([false, false]);
const emits = defineEmits(["finish"]);

async function submitHandler() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value[0] = true;
  try {
    if (formData.value.batch_type === 1) {
      formData.value.account = (formData.value.account as string)?.split(",");
    }
    await api.add(formData.value);
    visible.value = false;
    emits("finish");
  } finally {
    loading.value[0] = false;
  }
}

function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}

// 监听对话框显示状态
watch(
  visible,
  async () => {
    if (!visible.value) return;
    title.value = $t("xinZeng");
    await getLotteryConfig();
  },
  {
    flush: "post",
  }
);
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
