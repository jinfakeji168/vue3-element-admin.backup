<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>抽奖配置</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item label="抽奖开关" prop="lottery_is_open">
          <el-radio-group v-model="formData.lottery_is_open" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">开启</el-radio-button>
            <el-radio-button :value="StatusEnum.True">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="首页是否弹窗" prop="lottery_is_pop">
          <el-radio-group v-model="formData.lottery_is_pop" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">开启</el-radio-button>
            <el-radio-button :value="StatusEnum.True">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每次到首页都弹窗" prop="lottery_pop_num">
          <el-radio-group v-model="formData.lottery_pop_num" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">开启</el-radio-button>
            <el-radio-button :value="StatusEnum.True">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽奖赠送账户" prop="lottery_give_account">
          <el-radio-group v-model="formData.lottery_give_account" fill="#409EFF" text-color="#fff">
            <el-radio-button :value="1">量化账户</el-radio-button>
            <el-radio-button :value="2">佣金账户</el-radio-button>
            <el-radio-button :value="3">合约账户</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽奖形式" prop="lottery_type">
          <el-radio-group v-model="formData.lottery_type" fill="#409EFF" text-color="#fff">
            <el-radio-button :value="1">转盘</el-radio-button>
            <el-radio-button :value="2">宝盒</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖品设置" prop="lottery_system_lottery_type">
          <el-radio-group v-model="formData.lottery_system_lottery_type" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">全局</el-radio-button>
            <el-radio-button :value="2">局部</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖品默认显示类型" prop="lottery_type_default">
          <el-radio-group v-model="formData.lottery_type_default" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">注册奖品</el-radio-button>
            <el-radio-button :value="2">邀请奖品</el-radio-button>
            <el-radio-button :value="3">充值奖品</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽奖说明">
          <el-button type="primary" @click="visible[0] = true">查看/编辑</el-button>
        </el-form-item>
        <hr />
        <el-form-item label="注册赠送抽奖次数" props="lottery_register_give_num">
          <el-input-number v-model="formData.lottery_register_give_num" :min="0" />
        </el-form-item>
        <el-form-item label="注册奖品设置">
          <el-button type="primary" @click="visible[1] = true">查看/编辑</el-button>
        </el-form-item>
        <hr />
        <el-form-item label="邀请用户充值金额" props="lottery_spread_recharge_give">
          <el-input-number v-model="formData.lottery_spread_recharge_give" :min="0" />
        </el-form-item>
        <el-form-item label="邀请奖品设置">
          <el-button type="primary" @click="visible[2] = true">查看/编辑</el-button>
        </el-form-item>
        <hr />
        <el-form-item label="用户充值赠送抽奖次数类型" props="lottery_send_type">
          <el-radio-group v-model="formData.lottery_send_type" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">按每日充值总额赠送</el-radio-button>
            <el-radio-button :value="2">按每笔充值金额赠送</el-radio-button>
            <el-radio-button :value="3">按终身充值总额赠送</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值奖品设置">
          <el-button type="primary" @click="visible[3] = true">查看/编辑</el-button>
        </el-form-item>
        <el-form-item :label="Listlables[formData.lottery_send_type - 1]">
          <el-button type="primary" @click="visible[4] = true">查看/编辑</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-hasPerm="['lotteryConfig:save']" type="primary" @click="submitHandler" :loading="loading[1]">保存</el-button>
      </template>
    </el-card>
    <explain :data="formData" v-model="visible[0]" @finish="getData" />
    <prizeList :data="formData" v-model="visible[1]" :disabled="!hasAuth('lotteryConfig:registPrize')" @finish="getData" _key="lottery_register_prize_set" title="注册奖品设置" />
    <prizeList :data="formData" v-model="visible[2]" :disabled="!hasAuth('lotteryConfig:invitePrize')" @finish="getData" _key="lottery_invite_prize_set" title="邀请奖品设置" />
    <prizeList :data="formData" v-model="visible[3]" :disabled="!hasAuth('lotteryConfig:rechargePrize')" @finish="getData" _key="lottery_recharge_prize_set" title="充值奖品设置" />
    <recharge v-model="visible[4]" :title="Listlables[formData.lottery_send_type - 1]" :index="formData.lottery_send_type" />
  </div>
</template>

<script setup lang="ts">
import explain from "./components/explain.vue";
import prizeList from "./components/prizeList.vue";
import recharge from "./components/recharge.vue";
import api, { type Form } from "@/api/system/lotteryConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { hasAuth } from "@/plugins/permission";

const formData = reactive<Form>({});
const visible = ref([false]);
const loading = reactive<boolean[]>([]);
async function getData() {
  loading[0] = true;
  const res = await api.getLotteryConfig();
  Object.assign(formData, res);
  loading[0] = false;
}
getData();
async function submitHandler() {
  loading[1] = true;
  await api.setLotteryConfig(formData);
  loading[1] = false;
}

const Listlables = ["每日充值抽奖次数配置", "单次充值抽奖次数配置", "终身充值抽奖次数配置"];
</script>

<style></style>
