<template>
  <el-dialog v-model="visible" width="50%" :title="$t('shouDongTiXian')" :close-on-click-modal="false">
    <el-form :model="model" label-width="140px" :rules="rules" ref="formRef">
      <el-form-item :label="$t('yongHu')" prop="uid">
        <el-select filterable remote :remote-method="searchMemberHandler" v-model="model.uid" :placeholder="$t('qingShuRuGuanJianZi')">
          <el-option v-for="item of memberList" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('tiXianJinE')" prop="amount">
        <el-input-number v-model="model.amount" :min="0" :precision="2" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/bill/withdrawOrder";
import { searchMember } from "@/utils";
import { useTemplateRef } from "vue";

const visible = defineModel<boolean>();
const model = ref({
  uid: undefined,
  amount: undefined,
});
const rules = {
  uid: [{ required: true, message: $t("qingXuanZeYongHu"), trigger: "change" }],
  amount: [{ required: true, message: $t("qingShuRuTiXianJin"), trigger: "change" }],
};
const formRef = useTemplateRef("formRef");
const emits = defineEmits<{ finish: [] }>();
const loading = ref(false);
async function submitHandler() {
  await formRef.value?.validate();
  try {
    loading.value = true;
    await api.manuallyWithdraw(model.value);
    visible.value = false;
    emits("finish");
  } finally {
    loading.value = false;
  }
}

const memberList = ref<any>([]);
async function searchMemberHandler(str: string) {
  memberList.value = await searchMember({ account: str });
}
</script>

<style></style>
