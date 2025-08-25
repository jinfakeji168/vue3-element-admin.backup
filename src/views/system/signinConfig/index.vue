<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>{{ $t("qianDaoPeiZhi") }}</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item :label="$t('qianDaoKaiGuan')" prop="lottery_is_open">
          <el-radio-group v-model="formData.sign_is_enable" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('qianDaoZengSongJined')" prop="lottery_is_pop">
          <el-radio-group v-model="formData.sign_give_account" fill="#409EFF" text-color="#fff">
            <el-radio-button v-for="item of store.accountTypeList" :label="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('qianDaoSuoXuZuiDiD')">
          <el-select v-model="formData.sign_min_level" style="width: 240px">
            <el-option v-for="item of store.vipList" :key="item.id" :label="item.title" :value="item.level" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('qianDaoJiangPinSheZ')">
          <el-button type="primary" @click="visible[0] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :disabled="!hasAuth('signinConfig:save')" @click="submitHandler" :loading="loading[1]">{{ $t("baoCun") }}</el-button>
      </template>
    </el-card>
    <list v-model="visible[0]" />
  </div>
</template>

<script setup lang="ts">
import list from "./components/list.vue";
import api, { type Form } from "@/api/system/signinConfig";
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
