<template>
  <el-dialog v-model="visible" title="批量操作" width="80%">
    <el-tabs v-model="activeTab" tab-position="left" type="border-card">
      <el-tab-pane v-for="(tab, index) of tabs" :key="index" :label="tab.label" :name="index"></el-tab-pane>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="批量方式" prop="batch_type" v-if="tabs[activeTab].batchWay.length">
          <el-radio-group v-model="formData.batch_type">
            <el-radio v-for="item of tabs[activeTab].batchWay" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="formData.batch_type === 1">
          <el-form-item label="会员账户" prop="accountInput">
            <el-input type="textarea" v-model="accountInput" placeholder="请输入会员账户，多个会员账户用逗号隔开" />
          </el-form-item>
        </template>
        <template v-else-if="formData.batch_type === 2">
          <el-form-item label="会员等级" prop="old_vip_level">
            <el-select v-model="formData.old_vip_level">
              <el-option v-for="item of store.vipList" :key="item.id" :value="item.level" :label="item.title" />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间" prop="register_time">
            <el-date-picker v-model="formData.register_time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
        </template>
        <template v-else-if="formData.batch_type === 3">
          <el-form-item label="充提差" prop="charge_mention_diff">
            <el-input v-model="formData.charge_mention_diff" placeholder="请输入充提差" />
          </el-form-item>
        </template>
        <template v-else-if="formData.batch_type === 4">
          <el-form-item label="指定会员所有下级" prop="spec_account">
            <el-input type="textarea" v-model="formData.spec_account" placeholder="请输入会员账户" />
          </el-form-item>
        </template>
        <template v-else-if="formData.batch_type === 5">
          <el-form-item label="分组" prop="group_id">
            <!-- <el-select v-model="formData.group_id">
              <el-option v-for="item of store.groupList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select> -->
          </el-form-item>
        </template>
        <hr />
        <template v-if="activeTab === 0">
          <el-form-item label="调整后等级" prop="new_vip_level">
            <el-select v-model="formData.new_vip_level">
              <el-option v-for="item of store.vipList" :key="item.id" :value="item.level" :label="item.title" />
            </el-select>
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 1">
          <el-form-item label="升级才能做量化" prop="is_upgrade_quant">
            <el-radio-group v-model="formData.is_upgrade_quant">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 2">
          <el-form-item label="量化开关" prop="is_quant">
            <el-radio-group v-model="formData.is_quant">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 3">
          <el-form-item label="收益折扣" prop="quant_final_earnings_discount">
            <el-input v-model="formData.quant_final_earnings_discount" placeholder="请输入收益折扣" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 5">
          <el-form-item label="邀请量化" prop="is_invite_user_quant">
            <el-radio-group v-model="formData.is_invite_user_quant">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邀请用户数量" prop="quant_invite_user_number">
            <el-input v-model.number="formData.quant_invite_user_number" placeholder="请输入邀请用户数量" />
          </el-form-item>
          <el-form-item label="邀请充值金额" prop="quant_invite_user_recharge_amount">
            <el-input v-model.number="formData.quant_invite_user_recharge_amount" placeholder="请输入邀请用户充值金额" />
          </el-form-item>
          <el-form-item label="有效时间" prop="quant_invite_user_effective_time">
            <el-date-picker v-model="formData.quant_invite_user_effective_time" type="datetime" placeholder="选择有效时间" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 6">
          <el-form-item label="封禁类型" prop="ban_type">
            <el-checkbox-group v-model="formData.ban_type">
              <el-checkbox :label="1">登录</el-checkbox>
              <el-checkbox :label="2">提款</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="操作类型" prop="operation">
            <el-radio-group v-model="formData.operation">
              <el-radio :label="1">封禁</el-radio>
              <el-radio :label="2">解封</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 7">
          <el-form-item label="操作对象" prop="op_type">
            <el-radio-group v-model="formData.op_type">
              <el-radio :label="1">量化账户余额</el-radio>
              <el-radio :label="2">充值金额</el-radio>
              <el-radio :label="3">佣金账户余额</el-radio>
              <el-radio :label="4">智能账户余额</el-radio>
              <el-radio :label="5">体验金余额</el-radio>
              <el-radio :label="6">秒合约余额</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="变动类型" prop="change_type">
            <el-radio-group v-model="formData.change_type">
              <el-radio :label="1">减少</el-radio>
              <el-radio :label="2">增加</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="变动金额" prop="change_amount">
            <el-input v-model.number="formData.change_amount" placeholder="请输入变动金额" />
          </el-form-item>
          <el-form-item label="备注" prop="change_remark">
            <el-input v-model="formData.change_remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 8">
          <el-form-item label="赠送类型" prop="lottery_type">
            <el-radio-group v-model="formData.lottery_type">
              <el-radio :label="1">注册赠送次数</el-radio>
              <el-radio :label="2">邀请赠送次数</el-radio>
              <el-radio :label="3">充值赠送次数</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="赠送次数" prop="gift_number">
            <el-input v-model.number="formData.gift_number" placeholder="请输入赠送次数" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 9">
          <el-form-item label="投资类型" prop="invest_type">
            <el-radio-group v-model="formData.invest_type">
              <el-radio :label="1">提现买投资</el-radio>
              <el-radio :label="2">量化买投资</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投资产品" prop="invest_product">
            <el-checkbox-group v-model="formData.invest_product">
              <el-checkbox label="product1">产品1</el-checkbox>
              <el-checkbox label="product2">产品2</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="有效时间" prop="effective_time">
            <el-date-picker v-model="formData.effective_time" type="datetime" placeholder="选择有效时间" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 10">
          <el-form-item label="输赢概率" prop="second_contract_win_lose_ratio">
            <el-input v-model.number="formData.second_contract_win_lose_ratio" placeholder="请输入概率" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 11">
          <el-form-item label="升级才能提现" prop="is_upgrade_withdrawal">
            <el-radio-group v-model="formData.is_upgrade_withdrawal">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 12">
          <el-form-item label="邀请提现" prop="is_invite_user_withdrawal">
            <el-radio-group v-model="formData.is_invite_user_withdrawal">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提现次数" prop="withdrawal_number">
            <el-input v-model.number="formData.withdrawal_number" placeholder="请输入提现次数" />
          </el-form-item>
          <el-form-item label="邀请用户数量" prop="withdrawal_invite_user_number">
            <el-input v-model.number="formData.withdrawal_invite_user_number" placeholder="请输入邀请用户数量" />
          </el-form-item>
          <el-form-item label="邀请充值金额" prop="withdrawal_invite_user_recharge_amount">
            <el-input v-model.number="formData.withdrawal_invite_user_recharge_amount" placeholder="请输入邀请用户充值金额" />
          </el-form-item>
          <el-form-item label="有效时间" prop="withdrawal_invite_user_effective_time">
            <el-date-picker v-model="formData.withdrawal_invite_user_effective_time" type="datetime" placeholder="选择有效时间" />
          </el-form-item>
        </template>
        <template v-else-if="activeTab === 13">
          <el-form-item label="新分组" prop="new_group_id">
            <!-- <el-select v-model="formData.new_group_id" placeholder="请选择新分组">
              <el-option v-for="item in store.groupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select> -->
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="submitForm">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type BatchOperationForm } from "@/api/members/memberList";
import { useStore } from "@/store/modules/common";
const store = useStore();
const visible = defineModel<boolean>();
const props = withDefaults(defineProps<{ account?: { id: number; account: string }[] }>(), {});

