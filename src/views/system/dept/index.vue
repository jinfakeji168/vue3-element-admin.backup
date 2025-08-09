<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item :label="$t('guanJianZi')" prop="title">
          <el-input v-model="queryParams.title" :placeholder="$t('buMenMingCheng')" @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item :label="$t('buMenZhuangTai')" prop="status">
          <el-select v-model="queryParams.status" :placeholder="$t('quanBu')" clearable class="!w-[100px]">
            <el-option :value="StatusEnum.False" :label="$t('zhengChang')" />
            <el-option :value="StatusEnum.True" :label="$t('jinYong')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            {{ $t("souSuo") }}
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            {{ $t("zhongZhi") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="loading[0]">
      <template #header>
        <el-button v-hasPerm="['dept:add']" type="success" @click="handleOpenDialog(0, undefined)">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['dept:delete']" type="danger" :disabled="ids.length === 0" @click="handleDelete()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>

      <el-table :data="deptList" row-key="id" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="title" :label="$t('buMenMingCheng')" min-width="200" />
        <el-table-column prop="name" :label="$t('buMenBianHao')" width="200" />
        <el-table-column prop="description" :label="$t('buMenMiaoShu')" width="200" />
        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" :label="$t('paiXu')" width="100" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="400">
          <template #default="scope">
            <el-button v-hasPerm="['dept:add']" type="primary" link size="small" @click.stop="handleOpenDialog(scope.row.id, undefined)">
              <template #icon>
                <Plus />
              </template>
              {{ $t("xinZeng") }}
            </el-button>
            <el-button v-hasPerm="['dept:edit']" type="primary" link size="small" @click.stop="handleOpenDialog(scope.row.parent_id, scope.row)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['dept:delete']" type="danger" link size="small" @click.stop="handleDelete(scope.row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button v-hasPerm="['dept:status']" :type="scope.row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="changeStatus(scope.row)">
              <template #icon><Switch /></template>
              {{ scope.row.status == StatusEnum.False ? $t("jinYong") : $t("qiYong") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" @closed="handleCloseDialog">
      <el-form ref="deptFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item :label="$t('shangJiBuMen')" prop="parent_id">
          <el-tree-select v-model="formData.parent_id" :placeholder="$t('xuanZeShangJiBuMen')" :data="deptOptions" filterable check-strictly :render-after-expand="false" />
        </el-form-item>
        <el-form-item :label="$t('buMenMingCheng')" prop="title">
          <el-input v-model="formData.title" :placeholder="$t('qingShuRuBuMenMing')" />
        </el-form-item>
        <el-form-item :label="$t('buMenBianHao_0')" prop="name">
          <el-input v-model="formData.name" :placeholder="$t('qingShuRuBuMenBian')" />
        </el-form-item>
        <el-form-item :label="$t('buMenMiaoShu_0')" prop="description">
          <el-input v-model="formData.description" :placeholder="$t('qingShuRuBuMenMiao')" />
        </el-form-item>
        <el-form-item :label="$t('xianShiPaiXu')" prop="sort">
          <el-input-number v-model="formData.sort" controls-position="right" style="width: 100px" :min="0" />
        </el-form-item>
        <!-- <el-form-item label="部门状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">{{ $t("quXiao") }}</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading[1]">{{ $t("queDing") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: $t("dept"),
  inheritAttrs: false,
});

import DeptAPI, { DeptVO, DeptForm, DeptQuery } from "@/api/system/dept";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { deepChangeOption } from "@/utils";

const queryFormRef = ref(ElForm);
const deptFormRef = ref(ElForm);

const loading = ref<boolean[]>([false, false]);
const ids = ref<number[]>([]);
const dialog = reactive({
  title: "",
  visible: false,
});

const queryParams = reactive<DeptQuery>({});
const deptList = ref<DeptVO[]>();

const deptOptions = ref<OptionType[]>();

const formData = reactive<DeptForm>({
  status: 1,
  parent_id: 0,
  sort: 1,
  description: "",
  title: "",
  name: "",
});

const rules = reactive({
  parent_id: [{ required: true, message: $t("shangJiBuMenBuNeng"), trigger: "change" }],
  title: [{ required: true, message: $t("buMenMingChengBuNen"), trigger: "blur" }],
  name: [{ required: true, message: $t("buMenBianHaoBuNeng"), trigger: "blur" }],
  sort: [{ required: true, message: $t("xianShiPaiXuBuNeng"), trigger: "blur" }],
});

/** 查询部门 */
function handleQuery() {
  loading.value[0] = true;
  DeptAPI.getList(queryParams).then((data) => {
    deptList.value = data;
    loading.value[0] = false;
  });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开部门弹窗
 *
 * @param parent_id 父部门ID
 * @param deptId 部门ID
 */
async function handleOpenDialog(parent_id?: number, item?: DeptVO) {
  // 加载部门下拉数据
  const data = await DeptAPI.getOptions({ limit: 9999 });
  deptOptions.value = [
    {
      value: 0,
      label: $t("dingJiBuMen"),
      children: deepChangeOption(data, [
        ["label", "title"],
        ["value", "id"],
      ]),
    },
  ];

  dialog.visible = true;
  if (item) {
    dialog.title = $t("xiuGaiBuMen");
    nextTick(() => {
      Object.assign(formData, item);
      formData.parent_id = parent_id ?? item.parent_id;
    });
  } else if (parent_id) {
    dialog.title = $t("xinZengZiBuMen");
    formData.parent_id = parent_id;
  } else {
    dialog.title = $t("xinZengBuMen");
    formData.parent_id = parent_id ?? 0;
  }
}

/** 提交部门表单 */
async function handleSubmit() {
  await deptFormRef.value.validate();

  loading.value[1] = true;
  const deptId = formData.id;
  try {
    if (deptId) {
      await DeptAPI.update(deptId, formData);
    } else {
      await DeptAPI.add(formData);
    }
  } finally {
    loading.value[1] = false;
  }
  handleCloseDialog();
  handleQuery();
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds: number[] = [...ids.value, deptId as number];

  if (!deptIds) {
    ElMessage.warning($t("qingGouXuanShanChuX"));
    return;
  }

  ElMessageBox.confirm($t("queRenShanChuYiXuan"), $t("jingGao"), {
    type: "warning",
  }).then(() => {
    DeptAPI.deleteByIds(deptIds).then(() => {
      handleResetQuery();
    });
  });
}

function changeStatus(item: DeptVO) {
  DeptAPI.update(item.id as number, {
    ...item,
    status: item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True,
  }).then(() => {
    handleQuery();
  });
}

/** 关闭弹窗 */
function handleCloseDialog() {
  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();
  formData.id = undefined;
  formData.parent_id = 0;
  formData.status = 1;
  formData.sort = 1;
  dialog.visible = false;
}

onMounted(() => {
  handleQuery();
});
</script>
