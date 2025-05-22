<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>秒合约设置</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item label="秒合约开关" prop="contract_is_enable_contract">
          <el-switch v-model="formData.contract_is_enable_contract" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
        </el-form-item>
        <el-form-item label="合约结算到账账户" prop="contract_settle_account">
          <el-radio-group v-model="formData.contract_settle_account">
            <el-radio :value="1">佣金账户</el-radio>
            <el-radio :value="2">合约账户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="秒合约手续费" prop="contract_second_contract_fee">
          <el-input-number v-model="formData.contract_second_contract_fee" :min="0" />
        </el-form-item>
        <el-form-item label="用户初始输赢概率" prop="contract_user_init_win_loss_ratio">
          <el-input-number v-model="formData.contract_user_init_win_loss_ratio" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="合约说明设置">
          <el-button type="primary" @click="visible[0] = true">查看/编辑</el-button>
        </el-form-item>
        <el-form-item label="合约时间设置">
          <el-button type="primary" @click="visible[1] = true">查看/编辑</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-hasPerm="['lotteryConfig:save']" type="primary" @click="submitHandler" :loading="loading[1]">保存</el-button>
      </template>
    </el-card>
    <explain :data="formData" v-model="visible[0]" @finish="getData" />
    <timeList v-model="visible[1]" />
  </div>
</template>

<script setup lang="ts">
import { StatusEnum } from "@/enums/MenuTypeEnum";
import explain from "./components/explain.vue";
import timeList from "./components/timeList.vue";
import api, { type Form } from "@/api/system/instantContractSetting";

const formData = reactive<Form>({});
const visible = ref([false]);
const loading = reactive<boolean[]>([]);
async function getData() {
  loading[0] = true;
  const res = await api.getContractConfig();
  Object.assign(formData, res);
  loading[0] = false;
}
getData();
async function submitHandler() {
  loading[1] = true;
  await api.setContractConfig(formData);
  loading[1] = false;
}
</script>

<style></style>
