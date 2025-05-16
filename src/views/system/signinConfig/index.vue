<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>签到配置</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item label="签到开关" prop="lottery_is_open">
          <el-radio-group v-model="formData.sign_is_enable">
            <el-radio :value="StatusEnum.False">开启</el-radio>
            <el-radio :value="StatusEnum.True">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签到赠送金额到账账户" prop="lottery_is_pop">
          <el-radio-group v-model="formData.sign_give_account">
            <el-radio :value="1">基础账户</el-radio>
            <el-radio :value="2">佣金账户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="签到所需最低等级">
          <el-select v-model="formData.sign_min_level" style="width: 240px">
            <el-option v-for="item of store.vipList.value" :key="item.id" :label="item.title" :value="item.level" />
          </el-select>
        </el-form-item>
        <el-form-item label="每日充值抽奖次数配置">
          <el-button type="primary" @click="visible[0] = true">查看/编辑</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitHandler" :loading="loading[1]">保存</el-button>
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
