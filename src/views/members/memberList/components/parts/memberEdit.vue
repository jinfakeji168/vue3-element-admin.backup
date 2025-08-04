<template>
  <el-form ref="formRef" :model="memberForm" :rules="rules" label-width="140px">
    <div class="grid grid-cols-2">
      <!-- 基础信息 -->
      <el-card class="form-section" shadow="never" header="基础信息">
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="memberForm.account" disabled />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="memberForm.password" type="password" placeholder="为空表示不修改用户密码" show-password />
        </el-form-item>
        <el-form-item label="安全密码" prop="secure_password">
          <el-input v-model="memberForm.secure_password" type="password" placeholder="为空表示不修改安全密码" show-password />
        </el-form-item>
        <div class="flex flex-row gap2 w-full">
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="memberForm.email" placeholder="请输入用户邮箱" />
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone">
            <el-input v-model="memberForm.telephone" placeholder="请输入联系方式" />
          </el-form-item>
        </div>
        <div class="flex flex-row gap2 w-full">
          <el-form-item label="Telegram" prop="telegram">
            <el-input v-model="memberForm.telegram" placeholder="请输入Telegram" />
          </el-form-item>
          <el-form-item label="WhatsApp" prop="whatsapp">
            <el-input v-model="memberForm.whatsapp" placeholder="请输入WhatsApp" />
          </el-form-item>
        </div>
        <div class="flex flex-row gap2 w-full">
          <el-form-item label="注册IP" prop="register_ip">
            <el-input v-model="memberForm.register_ip" placeholder="103.172.183.82/新加坡" readonly disabled />
          </el-form-item>
          <el-form-item label="最后登录IP" prop="last_login_ip">
            <el-input v-model="memberForm.last_login_ip" placeholder="103.172.183.82/新加坡" readonly disabled />
          </el-form-item>
        </div>
      </el-card>

      <!-- 钱包信息 -->
      <el-card class="form-section" shadow="never" header="钱包信息">
        <el-form-item label="TRC20提现钱包" prop="trc20_withdrawal_wallet">
          <el-input v-model="memberForm.trc20_withdrawal_wallet" placeholder="请输入TRC20提现钱包地址" />
        </el-form-item>

        <el-form-item label="BEP20提现钱包" prop="bep20_withdrawal_wallet">
          <el-input v-model="memberForm.bep20_withdrawal_wallet" placeholder="请输入BEP20提现钱包地址" />
        </el-form-item>

        <el-form-item label="TRC20充值钱包" prop="trc20_recharge_wallet">
          <div class="flex flex-row gap2 w-full">
            <el-input v-model="memberForm.trc20_recharge_wallet" placeholder="TRC20充值钱包地址" disabled />
            <el-button type="primary" @click="changeWallet(1)">更换充值钱包</el-button>
          </div>
        </el-form-item>

        <el-form-item label="BEP20充值钱包" prop="bep20_recharge_wallet">
          <div class="flex flex-row gap2 w-full">
            <el-input v-model="memberForm.bep20_recharge_wallet" placeholder="BEP20充值钱包地址" disabled />
            <el-button type="primary" @click="changeWallet(1)">更换充值钱包</el-button>
          </div>
        </el-form-item>
      </el-card>

      <!-- 投资设置 -->
      <el-card class="form-section" shadow="never" header="投资设置">
        <el-form-item label="量化买投资" prop="quant_buy_invest">
          <el-select multiple v-model="memberForm.quant_buy_invest" placeholder="请选择量化买投资">
            <el-option v-for="item in investList" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="量化买投资有效时间" prop="quant_buy_invest_effective_time">
          <el-date-picker
            v-model="memberForm.quant_buy_invest_effective_time"
            type="datetime"
            placeholder="选择有效时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="提现买投资" prop="withdrawal_buy_invest">
          <el-select multiple v-model="memberForm.withdrawal_buy_invest" placeholder="请输入提现买投资">
            <el-option v-for="item in investList" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="买投资有效时间" prop="withdrawal_buy_invest_effective_time">
          <el-date-picker
            v-model="memberForm.withdrawal_buy_invest_effective_time"
            type="datetime"
            placeholder="选择有效时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-card>
      <!-- 用户设置 -->
      <el-card class="form-section" shadow="never" header="用户设置">
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="memberForm.remark" type="textarea" :rows="3" placeholder="请输入用户备注" />
        </el-form-item>
        <div class="flex flex-row">
          <el-form-item label="用户分组" prop="group_id">
            <el-select v-model="memberForm.group_id" placeholder="请选择用户分组" style="width: 200px">
              <el-option v-for="group in store.groupList" :label="group.title" :value="group?.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="VIP等级" prop="vip_level">
            <el-select v-model="memberForm.vip_level" placeholder="请选择VIP等级" style="width: 200px" clearable>
              <el-option v-for="i of vipList" :label="i.title" :value="i.level" />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex flex-row">
          <el-form-item label="量化最终收益折扣" prop="quant_final_earnings_discount">
            <template #label>
              <div class="flex-center">
                <span>量化最终收益折扣</span>
                <el-tooltip
                  content="默认值为100，代表用户做量化收益量化最终收益折扣，例如10做量化只有原收益的10%，大于100%则为放大，用户实际收益 = 原收益*最终收益折扣%"
                  placement="top"
                >
                  <el-icon style="font-size: 1rem"><el-icon-question-filled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number v-model="memberForm.quant_final_earnings_discount" :min="0" :max="1000" :precision="2" style="width: 200px" />
          </el-form-item>

          <el-form-item label="秒合约输赢概率" prop="second_contract_win_lose_ratio">
            <template #label>
              <div class="flex-center">
                <span>秒合约输赢概率</span>
                <el-tooltip content="开启秒合约玩法下有效，0代表不控制，根据实际涨跌判断输赢" placement="top">
                  <el-icon style="font-size: 1rem"><el-icon-question-filled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number v-model="memberForm.second_contract_win_lose_ratio" :min="0" :max="100" :precision="2" style="width: 200px" />
          </el-form-item>
        </div>
        <div class="flex flex-row">
          <el-form-item label="注册剩余抽奖次数" prop="vip_level">
            <el-input-number v-model="memberForm.register_remain_lottery_num" style="width: 200px" />
          </el-form-item>
          <el-form-item label="邀请剩余抽奖次数" prop="vip_level">
            <el-input-number v-model="memberForm.invite_remain_lottery_num" style="width: 200px" />
          </el-form-item>
        </div>
      </el-card>
      <!-- 提现限额设置 -->
      <el-card class="form-section" shadow="never" header="提现限额设置">
        <template #header>
          <span class="mr-4">提现限额设置</span>
          <span class="color-red">**设置0表示跟随系统币种设置值**</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小提现金额USDT/USDC" prop="min_withdrawal_amount_usdt">
              <el-input-number v-model="memberForm.min_withdrawal_amount_usdt" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大提现金额USDT/USDC" prop="max_withdrawal_amount_usdt">
              <el-input-number v-model="memberForm.max_withdrawal_amount_usdt" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小提现金额TRX" prop="min_withdrawal_amount_trx">
              <el-input-number v-model="memberForm.min_withdrawal_amount_trx" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大提现金额TRX" prop="max_withdrawal_amount_trx">
              <el-input-number v-model="memberForm.max_withdrawal_amount_trx" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小提现金额BNB" prop="min_withdrawal_amount_bnb">
              <el-input-number v-model="memberForm.min_withdrawal_amount_bnb" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大提现金额BNB" prop="max_withdrawal_amount_bnb">
              <el-input-number v-model="memberForm.max_withdrawal_amount_bnb" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 状态设置 -->
      <el-card class="form-section" shadow="never" header="状态设置">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户状态" prop="status">
              <el-switch v-model="memberForm.status" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提现状态" prop="withdrawal_status">
              <el-switch v-model="memberForm.withdrawal_status" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否能量化" prop="is_quant">
              <el-switch v-model="memberForm.is_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="邀请用户才能做量化" prop="is_invite_user_quant">
              <el-switch v-model="memberForm.is_invite_user_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否代理" prop="is_agent">
              <el-switch v-model="memberForm.is_agent" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否总代理" prop="is_total_agent">
              <el-switch v-model="memberForm.is_total_agent" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="升级才能做量化" prop="is_upgrade_quant">
              <el-switch v-model="memberForm.is_upgrade_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="升级才能提现" prop="is_upgrade_withdrawal">
              <el-switch v-model="memberForm.is_upgrade_withdrawal" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { MemberDetailData } from "@/api/members/memberList";
