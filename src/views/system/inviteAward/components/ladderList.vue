<template>
  <el-dialog v-model="visible" :title="$t('yaoQingJieTiSheZhi')" width="70vw">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['inviteAward:ladderList:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['inviteAward:ladderList:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="people_invited" :label="$t('yaoQingRenShuDaoDa')" min-width="120" />
        <el-table-column prop="gift_amount" :label="$t('zengSongJinE_0')" min-width="120" />
        <!-- <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['inviteAward:ladderList:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <!-- <el-button v-hasPerm="['inviteAward:ladderList:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button> -->
            <el-button v-hasPerm="['inviteAward:ladderList:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
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
      <el-form-item :label="$t('yaoQingRenShuDaoDa_0')" prop="people_invited">
        <el-input-number v-model="formData.people_invited" :placeholder="$t('qingShuRuYaoQingRen_0')" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('zengSongJinE_0')" prop="gift_amount">
        <el-input-number v-model="formData.gift_amount" :placeholder="$t('qingShuRuJiangLiJin')" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type LadderListForm } from "@/api/system/inviteAward";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const table = new TableInstance<LadderListForm>(api.ladder, {}, 20);

const dialogTitle = ref("");
const formData = reactive<LadderListForm>({});
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
const rules = {
  people_invited: [{ required: true, message: $t("qingShuRuYaoQingJi"), trigger: "blur" }],
  gift_amount: [{ required: true, message: $t("qingShuRuZengSongJi_0"), trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (unref(table.currentData)) await api.ladder.edit(formData);
      else await api.ladder.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
