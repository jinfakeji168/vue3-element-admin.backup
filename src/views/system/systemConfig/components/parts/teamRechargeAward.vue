<template>
  <el-dialog v-model="visible" :title="title" width="70vw">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['lotteryConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)" style="height: 40vh">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="recharge_amount" :label="$t('chongZhiJinE')" min-width="120" />
        <el-table-column prop="gift_amount" :label="$t('zengSongJinE')" min-width="120" />
        <el-table-column prop="grade_id" :label="$t('dengJi')" min-width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ levelMap.find((item) => item.key === row.grade_id)?.val }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recharge_type" :label="$t('chongZhiLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ row.recharge_type == 1 ? "每日充值" : "总充值" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="auto">
          <template #default="{ row }">
            <el-button v-hasPerm="['lotteryConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
  <el-dialog v-model="table.visible.value[0]" :title="dialogTitle" width="50vw">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('chongZhiJinE_0')" prop="recharge_amount">
        <el-input v-model="formData.recharge_amount" :placeholder="$t('qingShuRuChongZhiJi')" />
      </el-form-item>
      <el-form-item :label="$t('zengSongJinE_0')" prop="gift_amount">
        <el-input v-model="formData.gift_amount" :placeholder="$t('qingShuRuZengSongJi')" />
      </el-form-item>
      <el-form-item :label="$t('dengJi_0')" prop="grade_id">
        <el-select v-model="formData.grade_id" :placeholder="$t('qingXuanZeDengJi')">
          <el-option v-for="(item, key) in levelMap" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('chongZhiLeiXing_0')" prop="recharge_type">
        <el-radio-group v-model="formData.recharge_type">
          <el-radio :value="1">{{ $t("meiRiChongZhi") }}</el-radio>
          <el-radio :value="2">{{ $t("zongChongZhi") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type TeamRechargeAward } from "@/api/system/systemConfig";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = withDefaults(defineProps<{}>(), {});
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const queryParams = reactive({});
const table = new TableInstance<TeamRechargeAward>(api.teamRechargeAward, queryParams, 20);

const title = ref($t("tuanDuiChongZhiJiang_0"));

watch(visible, (val) => {
  if (val) {
    table.queryHandler();
    getLevelMap();
  }
});

const dialogTitle = ref("");

const levelMap = ref<{ key: number; val: string }[]>([]);

async function getLevelMap() {
  levelMap.value = await store.getTeamLevelListAsync();
}

/**表单数据 */
const formData = reactive<TeamRechargeAward>({
  recharge_amount: 0,
  gift_amount: "",
  grade_id: "",
  recharge_type: "1",
  created_at: "",
  updated_at: "",
});

/**表单验证规则 */
const rules = {
  recharge_amount: [{ required: true, message: $t("qingShuRuChongZhiJi_0"), trigger: "blur" }],
  gift_amount: [{ required: true, message: $t("qingShuRuZengSongJi_0"), trigger: "blur" }],
  grade_id: [{ required: true, message: $t("qingShuRuDengJiId"), trigger: "blur" }],
  recharge_type: [{ required: true, message: $t("qingXuanZeChongZhiL"), trigger: "change" }],
};

watch(
  () => unref(table.visible)[0],
  (val) => {
    if (val) {
      nextTick(() => {
        if (unref(table.currentData)) {
          Object.assign(formData, unref(table.currentData));
          dialogTitle.value = $t("bianJi");
        } else {
          dialogTitle.value = $t("xinZeng");
          Object.assign(formData, { id: undefined });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);

const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (table.currentData.value) await api.teamRechargeAward.edit(formData);
      else await api.teamRechargeAward.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