import { useStore } from "@/store/modules/common";
import api from "@/api/members/memberList";
import commApi from "@/api/common";
const store = useStore();
const vipList = computed(() => {
  const temp = store.vipList;
  temp.splice(0, 0, { level: 0, title: "普通用户", id: 0 });
  return temp;
});

const props = withDefaults(
  defineProps<{
    memberId?: number;
  }>(),
  {}
);
const memberForm = ref<MemberDetailData>({});
const rules = {};
async function getDetailData(id: number) {
  const result = await api.getMemberDetail(id);
  memberForm.value = result;
}
watch(
  () => props.memberId,
  (val) => {
    if (val) {
      getDetailData(val);
    }
  },
  { immediate: true }
);

const investList = ref<Awaited<ReturnType<typeof commApi.getInvestProductList>>>([]);
async function getInvestList() {
  const result = await commApi.getInvestProductList({ type: 2 });
  investList.value = result;
}
getInvestList();
async function submitForm() {
  return api.saveMemberDetail(memberForm.value);
}

async function changeWallet(type: number) {
  const res = await ElMessageBox.confirm("是否确认更换充值账户？原有充值账户将会被覆盖，无法恢复，请确保地址余额已归集后操作！", "警告", {});

  api.changeWallet({
    id: memberForm.value.id,
    type: type == 1 ? "trc20" : "bep20",
  });
}

defineExpose({
  submitForm,
});
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  line-height: normal;
  display: flex;
  align-items: center;
  text-align: right;
}
</style>
