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
        <el-table-column prop="min_recharge" :label="$t('zuiDiChongZhiJinE')" min-width="120" />
        <el-table-column prop="max_recharge" :label="$t('zuiGaoChongZhiJinE')" min-width="120" />
        <el-table-column prop="first_charge_ratio" :label="$t('songKuanBiLi')" min-width="120" />
        <el-table-column prop="first_charge_cap" :label="$t('songKuanFengDingJin')" min-width="120" />

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
      <el-form-item :label="$t('zuiDiChongZhiJineBa')" prop="min_recharge">
        <el-input v-model="formData.min_recharge" :placeholder="$t('qingShuRuZuiDiChong')" />
      </el-form-item>
      <el-form-item :label="$t('zuiGaoChongZhiJineB')" prop="max_recharge">
        <el-input v-model="formData.max_recharge" :placeholder="$t('qingShuRuZuiDiChong_0')" />
      </el-form-item>
      <el-form-item :label="$t('songKuanBiLi_0')" prop="first_charge_ratio">
        <el-input-number v-model="formData.first_charge_ratio" :placeholder="$t('qingShuRuSongKuanBi')" :precision="2" :step="1" :max="100" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('songKuanFengDingJin_0')" prop="first_charge_cap">
        <el-input v-model="formData.first_charge_cap" :placeholder="$t('qingShuRuSongKuanFe')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type RechargeAward } from "@/api/system/systemConfig";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = withDefaults(defineProps<{}>(), {});
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const queryParams = reactive({});
const table = new TableInstance<RechargeAward>(api.rechargeAward, queryParams, 20);

const title = ref($t("shouChongJiangLiQuJ"));

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
const formData = reactive<RechargeAward>({
  min_recharge: "",
  max_recharge: "",
  first_charge_cap: "",
  first_charge_ratio: "",
});

/**表单验证规则 */
const rules = {
  min_recharge: [{ required: true, message: $t("qingShuRuZuiDiChong_1"), trigger: "blur" }],
  max_recharge: [{ required: true, message: $t("qingShuRuZuiGaoChon"), trigger: "blur" }],
  first_charge_cap: [{ required: true, message: $t("qingShuRuSongKuanFe_0"), trigger: "blur" }],
  first_charge_ratio: [{ required: true, message: $t("qingShuRuSongKuanBi_0"), trigger: "blur" }],
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
      if (table.currentData.value) await api.rechargeAward.edit(formData);
      else await api.rechargeAward.add(formData);
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
