<template>
  <el-form label-width="240px">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('jiBenZhuCeSheZhi')" name="1">
        <el-form-item :label="$t('yongHuUidZiZengShe')">
          <div class="flex flex-row">
            <el-input-number v-model="current_autoIncrementId" style="margin-right: 14px" :min="originId" :disabled="!current_autoIncrementId" />
            <el-button @click="getAutoIncrementId" :loading="loading">{{ $t("chaXun") }}</el-button>
            <el-button type="primary" @click="setAutoIncrementId" :loading="loading" :disabled="!current_autoIncrementId || current_autoIncrementId == originId">
              {{ $t("xiuGai") }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('zhuCeFaSongZhanNei')">
          <el-switch v-model="getI('is_register_message').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('zhuCeShiFouKaiQiYa')">
          <el-switch v-model="getI('register_is_captcha').values" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item :label="$t('zhongFuMiMa')">
          <el-tooltip :content="$t('zhuCeShiShiFouKaiQ')" placement="right">
            <el-switch v-model="getI('is_repeat_password').values" :active-value="1" :inactive-value="2" />
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('anQuanMiMa')">
          <el-radio-group v-model="getI('security_password_type').values">
            <el-radio :label="1">{{ $t("zhuCeShiTianXie") }}</el-radio>
            <el-radio :label="2">{{ $t("tiXianShiTianXie") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('qiYongDeZhuCeFangS')">
          <el-checkbox-group v-model="getI('register_account_status').values" :min="1">
            <el-checkbox :label="1">{{ $t("yongHuMingZhuCe") }}</el-checkbox>
            <el-checkbox :label="2">{{ $t("youXiangZhuCe") }}</el-checkbox>
            <el-checkbox :label="3">{{ $t("shouJiHaoZhuCe") }}</el-checkbox>
            <el-checkbox :label="4">{{ $t("telegramZhuCe") }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="用户名注册是否开启">
          <el-switch v-model="getI('username_register_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item> -->
        <template v-if="getI('register_account_status').values.includes(1)">
          <el-form-item :label="$t('yongHuMingZhuCeShi')">
            <el-switch v-model="getI('username_register_email').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item :label="$t('yongHuMingZhuCeShi_0')">
            <el-switch v-model="getI('username_register_phone').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
        </template>
        <!-- <el-form-item label="telegram注册">
          <el-switch v-model="getI('telegram_register_status').values" :active-value="1" :inactive-value="2" />
        </el-form-item> -->
        <el-form-item :label="$t('telegramXiaoChengXuZ')" v-if="getI('register_account_status').values.includes(4)">
          <el-switch v-model="getI('tg_auto_login').values" :active-value="1" :inactive-value="2" />
        </el-form-item>

        <template v-if="getI('register_account_status').values.includes(3)">
          <el-form-item :label="$t('shouJiHaoZhuCeShiS')">
            <el-switch v-model="getI('phone_register_email_status').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <el-form-item :label="$t('shouJiHaoZuiDiChang')">
            <el-input-number v-model="getI('register_phone_length').values" :min="0" :placeholder="$t('shouJiHaoZuiDiChang_0')" />
          </el-form-item>
        </template>
        <el-form-item :label="$t('tongIpGeShuXianZhi')">
          <el-tooltip :content="$t('tongIpKeZhuCeZhang')" placement="right">
            <el-input-number v-model="getI('ip_register_limit').values" :min="0" placeholder="" />
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('tongIpGeShuXianZhi_1')">
          <el-tooltip :content="$t('zongCiShuDaiBiaoGai')" placement="right">
            <el-radio-group v-model="getI('ip_register_limit_type').values">
              <el-radio :label="1">{{ $t("meiRiCiShu") }}</el-radio>
              <el-radio :label="2">{{ $t("zongCiShu") }}</el-radio>
            </el-radio-group>
          </el-tooltip>
        </el-form-item>
        <template v-if="getI('register_account_status').values.includes(2)">
          <el-form-item :label="$t('youXiangZhuCeShiShi')">
            <el-switch v-model="getI('is_verify_email_code').values" :active-value="1" :inactive-value="2" />
          </el-form-item>
          <template v-if="getI('is_verify_email_code').values == 1">
            <el-form-item :label="$t('zhuCeYouXiangYanZhe')">
              <el-input-number v-model="getI('register_code_valid_time').values" :min="0" :placeholder="$t('zhuCeYouXiangYanZhe_0')" />
            </el-form-item>
            <el-form-item :label="$t('danGeIpZhuCeYouXia')">
              <el-input-number v-model="getI('register_email_code_num').values" :min="0" :placeholder="$t('danGeIpZhuCeYouXia_0')" />
            </el-form-item>
          </template>
        </template>
      </el-collapse-item>

      <el-collapse-item :title="$t('zhuCeZengSongPeiZhi')" name="2">
        <el-form-item :label="$t('zhuCeZengSongLiangH')">
          <el-input-number v-model="getI('register_give_money').values" :min="0" :placeholder="$t('zhuCeZengSongLiangH_0')" />
        </el-form-item>
        <el-form-item :label="$t('zhuCeZengSongHeYue')">
          <el-input-number v-model="getI('register_send_contract_money').values" :min="0" :placeholder="$t('zhuCeZengSongHeYue_0')" />
        </el-form-item>
        <el-form-item :label="$t('zhuCeZengSongXuNiJ')">
          <el-input-number v-model="getI('register_virtual_money').values" :min="0" :placeholder="$t('zhuCeZengSongXuNiJ_0')" />
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item :title="$t('tuiJianPeiZhi')" name="3">
        <el-form-item :label="$t('tuiJianRen')">
          <el-radio-group v-model="getI('is_need_spreader').values">
            <el-radio :label="1">{{ $t("biTian") }}</el-radio>
            <el-radio :label="2">{{ $t("xuanTian") }}</el-radio>
            <el-radio :label="3">{{ $t("buXuYao") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('yaoQingMaLeiXing')">
          <el-radio-group v-model="getI('invite_link_type').values">
            <el-radio :label="1">{{ $t("chunShuZi") }}</el-radio>
            <el-radio :label="2">{{ $t("chunZiMu") }}</el-radio>
            <el-radio :label="3">{{ $t("shuZiZiMuZuHe") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item :title="$t('dengLuPeiZhi')" name="4">
        <el-form-item :label="$t('qiYongTuXingYanZhen')">
          <el-input-number v-model="getI('error_to_show_pic').values" :min="0" :placeholder="$t('dengLuMiMaShuRuCuo')" />
        </el-form-item>
        <el-form-item :label="$t('fengTingZhangHaoCuo')">
          <el-tooltip :content="$t('lianXuShuRuJiCiCuo')" placement="right">
            <el-input-number v-model="getI('error_to_ban').values" :min="0" placeholder="" />
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('fengTingZhangHaoShi')">
          <el-tooltip :content="$t('fengTingZhangHaoDeng')" placement="right">
            <el-input-number v-model="getI('login_error_lock_time').values" :min="0" placeholder="" />
          </el-tooltip>
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item :title="$t('zhaoHuiMiMaPeiZhi')" name="5">
        <el-form-item :label="$t('youXiangYanZhengMaY')">
          <el-input-number v-model="getI('code_valid_time').values" :min="0" :placeholder="$t('youXiangYanZhengMaY_0')" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <div class="flex-center">
              {{ $t("youXiangYanZhengMaC") }}
              <el-tooltip :content="$t('24XiaoShiNeiTongYi')" placement="right">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('pwd_email_code_num').values" :min="0" :placeholder="$t('youXiangYanZhengMaC_0')" />
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
  await ElMessageBox.confirm($t("shiFouQueRenXiuGai"), $t("tiShi"), {});
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
