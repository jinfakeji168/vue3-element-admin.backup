<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading[0]">
      <template #header>{{ $t("chouJiangPeiZhi") }}</template>
      <el-form :model="formData" label-width="200px">
        <el-form-item :label="$t('chouJiangKaiGuan')" prop="lottery_is_open">
          <el-radio-group v-model="formData.lottery_is_open" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('shouYeShiFouDanChua')" prop="lottery_is_pop">
          <el-radio-group v-model="formData.lottery_is_pop" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('meiCiDaoShouYeDuDa')" prop="lottery_pop_num">
          <el-radio-group v-model="formData.lottery_pop_num" fill="#67C23A" text-color="#fff">
            <el-radio-button :value="StatusEnum.False">{{ $t("kaiQi") }}</el-radio-button>
            <el-radio-button :value="StatusEnum.True">{{ $t("guanBi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('chouJiangZengSongZha')" prop="lottery_give_account">
          <el-radio-group v-model="formData.lottery_give_account" fill="#409EFF" text-color="#fff">
            <el-radio-button :value="1">{{ $t("liangHuaZhangHu_2") }}</el-radio-button>
            <el-radio-button :value="2">{{ $t("yongJinZhangHu_1") }}</el-radio-button>
            <el-radio-button :value="3">{{ $t("heYueZhangHu") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('chouJiangXingShi')" prop="lottery_type">
          <el-radio-group v-model="formData.lottery_type" fill="#409EFF" text-color="#fff">
            <el-radio-button :value="1">{{ $t("zhuanPan") }}</el-radio-button>
            <el-radio-button :value="2">{{ $t("baoHe") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('jiangPinSheZhi')" prop="lottery_system_lottery_type">
          <el-radio-group v-model="formData.lottery_system_lottery_type" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">{{ $t("quanJu") }}</el-radio-button>
            <el-radio-button :value="2">{{ $t("juBu") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('jiangPinMoRenXianSh')" prop="lottery_type_default">
          <el-radio-group v-model="formData.lottery_type_default" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">{{ $t("zhuCeJiangPin") }}</el-radio-button>
            <el-radio-button :value="2">{{ $t("yaoQingJiangPin") }}</el-radio-button>
            <el-radio-button :value="3">{{ $t("chongZhiJiangPin") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('chouJiangShuoMing')">
          <el-button type="primary" @click="visible[0] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <hr />
        <el-form-item :label="$t('zhuCeZengSongChouJi')" props="lottery_register_give_num">
          <el-input-number v-model="formData.lottery_register_give_num" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('zhuCeJiangPinSheZhi')">
          <el-button type="primary" @click="visible[1] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <hr />
        <el-form-item :label="$t('yaoQingYongHuChongZ_0')" props="lottery_spread_recharge_give">
          <el-input-number v-model="formData.lottery_spread_recharge_give" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('yaoQingJiangPinSheZ')">
          <el-button type="primary" @click="visible[2] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <hr />
        <el-form-item :label="$t('yongHuChongZhiZengS')" props="lottery_send_type">
          <el-radio-group v-model="formData.lottery_send_type" fill="#E6A23C" text-color="#fff">
            <el-radio-button :value="1">{{ $t("anMeiRiChongZhiZong") }}</el-radio-button>
            <el-radio-button :value="2">{{ $t("anMeiBiChongZhiJine") }}</el-radio-button>
            <el-radio-button :value="3">{{ $t("anZhongShenChongZhi") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('chongZhiJiangPinShe')">
          <el-button type="primary" @click="visible[3] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
        <el-form-item :label="Listlables[formData.lottery_send_type - 1]">
          <el-button type="primary" @click="visible[4] = true">{{ $t("chaKanBianJi_0") }}</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-hasPerm="['lotteryConfig:save']" type="primary" @click="submitHandler" :loading="loading[1]">{{ $t("baoCun") }}</el-button>
      </template>
    </el-card>
    <explain :data="formData" v-model="visible[0]" @finish="getData" />
    <prizeList
      :data="formData"
      v-model="visible[1]"
      :disabled="!hasAuth('lotteryConfig:registPrize')"
      @finish="getData"
      _key="lottery_register_prize_set"
      :title="$t('zhuCeJiangPinSheZhi_0')"
    />
    <prizeList
      :data="formData"
      v-model="visible[2]"
      :disabled="!hasAuth('lotteryConfig:invitePrize')"
      @finish="getData"
      _key="lottery_invite_prize_set"
      :title="$t('yaoQingJiangPinSheZ_0')"
    />
    <prizeList
      :data="formData"
      v-model="visible[3]"
      :disabled="!hasAuth('lotteryConfig:rechargePrize')"
      @finish="getData"
      _key="lottery_recharge_prize_set"
      :title="$t('chongZhiJiangPinShe_0')"
    />
    <recharge v-model="visible[4]" :title="Listlables[formData.lottery_send_type - 1]" :index="formData.lottery_send_type" />
  </div>
</template>

<script setup lang="ts">
import explain from "./components/explain.vue";
import prizeList from "./components/prizeList.vue";
import recharge from "./components/recharge.vue";
import api, { type Form } from "@/api/system/lotteryConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { hasAuth } from "@/plugins/permission";

const formData = reactive<Form>({});
const visible = ref([false]);
const loading = reactive<boolean[]>([]);
async function getData() {
  loading[0] = true;
  const res = await api.getLotteryConfig();
  Object.assign(formData, res);
  loading[0] = false;
}
getData();
async function submitHandler() {
  loading[1] = true;
  await api.setLotteryConfig(formData);
  loading[1] = false;
}

const Listlables = [$t("meiRiChongZhiChouJi"), $t("danCiChongZhiChouJi"), $t("zhongShenChongZhiCho")];
</script>

<style></style>
