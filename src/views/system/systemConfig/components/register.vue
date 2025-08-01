<template>
  <el-form label-width="240px">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本注册设置" name="1">
        <el-form-item label="用户uid自增设置">
          <div class="flex flex-row">
            <el-input-number v-model="current_autoIncrementId" style="margin-right: 14px" :min="originId" :disabled="!current_autoIncrementId" />
            <el-button @click="getAutoIncrementId" :loading="loading">查询</el-button>
            <el-button type="primary" @click="setAutoIncrementId" :loading="loading" :disabled="!current_autoIncrementId || current_autoIncrementId == originId">修改</el-button>
          </div>
        </el-form-item>
        <el-form-item label="注册发送站内信">
          <el-switch v-model="getI('is_register_message').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="注册是否开启验证码">
          <el-switch v-model="getI('register_is_captcha').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="重复密码">
          <el-tooltip content="注册时是否开启重复一遍密码（登陆密码及安全密码）" placement="top">
            <el-switch v-model="getI('is_repeat_password').values" :active-value="1" :inactive-value="2" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="安全密码">
          <el-radio-group v-model="getI('security_password_type').values">
            <el-radio :label="1">注册时填写</el-radio>
            <el-radio :label="2">提现时填写</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用的注册方式">
          <el-checkbox-group v-model="getI('register_account_status').values" :min="1">
            <el-checkbox :label="1">用户名注册</el-checkbox>
            <el-checkbox :label="2">邮箱注册</el-checkbox>
            <el-checkbox :label="3">手机号注册</el-checkbox>
            <el-checkbox :label="4">telegram注册</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="用户名注册是否开启">
          <el-switch v-model="getI('username_register_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item> -->
        <template v-if="getI('register_account_status').values.includes(1)">
          <el-form-item label="用户名注册时是否需填邮箱">
            <el-switch v-model="getI('username_register_email').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item label="用户名注册时是否需填手机号">
            <el-switch v-model="getI('username_register_phone').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
        </template>
        <!-- <el-form-item label="telegram注册">
          <el-switch v-model="getI('telegram_register_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item> -->
        <el-form-item label="telegram小程序自动注册登录" v-if="getI('register_account_status').values.includes(4)">
          <el-switch v-model="getI('tg_auto_login').values" :active-value="1" :inactive-value="2" />
        </el-form-item>

        <template v-if="getI('register_account_status').values.includes(3)">
          <el-form-item label="手机号注册时是否需填写邮箱">
            <el-switch v-model="getI('phone_register_email_status').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item label="手机号最低长度">
            <el-input-number v-model="getI('register_phone_length').values" :min="0" placeholder="手机号最低长度" />
          </el-form-item>
        </template>
        <el-form-item label="同IP个数限制">
          <template #label>
            <div class="flex-center">
              同IP个数限制
              <el-tooltip content="同IP可注册账号个数限制，限制时间根据类型决定" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('ip_register_limit').values" :min="0" placeholder="" />
        </el-form-item>
        <el-form-item label="同IP个数限制类型">
          <template #label>
            <div class="flex-center">
              同IP个数限制类型
              <el-tooltip content="总次数代表该IP永久只能注册几次" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-radio-group v-model="getI('ip_register_limit_type').values">
            <el-radio :label="1">每日次数</el-radio>
            <el-radio :label="2">总次数</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="getI('register_account_status').values.includes(2)">
          <el-form-item label="邮箱注册时是否需要验证邮箱">
            <el-switch v-model="getI('is_verify_email_code').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <template v-if="getI('is_verify_email_code').values == 1">
            <el-form-item label="注册邮箱验证码有效期(分钟)">
              <el-input-number v-model="getI('register_code_valid_time').values" :min="0" placeholder="注册邮箱验证码有效期(分钟)" />
            </el-form-item>
            <el-form-item label="单个ip注册邮箱验证码次数(24h)">
              <el-input-number v-model="getI('register_email_code_num').values" :min="0" placeholder="单个ip注册邮箱验证码次数(24h)" />
            </el-form-item>
          </template>
        </template>
      </el-collapse-item>

      <el-collapse-item title="注册赠送配置" name="2">
        <el-form-item label="注册赠送量化金额">
          <el-input-number v-model="getI('register_give_money').values" :min="0" placeholder="注册赠送量化金额" />
        </el-form-item>
        <el-form-item label="注册赠送合约金额">
          <el-input-number v-model="getI('register_send_contract_money').values" :min="0" placeholder="注册赠送合约金额" />
        </el-form-item>
        <el-form-item label="注册赠送虚拟金额">
          <el-input-number v-model="getI('register_virtual_money').values" :min="0" placeholder="注册赠送虚拟金额，只显示不参与量化" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="推荐配置" name="3">
        <el-form-item label="推荐人">
          <el-radio-group v-model="getI('is_need_spreader').values">
            <el-radio :label="1">必填</el-radio>
            <el-radio :label="2">选填</el-radio>
            <el-radio :label="3">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邀请码类型">
          <el-radio-group v-model="getI('invite_link_type').values">
            <el-radio :label="1">纯数字</el-radio>
            <el-radio :label="2">纯字母</el-radio>
            <el-radio :label="3">数字字母组合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效用户充值金额">
          <el-input-number v-model="getI('recharge_num_valid_user').values" :min="0" placeholder="用户充值多少金额为有效用户" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="登录配置" name="4">
        <el-form-item label="启用图形验证码错误次数">
          <el-input-number v-model="getI('error_to_show_pic').values" :min="0" placeholder="登录密码输入错误几次后启用图形验证码" />
        </el-form-item>
        <el-form-item label="封停账号错误次数">
          <template #label>
            <div class="flex-center">
              封停账号错误次数
              <el-tooltip content="连续输入几次错误的密码封停账号登录权限" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('error_to_ban').values" :min="0" placeholder="" />
        </el-form-item>
        <el-form-item label="封停账号时长（分钟）">
          <template #label>
            <div class="flex-center">
              封停账号时长（分钟）
              <el-tooltip content="封停账号登录多长时间，单位分钟" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('login_error_lock_time').values" :min="0" placeholder="" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="找回密码配置" name="5">
        <el-form-item label="邮箱验证码有效期（分钟）">
          <el-input-number v-model="getI('code_valid_time').values" :min="0" placeholder="邮箱验证码有效期（分钟）" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="flex-center">
              邮箱验证码次数
              <el-tooltip content="24小时内同一个ip找回密码邮箱验证码次数限制" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('pwd_email_code_num').values" :min="0" placeholder="邮箱验证码次数" />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup lang="ts">
import systemConfig, { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const activeNames = ["1", "2", "3", "4", "5"];
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false, false]);

const current_autoIncrementId = ref();
const originId = ref();
async function getAutoIncrementId() {
  loading.value = true;
  try {
    const res = await systemConfig.getAutoIncrementId();
    current_autoIncrementId.value = res.max_uid;
    originId.value = res.max_uid;
  } finally {
    loading.value = false;
  }
}

const loading = ref(false);
async function setAutoIncrementId() {
  await ElMessageBox.confirm("是否确认修改用户自增ID", "提示", {});
  if (current_autoIncrementId.value != originId.value) {
    loading.value = true;
    try {
      await systemConfig.setAutoIncrementId(current_autoIncrementId.value);
      originId.value = current_autoIncrementId.value;
    } finally {
      loading.value = false;
    }
  }
}
defineExpose({
  setAutoIncrementId,
});
</script>

<style>
.tips {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}
</style>
