<template>
  <el-dialog v-model="visible" :title="title" width="70vw">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['signinConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['signinConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="sign_days" :label="$t('qianDaoTianShu')" min-width="120" />
        <el-table-column prop="reward_amount" :label="$t('jiangLiJinE')" min-width="120" />
        <!-- <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['signinConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <!-- <el-button v-hasPerm="['signinConfig:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button> -->
            <el-button v-hasPerm="['signinConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
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
      <el-form-item :label="$t('qianDaoTianShu_0')" prop="sign_days">
        <el-input-number v-model="formData.sign_days" :placeholder="$t('qingShuRuQianDaoTia')" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('jiangLiJinE_0')" prop="reward_amount">
        <el-input-number v-model="formData.reward_amount" :placeholder="$t('qingShuRuChongZhiJi_2')" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type ListForm } from "@/api/system/signinConfig";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
import { hasAuth } from "@/plugins/permission";

const visible = defineModel<boolean>();
const title = ref<string>("");
watch(visible, (val) => {
  if (val) {
    title.value = $t("qianDaoJiangPinSheZ");
  }
});
const formRef = ref<FormInstance>();
const table = new TableInstance<ListForm>(api, {}, 20);

const dialogTitle = ref("");
const formData = reactive<ListForm>({});
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
          Object.assign(formData, { id: undefined, status: 1 });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);
const rules = {
  sign_days: [{ required: true, message: $t("qingShuRuQianDaoTia_0"), trigger: "blur" }],
  reward_amount: [{ required: true, message: $t("qingShuRuChongZhiJi_3"), trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (unref(table.currentData)) await api.edit(formData);
      else await api.add(formData);
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
