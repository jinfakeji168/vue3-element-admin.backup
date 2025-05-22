<template>
  <div class="search-bar" v-if="queryParams">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <div class="basic-form">
        <div class="form-content">
          <el-form-item label="ID" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入id" />
          </el-form-item>
          <el-form-item label="账户" prop="account">
            <el-input v-model="queryParams.account" placeholder="请输入账户" />
          </el-form-item>
          <el-form-item label="邀请码" prop="invita_code">
            <el-input v-model="queryParams.invita_code" placeholder="请输入邀请码" />
          </el-form-item>
        </div>
        <div class="form-buttons">
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="searchHandler">
              <template #icon>
                <Search />
              </template>
              搜索
            </el-button>
            <el-button @click="resetHandler">
              <template #icon>
                <Refresh />
              </template>
              重置
            </el-button>
            <el-button type="primary" link @click="is_expand = !is_expand">
              {{ is_expand ? "收起" : "展开" }}
              <el-icon class="el-icon--right">
                <component :is="is_expand ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </el-button>
          </el-form-item>
        </div>
      </div>

      <div class="advanced-form" :class="{ 'advanced-form--show': is_expand }">
        <el-form-item label="注册时间" prop="created_at">
          <el-date-picker v-model="queryParams.created_at" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="注册IP" prop="register_ip">
          <el-input v-model="queryParams.register_ip" placeholder="请输入注册IP" />
        </el-form-item>
        <el-form-item label="最后登录时间" prop="last_login_time">
          <el-date-picker v-model="queryParams.last_login_time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="最后登录IP" prop="last_login_ip">
          <el-input v-model="queryParams.last_login_ip" placeholder="请输入最后登录IP" />
        </el-form-item>
        <el-form-item label="用户组ID" prop="group_id">
          <el-input v-model="queryParams.group_id" placeholder="请输入用户组ID" />
        </el-form-item>
        <el-form-item label="最后充值时间" prop="last_recharge_time">
          <el-date-picker v-model="queryParams.last_recharge_time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="总充值金额" prop="min_total_recharge_amount">
          <el-input-number v-model="queryParams.min_total_recharge_amount" placeholder="最小充值金额" />
          至
          <el-input-number v-model="queryParams.max_total_recharge_amount" placeholder="最大充值金额" />
        </el-form-item>
        <el-form-item label="总提现金额" prop="min_total_withdrawal_amount">
          <el-input-number v-model="queryParams.min_total_withdrawal_amount" placeholder="最小提现金额" />
          至
          <el-input-number v-model="queryParams.max_total_withdrawal_amount" placeholder="最大提现金额" />
        </el-form-item>
        <el-form-item label="经纪人账户" prop="min_brokerage_account">
          <el-input-number v-model="queryParams.min_brokerage_account" placeholder="最小金额" />
          至
          <el-input-number v-model="queryParams.max_brokerage_account" placeholder="最大金额" />
        </el-form-item>
        <el-form-item label="最后提现金额" prop="last_withdrawal_amount">
          <el-input-number v-model="queryParams.last_withdrawal_amount" placeholder="请输入最后提现金额" />
        </el-form-item>
        <el-form-item label="提现钱包" prop="withdrawal_wallet">
          <el-input v-model="queryParams.withdrawal_wallet" placeholder="请输入提现钱包" />
        </el-form-item>
        <el-form-item label="充值钱包" prop="recharge_wallet">
          <el-input v-model="queryParams.recharge_wallet" placeholder="请输入充值钱包" />
        </el-form-item>
        <el-form-item label="语言ID" prop="lang_id">
          <el-input v-model="queryParams.lang_id" placeholder="请输入语言ID" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable class="!w-[100px]">
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="vip_level">
          <el-input v-model="queryParams.vip_level" placeholder="请输入等级" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { MemberQuery } from "@/api/members/memberList";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import { ref } from "vue";

/** 展开/收起状态*/
const is_expand = ref(false);

/** 搜索表单组件属性定义*/
const queryParams = defineModel<MemberQuery>({});

/**定义组件事件*/
const emits = defineEmits<{
  /** 搜索事件 */
  search: [];
  /** 重置事件 */
  reset: [];
}>();

/** 搜索处理函数*/
function searchHandler() {
  emits("search");
}

/** 重置处理函数*/
function resetHandler() {
  emits("reset");
}

const queryFormRef = ref<FormInstance>();
const resetFields = computed(() => {
  return queryFormRef.value?.resetFields;
});
defineExpose({
  resetFields,
});
</script>

<style scoped lang="scss">
.search-bar {
  .basic-form {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .form-content {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
    }

    .form-buttons {
      margin-left: 16px;
      white-space: nowrap;
    }
  }

  .advanced-form {
    margin-top: 8px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.3s ease-in-out;

    &--show {
      height: auto;
      opacity: 1;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}
</style>
