<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>{{ $t("yaoQingJiangLi") }}</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item :label="$t('yaoQingXiaJiShouCun')" prop="invite_first_recharge_user">
          <el-radio-group v-model="formData.invite_first_recharge_user" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="invite_first_recharge_money">
          <template #label>
            <div class="flex-center">
              <span>{{ $t("yaoQingYiJiHuiYuan") }}</span>
              <el-tooltip :content="$t('yaoQingYiJiHuiYuan_0')" placement="top">
                <el-icon class="el-icon--right"><el-icon-question-filled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="formData.invite_first_recharge_money" :min="0" />
        </el-form-item>
        <el-form-item prop="invite_first_give_money">
          <template #label>
            <div class="flex-center">
              <span>{{ $t("yaoQingYiJiHuiYuan_1") }}</span>
              <el-tooltip :content="$t('yaoQingYiJiHuiYuan_2')" placement="top">
                <el-icon class="el-icon--right"><el-icon-question-filled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="formData.invite_first_give_money" :min="0" />
        </el-form-item>

        <el-form-item :label="$t('yaoQingJieTiSheZhi')">
          <el-button type="primary" @click="visible[0] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <hr />
        <el-form-item :label="$t('yaoQingXiaJiShouCun_0')" prop="invite_first_recharge_invite_money">
          <el-radio-group v-model="formData.invite_first_recharge_invite_money" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('shouChongJinejieTiSh')">
          <el-button type="primary" @click="visible[1] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :disabled="!hasAuth('inviteAward:save')" @click="submitHandler" :loading="loading[1]">{{ $t("baoCun") }}</el-button>
      </template>
    </el-card>
    <ladderList v-model="visible[0]" />
    <chargeList v-model="visible[1]" />
  </div>
</template>

<script setup lang="ts">
import ladderList from "./components/ladderList.vue";
import chargeList from "./components/chargeList.vue";
import api, { type Form } from "@/api/system/inviteAward";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { useStore } from "@/store/modules/common";
import { hasAuth } from "@/plugins/permission";

const store = useStore();
const formData = reactive<Form>({});
const visible = ref([false]);
const loading = reactive<boolean[]>([]);
async function getData() {
  loading[0] = true;
  const res = await api.getConfig();
  Object.assign(formData, res);
  loading[0] = false;
}
getData();
async function submitHandler() {
  loading[1] = true;
  await api.setConfig(formData);
  loading[1] = false;
}
</script>

<style></style>
