<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>邀请奖励</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item label="邀请下级首存人数阶梯奖励" prop="invite_first_recharge_user">
          <el-radio-group v-model="formData.invite_first_recharge_user" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">开启</el-radio-button>
            <el-radio-button :value="StatusEnum.True">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邀请一级会员首存超过多少" prop="invite_first_recharge_money">
          <el-input-number v-model="formData.invite_first_recharge_money" :min="0" />
        </el-form-item>
        <el-form-item label="邀请一级会员首存赠送金额" prop="invite_first_give_money">
          <el-input-number v-model="formData.invite_first_give_money" :min="0" />
        </el-form-item>

        <el-form-item label="邀请阶梯设置">
          <el-button type="primary" @click="visible[0] = true">查看/编辑</el-button>
        </el-form-item>
        <hr />
        <el-form-item label="邀请下级首存金额阶梯奖励" prop="invite_first_recharge_invite_money">
          <el-radio-group v-model="formData.invite_first_recharge_invite_money" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">开启</el-radio-button>
            <el-radio-button :value="StatusEnum.True">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="首充金额阶梯设置">
          <el-button type="primary" @click="visible[1] = true">查看/编辑</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :disabled="!hasAuth('inviteAward:save')" @click="submitHandler" :loading="loading[1]">保存</el-button>
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
