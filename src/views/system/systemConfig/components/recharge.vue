<template>
  <el-form label-width="240px">
    <el-form-item :label="$t('yunXuChongZhiZhangH')">
      <el-checkbox-group v-model="getI('account_type_options').values" :min="1">
        <el-checkbox :label="1">{{ $t("liangHuaZhangHu") }}</el-checkbox>
        <el-checkbox :label="4">{{ $t("zhiNengZhangHu") }}</el-checkbox>
        <el-checkbox :label="5">{{ $t("miaoHeYueZhangHu") }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('chongZhiFanLiLeiXin')">
      <el-radio-group v-model="getI('vip_rebate_type').values">
        <el-radio :label="1">{{ $t("jinXianChongZhiZaiL") }}</el-radio>
        <el-radio :label="2">{{ $t("chongZhiLiangHuaZhan") }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('chongZhiFanLiZhangH')">
      <el-radio-group v-model="getI('recharge_rebate_account').values">
        <el-radio :label="1">{{ $t("liangHuaZhangHu_0") }}</el-radio>
        <el-radio :label="2">{{ $t("yongJinZhangHu") }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 首充送款相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          {{ $t("shouChongSongKuanKai") }}
          <el-tooltip effect="dark" placement="top">
            <template #content>{{ $t("shouChongSongKuanKai_0") }}</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_first_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <template v-if="getI('is_open_first_charge_rebate').values == 1">
      <el-form-item :label="$t('shouChongSongKuanZha')">
        <el-radio-group v-model="getI('first_recharge_send_account').values">
          <el-radio :label="1">{{ $t("liangHuaZhangHu_1") }}</el-radio>
          <el-radio :label="2">{{ $t("yongJinZhangHu_0") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <template #label>
          <div class="flex-center">
            {{ $t("shouChongSongKuanPei") }}
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div>{{ $t("tongYiPeiZhiZhiShe") }}</div>
                <div>{{ $t("quJianPeiZhiKeYiSh") }}</div>
              </template>
              <el-icon class="question-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-radio-group v-model="getI('first_recharge_config_type').values">
          <el-radio :label="1">{{ $t("tongYiPeiZhi") }}</el-radio>
          <el-radio :label="2">{{ $t("quJianPeiZhi") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="getI('first_recharge_config_type').values == 1">
        <el-form-item>
          <template #label>
            <div class="flex-center">
              {{ $t("shouChongSongKuanZui") }}
              <el-tooltip effect="dark" placement="top">
                <template #content>{{ $t("shouChongSongKuanTia") }}</template>
                <el-icon class="question-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('first_charge_rebate_min').values" :min="0" :placeholder="$t('sheZhi_0BuXianZhiJi')" />
        </el-form-item>

        <el-form-item :label="$t('shouChongSongKuanBi')">
          <el-input-number v-model="getI('first_charge_rebate_percent').values" :min="0" :max="100" :placeholder="$t('ziYouSheZhiBaiFenB')" :precision="2" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div class="flex-center">
              {{ $t("shouChongSongKuanFen") }}
              <el-tooltip effect="dark" placement="top">
                <template #content>{{ $t("shouChongSongKuanedu") }}</template>
                <el-icon class="question-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="getI('first_charge_rebate_cap').values" :min="0" :placeholder="$t('keXuan_0BuFengDing')" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item :label="$t('shouChongSongKuanQu')">
          <el-button @click="visible[1] = true" type="primary">{{ $t("chaKanBianJi") }}</el-button>
        </el-form-item>
      </template>
    </template>
    <!-- 复充送款相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          {{ $t("fuChongSongKuanKaiG") }}
          <el-tooltip effect="dark" placement="top">
            <template #content>{{ $t("fuChongSongKuanKaiG_0") }}</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_again_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('fuChongSongKuanZuiD')" v-if="getI('is_open_again_charge_rebate').values == 1">
      <el-input-number v-model="getI('again_charge_rebate_min').values" :min="0" :placeholder="$t('sheZhi_0BuXianZhiJi_0')" />
    </el-form-item>

    <!-- 团队充值奖励相关配置 -->
    <el-form-item>
      <template #label>
        <div class="flex-center">
          {{ $t("tuanDuiChongZhiManej") }}
          <el-tooltip effect="dark" placement="top">
            <template #content>{{ $t("tuanDuiChongZhiManej_0") }}</template>
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-switch v-model="getI('is_open_team_again_charge_rebate').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <template v-if="getI('is_open_team_again_charge_rebate').values == 1">
      <el-form-item :label="$t('tuanDuiChongZhiJiang')">
        <el-radio-group v-model="getI('give_team_brokerage_account').values">
          <el-radio :label="1">{{ $t("liangHuaZhangHu_2") }}</el-radio>
          <el-radio :label="2">{{ $t("yongJinZhangHu_1") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('chongZhiJiangLiSheZ')">
        <el-radio-group v-model="getI('give_team_type').values">
          <el-radio :label="1">{{ $t("danGeSheZhi") }}</el-radio>
          <el-radio :label="2">{{ $t("quJianSheZhi") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="getI('give_team_type').values == 1">
        <el-form-item :label="$t('muBiaoDengJi')">
          <el-select v-model="getI('team_recharge_spread_level').values" :placeholder="$t('muBiaoDengJi_0')">
            <el-option v-for="item in levelMap" :key="item.key" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('muBiaoJinE')">
          <el-input-number v-model="getI('give_team_brokerage_limit').values" :min="0" :placeholder="$t('muBiaoJinE_0')" />
        </el-form-item>

        <el-form-item :label="$t('muBiaoDaChengJiangL')">
          <el-input-number v-model="getI('give_team_brokerage_num').values" :min="0" :placeholder="$t('muBiaoDaChengJiangL_0')" />
        </el-form-item>
      </template>

      <el-form-item :label="$t('tuanDuiChongZhiJiang_0')" v-else>
        <el-button @click="visible[0] = true" type="primary">{{ $t("chaKanBianJi_0") }}</el-button>
      </el-form-item>
    </template>
  </el-form>
  <team-recharge-award v-model="visible[0]" />
  <rechargeAward v-model="visible[1]" />
</template>

<script setup lang="ts">
import teamRechargeAward from "./parts/teamRechargeAward.vue";
import rechargeAward from "./parts/rechargeAward.vue";
import api, { type Form } from "@/api/system/systemConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false, false]);

const levelMap = ref<Awaited<ReturnType<typeof api.getOptions>>>([]);
async function getLevelMap() {
  levelMap.value = await store.getTeamLevelListAsync();
}
getLevelMap();
</script>

<style></style>
