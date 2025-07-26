<template>
  <el-form label-width="300px">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="网站信息" name="1">
        <el-form-item label="主题样式">
          <el-select v-model="getI('website_skin_style').values">
            <el-option v-for="item of themeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="网站logo">
          <uploadPart v-model="getI('website_logo').values" />
        </el-form-item>
        <el-form-item label="客服logo">
          <uploadPart v-model="getI('website_operator_icon').values" />
        </el-form-item>
        <el-form-item label="网站名称">
          <el-input v-model="getI('website_name').values" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="用户端配置" name="2">
        <el-form-item label="用户端团队-用户显示下级层级">
          <el-select v-model="getI('client_show_spread_level').values">
            <el-option v-for="item of groupLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户端团队-代理显示下级层级">
          <el-select v-model="getI('client_proxy_team_show_level').values">
            <el-option v-for="item of groupLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户端团队-统计时区">
          <el-radio-group v-model="getI('client_user_team_count_time').values">
            <el-radio :label="1">按系统时区</el-radio>
            <el-radio :label="2">按用户时区</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户端是否开启谷歌验证器">
          <el-switch v-model="getI('client_google_secret_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="用户协议和隐私协议是否显示">
          <el-switch v-model="getI('client_is_show_user_protocol').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="投资功能是否显示">
          <el-switch v-model="getI('client_invest_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="前端默认语言类型">
          <el-radio-group v-model="getI('client_system_default_lang_type').values">
            <el-radio :label="1">根据用户设备自动识别</el-radio>
            <el-radio :label="2">根据系统默认设置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="前端默认语言">
          <el-select v-model="getI('client_system_default_lang').values">
            <el-option v-for="item of store.langList" :key="item.mark" :label="item.name" :value="item.mark" />
          </el-select>
        </el-form-item>
        <el-form-item label="前端手机号默认区号">
          <el-select v-model="getI('client_system_default_phone_code').values">
            <el-option v-for="item of photoCodeAreaOptions" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="salesmartly聊天插件src链接">
          <el-input v-model="getI('client_salesmartly').values" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="转账配置" name="3">
        <el-form-item label="智能账户是否可转到量化账户">
          <el-switch v-model="getI('transfer_is_financial_to_basic').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="量化账户是否可转到利润账户">
          <el-switch v-model="getI('transfer_is_basic_to_brokerage').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="合约账户是否可转到量化账户">
          <el-switch v-model="getI('transfer_is_contract_to_basic').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="合约账户是否可转到利润账户">
          <el-switch v-model="getI('transfer_is_contract_to_brokerage').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="利润账户是否可转到量化账户">
          <el-switch v-model="getI('transfer_is_brokerage_to_basic').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="利润账户是否可转到智能账户">
          <el-switch v-model="getI('transfer_is_brokerage_to_financial').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="利润账户是否可转到合约账户">
          <el-switch v-model="getI('transfer_is_brokerage_to_contract').values" :active-value="1" :inactive-value="2" />
        </el-form-item>

        <el-form-item label="利润账户转出手续费百分比">
          <el-input v-model="getI('transfer_transfer_out_ratio').values" type="number" />
        </el-form-item>
        <el-form-item label="利润账户转出最小手续费">
          <el-input v-model="getI('transfer_transfer_out_min').values" type="number" />
        </el-form-item>
        <el-form-item label="利润账户转出最大手续费">
          <el-input v-model="getI('transfer_transfer_out_max').values" type="number" />
        </el-form-item>
        <el-form-item label="其他账户转出手续费百分比">
          <el-input v-model="getI('transfer_other_transfer_out_ratio').values" type="number" />
        </el-form-item>
        <el-form-item label="其他账户转出最小手续费">
          <el-input v-model="getI('transfer_other_transfer_out_min').values" type="number" />
        </el-form-item>
        <el-form-item label="其他账户转出最大手续费">
          <el-input v-model="getI('transfer_other_transfer_out_max').values" type="number" />
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="语音配置" name="4">
        <el-form-item label="语音提醒开关">
          <el-switch v-model="getI('voice_reminder_switch').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="提币订单是否重复提醒">
          <el-switch v-model="getI('voice_is_repeat_extract_voice').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="充值语音文件">
          <uploadPart v-model="getI('voice_recharge_voice_file').values" type="files" />
        </el-form-item>
        <el-form-item label="提现语音文件">
          <uploadPart v-model="getI('voice_withdraw_voice_file').values" type="files" />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const activeNames = ["1", "2", "3", "4"];
const groupLevelOptions = [
  { label: "二级", value: 2 },
  { label: "三级", value: 3 },
  { label: "四级", value: 4 },
  { label: "五级", value: 5 },
  { label: "六级", value: 6 },
];
const themeOptions = [
  { label: "默认", value: 1 },
  { label: "白色", value: 2 },
];
const photoCodeAreaOptions = ref<{ key: string; val: string }[]>([]);
async function getPhotoCodeArea() {
  const res = await api.getPhoneCodeOptions();
  photoCodeAreaOptions.value = res;
}
getPhotoCodeArea();
</script>

<style></style>
