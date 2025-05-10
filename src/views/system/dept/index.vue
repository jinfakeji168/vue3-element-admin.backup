<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="部门名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="部门状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper">
      <template #header>
        <el-button
          v-hasPerm="['dept:add']"
          type="success"
          @click="handleOpenDialog(0, undefined)"
        >
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button
          v-hasPerm="['dept:delete']"
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>

      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="title" label="部门名称" min-width="200" />
        <el-table-column prop="name" label="部门编号" width="200" />
        <el-table-column prop="description" label="部门描述" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="400">
          <template #default="scope">
            <el-button
              v-hasPerm="['dept:add']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(scope.row.id, undefined)"
            >
              <template #icon>
                <Plus />
              </template>
              新增
            </el-button>
            <el-button
              v-hasPerm="['dept:edit']"
              type="primary"
              link
              size="small"
              @click.stop="handleOpenDialog(scope.row.parent_id, scope.row)"
            >
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <el-button
              v-hasPerm="['dept:delete']"
              type="danger"
              link
              size="small"
              @click.stop="handleDelete(scope.row.id)"
            >
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button
              v-hasPerm="['dept:status']"
              :type="
                scope.row.status == StatusEnum.False ? 'danger' : 'success'
              "
              link
              size="small"
              @click.stop="changeStatus(scope.row)"
            >
              {{ scope.row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="600px"
      @closed="handleCloseDialog"
    >
      <el-form
        ref="deptFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级部门" prop="parent_id">
          <el-tree-select
            v-model="formData.parent_id"
            placeholder="选择上级部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编号" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门编号" />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入部门描述"
          />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
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
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

import DeptAPI, { DeptVO, DeptForm, DeptQuery } from "@/api/system/dept";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { deepChangeOption } from "@/utils";

const queryFormRef = ref(ElForm);
const deptFormRef = ref(ElForm);

const loading = ref(false);
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
  parent_id: [
    { required: true, message: "上级部门不能为空", trigger: "change" },
  ],
  title: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  name: [{ required: true, message: "部门编号不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

/** 查询部门 */
function handleQuery() {
  loading.value = true;
  DeptAPI.getList(queryParams).then((data) => {
    deptList.value = data;
    loading.value = false;
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
      label: "顶级部门",
      children: deepChangeOption(data, [
        ["label", "title"],
        ["value", "id"],
      ]),
    },
  ];

  dialog.visible = true;
  if (item) {
    dialog.title = "修改部门";
    nextTick(() => {
      Object.assign(formData, item);
      formData.parent_id = parent_id ?? item.parent_id;
    });
  } else if (parent_id) {
    dialog.title = "新增子部门";
    formData.parent_id = parent_id;
  } else {
    dialog.title = "新增部门";
    formData.parent_id = parent_id ?? 0;
  }
}

/** 提交部门表单 */
function handleSubmit() {
  deptFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const deptId = formData.id;
      if (deptId) {
        DeptAPI.update(deptId, formData)
          .then(() => {
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        DeptAPI.add(formData)
          .then(() => {
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 删除部门 */
function handleDelete(deptId?: number) {
  const deptIds: number[] = [...ids.value, deptId as number];

  if (!deptIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    type: "warning",
  }).then(() => {
    loading.value = true;
    DeptAPI.deleteByIds(deptIds)
      .then(() => {
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
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