const activeTab = ref<number>(0);
const batchTypeOptions = [
  { label: "指定会员", value: 1 },
  { label: "按等级", value: 2 },
  { label: "充提差", value: 3 },
  { label: "指定会员下级", value: 4 },
  { label: "按分组", value: 5 },
];

const tabs = [
  { label: "等级修改", batchWay: batchTypeOptions.slice(0, 2) },
  { label: "升级量化", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "量化开关", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "收益折扣", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "佣金转量化", batchWay: batchTypeOptions.slice(0, 0) },
  { label: "邀请量化", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "封禁", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "余额修改", batchWay: batchTypeOptions.slice(0, 0) },
  { label: "赠送抽奖", batchWay: batchTypeOptions.slice(0, 0) },
  { label: "强制投资", batchWay: batchTypeOptions.slice(0, 2) },
  { label: "秒合约概率", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "升级提现", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "邀请提现", batchWay: batchTypeOptions.slice(0, 5) },
  { label: "分组", batchWay: batchTypeOptions.slice(0, 5) },
];

const formRef = ref();
const formData = ref<BatchOperationForm>({
  batch_type: 1,
  is_upgrade_quant: 2,
  is_quant: 2,
  is_invite_user_quant: 2,
  ban_type: [],
  operation: 1,
  op_type: 1,
  change_type: 1,
  lottery_type: 1,
  invest_type: 1,
  invest_product: [],
  is_upgrade_withdrawal: 2,
  is_invite_user_withdrawal: 2,
  withdrawal_number: 0,
  gift_number: 0,
});

