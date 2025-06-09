<template>
  <el-form label-width="240px">
    <el-collapse>
      <el-collapse-item title="出款账户" name="1">
        <el-form-item label="TRC20出款账户地址">
          <el-input v-model="getI('payment_wallet').values" placeholder="请输入TRC20出款账户地址" />
        </el-form-item>
        <el-form-item label="BEP20出款账户地址">
          <el-input v-model="getI('bep20_payment_wallet').values" placeholder="请输入BEP20出款账户地址" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="提现配置" name="2">
        <el-form-item label="提现开关">
          <el-switch v-model="getI('extract_switch').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="充值大于多少允许提现">
          <el-input-number v-model="getI('recharge_num_is_withdrawal').values" :min="0" placeholder="充值大于多少允许提现" />
        </el-form-item>
        <el-form-item label="用户出款功能激活方式">
          <el-radio-group v-model="getI('extract_activation').values">
            <el-radio :label="1">升级VIP0以上</el-radio>
            <el-radio :label="2">升级VIP0以上或购买投资</el-radio>
            <el-radio :label="3">注册即激活</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每日提现次数">
          <el-input-number v-model="getI('extract_num_day').values" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="只允许一个提现通道">
          <el-switch v-model="getI('extract_address_channel').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="允许修改取款地址">
          <el-switch v-model="getI('is_change_withdrawal_address').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="允许重复取款地址">
          <el-switch v-model="getI('is_repeat_withdrawal_address').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="首次提现需联系方式">
          <el-switch v-model="getI('extract_input_contact').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="自动出款开关">
          <el-switch v-model="getI('auto_payment').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="自动出款安全值">
          <el-input-number v-model="getI('auto_payment_safety_value').values" :min="0" />
        </el-form-item>
        <el-form-item label="最小提现配置">
          <el-radio-group v-model="getI('min_extract_config').values">
            <el-radio :label="1">全局</el-radio>
            <el-radio :label="2">局部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="取款说明设置">
          <el-button type="primary" @click="visible[0] = true">查看/编辑</el-button>
        </el-form-item>
        <el-form-item label="提现自动触发设置">
          <el-button type="primary" @click="visible[1] = true">查看/编辑</el-button>
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="手续费设置" name="3">
        <el-form-item label="免手续费笔数">
          <el-input-number v-model="getI('free_fee_num').values" :min="0" />
        </el-form-item>
        <el-form-item label="免手续费笔数类型">
          <el-radio v-model="getI('free_fee_num_type').values" :label="1">每日次数</el-radio>
          <el-radio v-model="getI('free_fee_num_type').values" :label="2">总次数</el-radio>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <explain v-model="visible[0]" :data="getI('withdraw_instructions_settings').values" />
  <withdraw-auto-trigger v-model="visible[1]" />
</template>

<script setup lang="ts">
import explain from "./parts/explain.vue";
import withdrawAutoTrigger from "./parts/withdrawAutoTrigger.vue";
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false, false]);
</script>

<style></style>
