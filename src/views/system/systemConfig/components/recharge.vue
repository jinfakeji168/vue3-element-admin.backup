<template>
  <el-form label-width="240px">
    <el-form-item label="充值返利类型">
      <el-radio-group v-model="getI('vip_rebate_type').values">
        <el-radio :label="1">仅限充值在量化账户才可三级返利</el-radio>
        <el-radio :label="2">充值量化账户及智能账户都可三级返利</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="充值返利账户">
      <el-radio-group v-model="getI('recharge_rebate_account').values">
        <el-radio :label="1">量化账户</el-radio>
        <el-radio :label="2">佣金账户</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 首充送款相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          首充送款开关
          <el-tooltip effect="dark" placement="top">
            <template #content>首充送款开关，打开后首次充值可获得赠送</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_first_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="首充送款账户">
      <el-radio-group v-model="getI('first_recharge_send_account').values">
        <el-radio :label="1">量化账户</el-radio>
        <el-radio :label="2">佣金账户</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <template #label>
        <div class="flex-center">
          首充送款配置类型
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div>统一配置：只设置一个送款金额比例</div>
              <div>区间配置：可以设置多个不同区间赠送不同比例的金额</div>
            </template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-radio-group v-model="getI('first_recharge_config_type').values">
        <el-radio :label="1">统一配置</el-radio>
        <el-radio :label="2">区间配置</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <template #label>
        <div class="flex-center">
          首充送款最低金额
          <el-tooltip effect="dark" placement="top">
            <template #content>首充送款条件：充值金额大于等于x（最低要求），设置0不限制金额</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-input-number v-model="getI('first_charge_rebate_min').values" :min="0" placeholder="设置0不限制金额" />
    </el-form-item>

    <el-form-item label="首充送款比例(%)">
      <el-input-number v-model="getI('first_charge_rebate_percent').values" :min="0" :max="100" placeholder="自由设置百分比" />
    </el-form-item>

    <el-form-item>
      <template #label>
        <div class="flex-center">
          首充送款封顶
          <el-tooltip effect="dark" placement="top">
            <template #content>首充送款额度：单次封顶设置，可选0不封顶</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-input-number v-model="getI('first_charge_rebate_cap').values" :min="0" placeholder="可选0不封顶" />
    </el-form-item>

    <!-- 复充送款相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          复充送款开关
          <el-tooltip effect="dark" placement="top">
            <template #content>复充送款开关，打开后非首次充值也可获得赠送</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_again_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="复充送款最低金额">
      <el-input-number v-model="getI('again_charge_rebate_min').values" :min="0" placeholder="设置0不限制金额" />
    </el-form-item>

    <!-- 团队充值奖励相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          团队充值满额奖励开关
          <el-tooltip effect="dark" placement="top">
            <template #content>团队充值满额奖励开关，打开后团队充值达到条件可获得奖励</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_team_again_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="团队充值奖励账户">
      <el-radio-group v-model="getI('give_team_brokerage_account').values">
        <el-radio :label="1">量化账户</el-radio>
        <el-radio :label="2">佣金账户</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="充值奖励设置类型">
      <el-radio-group v-model="getI('give_team_type').values">
        <el-radio :label="1">单个设置</el-radio>
        <el-radio :label="2">区间设置</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="团队充值奖励区间配置">
      <el-button @click="visible[0] = true" type="primary">查看/编辑</el-button>
    </el-form-item>
  </el-form>
  <team-recharge-award v-model="visible[0]" />
</template>

<script setup lang="ts">
import teamRechargeAward from "./parts/teamRechargeAward.vue";
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
