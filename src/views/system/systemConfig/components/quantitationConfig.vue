<template>
  <el-form label-width="240px">
    <el-form-item label="用户端展示收益率类型">
      <el-radio-group v-model="getI('task_show_income_type').values">
        <el-radio :label="1">显示单次量化收益率</el-radio>
        <el-radio :label="2">显示每日量化收益率</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="自动解锁会员等级">
      <el-switch v-model="getI('auto_unlock_level').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item label="自动开启升级才能量化">
      <el-tooltip effect="dark" placement="top" content="等级设置邀请才能升级时，会员量化金额超过等级解锁金额自动开启升级才能量化">
        <el-switch v-model="getI('auto_is_upgrade_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex-center">
          量化币种
          <el-tooltip effect="dark" placement="top">
            <template #content>不设置代表随机币种量化</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-select v-model="getI('quan_currency').values" placeholder="请选择量化币种">
        <el-option v-for="item in store.tradeList" :key="item.key" :label="item.val" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex-center">
          量化过程时间(秒)
          <el-tooltip effect="dark" placement="top">
            <template #content>开始量化到结束量化需要多长时间，单位秒</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-input-number v-model="getI('quan_time').values" :min="1" placeholder="请输入量化过程时间" />
    </el-form-item>
    <el-form-item label="量化重置方式">
      <el-radio-group v-model="getI('task_reset_type').values">
        <el-radio :label="1">绝对24小时</el-radio>
        <el-radio :label="2">某个时间点重置</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="getI('task_reset_type').values === 2">
      <el-form-item label="网站使用时区">
        <el-select v-model="getI('show_data_time').values" placeholder="请选择网站使用时区">
          <el-option v-for="item in store.timeZoneList" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="量化重置时间">
        <el-time-picker v-model="getI('quant_reset_time').values" format="HH:mm" value-format="HH:mm" placeholder="请选择量化重置时间" />
      </el-form-item>
    </template>
    <el-form-item label="是否开启体验金">
      <el-tooltip effect="dark" placement="top" content="开启后体验金可以作为量化本金计算利润">
        <el-switch v-model="getI('is_show_experience').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>

    <el-form-item label="注册赠送体验金">
      <el-input-number v-model="getI('register_give_experience').values" :min="0" placeholder="请输入注册赠送体验金金额" />
    </el-form-item>

    <el-form-item label="体验金有效期天数">
      <el-input-number v-model="getI('experience_validity_period').values" :min="1" placeholder="请输入体验金有效期天数" />
    </el-form-item>

    <el-form-item label="体验金是否参与解锁等级">
      <el-switch v-model="getI('experience_is_level').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="用户首充后是否清理体验金">
      <el-switch v-model="getI('recharge_empty_experience').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex-center">
          量化概率值类型
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div>1.按概率值控制最大收益：用户收益=用户量化账户余额*（收益范围随机值-收益率最小值）*用户概率值%+收益率最小值）*（1-平台服务费%）</div>
              <div>2.按概率值折扣：用户收益=用户量化账户余额*收益率范围随机值*用户最终收益折扣%*（1-平台服务费%）</div>
            </template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-radio-group v-model="getI('quan_income_probability_type').values">
        <el-radio :label="1">按概率值控制最大收益</el-radio>
        <el-radio :label="2">按概率值折扣</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="量化收益账户">
      <el-radio-group v-model="getI('task_brokerage_account').values">
        <el-radio :label="1">量化账户</el-radio>
        <el-radio :label="2">佣金账户</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="升级是否重置新的量化次数">
      <el-tooltip effect="dark" placement="top" content="比如会员充值VIP1做完量化后当天再充值VIP2是否要让他继续做量化">
        <el-switch v-model="getI('is_upgrade_reset_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>

    <el-form-item label="最后一次量化是否归零等级">
      <el-switch v-model="getI('last_task_clear_level').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="到期是否归还解锁本金">
      <el-switch v-model="getI('last_task_clear_level_type').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="归还解锁本金账户">
      <el-radio-group v-model="getI('level_unlock_return_type').values">
        <el-radio :label="1">量化账户</el-radio>
        <el-radio :label="2">佣金账户</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否开启量化">
      <el-tooltip effect="dark" placement="top" content="关闭后全体用户都不能做量化">
        <el-switch v-model="getI('is_distribute_task').values" :active-value="1" :inactive-value="2" />
      </el-tooltip>
    </el-form-item>
  </el-form>
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