const accountInput = ref<string>();
const rules = {
  batch_type: [{ required: true, message: "请选择批量操作类型", trigger: "change" }],
  old_vip_level: [{ required: true, message: "请选择原等级", trigger: "change" }],
  register_time: [{ required: true, message: "请选择注册时间范围", trigger: "change" }],
  new_vip_level: [{ required: true, message: "请选择新等级", trigger: "change" }],
  is_upgrade_quant: [{ required: true, message: "请选择是否升级才能做量化", trigger: "change" }],
  is_quant: [{ required: true, message: "请选择量化开关状态", trigger: "change" }],
  quant_final_earnings_discount: [{ required: true, message: "请输入收益折扣", trigger: "blur" }],
  is_invite_user_quant: [{ required: true, message: "请选择是否需要邀请量化", trigger: "change" }],
  ban_type: [{ required: true, message: "请选择封禁类型", trigger: "change" }],
  operation: [{ required: true, message: "请选择操作类型", trigger: "change" }],
  op_type: [{ required: true, message: "请选择操作对象", trigger: "change" }],
  change_type: [{ required: true, message: "请选择变动类型", trigger: "change" }],
  change_amount: [{ required: true, message: "请输入变动金额", trigger: "blur" }],
  lottery_type: [{ required: true, message: "请选择赠送类型", trigger: "change" }],
  gift_number: [{ required: true, message: "请输入赠送次数", trigger: "blur" }],
  invest_type: [{ required: true, message: "请选择投资类型", trigger: "change" }],
  invest_product: [{ required: true, message: "请选择投资产品", trigger: "change" }],
  effective_time: [{ required: true, message: "请选择有效时间", trigger: "change" }],
  second_contract_win_lose_ratio: [{ required: true, message: "请输入概率", trigger: "blur" }],
  is_upgrade_withdrawal: [{ required: true, message: "请选择是否升级才能提现", trigger: "change" }],
  is_invite_user_withdrawal: [{ required: true, message: "请选择是否邀请提现", trigger: "change" }],
  withdrawal_number: [{ required: true, message: "请输入提现次数", trigger: "blur" }],
  withdrawal_invite_user_number: [{ required: true, message: "请输入邀请用户数量", trigger: "blur" }],
  withdrawal_invite_user_recharge_amount: [{ required: true, message: "请输入邀请充值金额", trigger: "blur" }],
  withdrawal_invite_user_effective_time: [{ required: true, message: "请选择有效时间", trigger: "change" }],
  new_group_id: [{ required: true, message: "请选择新分组", trigger: "change" }],
};

watch(visible, (val) => {
  if (val) {
    accountInput.value = props.account?.map((val: any) => val.account).join(",");
    Object.assign(formData.value, {
      batch_type: 1,
    });
  }
});

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  try {
    // TODO: 调用API进行等级修改
    ElMessage.success("修改成功");
    visible.value = false;
  } catch (error) {
    console.error(error);
    ElMessage.error("修改失败");
  }
};
</script>

<style scoped>
.selected-accounts {
  line-height: 32px;
  color: #666;
}
</style>
