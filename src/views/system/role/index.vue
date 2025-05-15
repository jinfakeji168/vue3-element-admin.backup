<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="title" label="关键字">
          <el-input v-model="queryParams.title" placeholder="角色名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item prop="name" label="角色编码">
          <el-input v-model="queryParams.name" placeholder="角色编码" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
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
        <el-button v-hasPerm="['role:add']" type="success" @click="handleOpenDialog()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['role:delete']" type="danger" :disabled="ids.length === 0" @click="handleDelete()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="roleList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectableHandler" width="55" align="center" />
        <el-table-column label="角色名称" prop="title" min-width="100" />
        <el-table-column label="角色编码" prop="name" width="150" />

        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center" width="80" prop="sort" />

        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <template v-if="scope.row.id !== 1">
              <el-button type="primary" size="small" link @click="handleOpenAssignPermDialog(scope.row)">
                <template #icon>
                  <Position />
                </template>
                分配权限
              </el-button>
              <el-button v-hasPerm="['role:edit']" type="primary" size="small" link @click="handleOpenDialog(scope.row)">
                <template #icon>
                  <Edit />
                </template>
                编辑
              </el-button>
              <el-button v-hasPerm="['role:delete']" type="danger" size="small" link @click="handleDelete(scope.row.id)">
                <template #icon>
                  <Delete />
                </template>
                删除
              </el-button>
              <el-button v-hasPerm="['role:status']" :type="scope.row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="changeStatus(scope.row)">
                {{ scope.row.status == StatusEnum.False ? "禁用" : "启用" }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.page" v-model:limit="queryParams.limit" @pagination="handleQuery" />
    </el-card>

    <!-- 角色表单弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="handleCloseDialog">
      <el-form ref="roleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色编码" />
        </el-form-item>

        <!-- <el-form-item label="数据权限" prop="dataScope">
          <el-select v-model="formData.dataScope">
            <el-option :key="0" label="全部数据" :value="0" />
            <el-option :key="1" label="部门及子部门数据" :value="1" />
            <el-option :key="2" label="本部门数据" :value="2" />
            <el-option :key="3" label="本人数据" :value="3" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="StatusEnum.False">正常</el-radio>
            <el-radio :label="StatusEnum.True">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" controls-position="right" :min="0" style="width: 100px" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-drawer v-model="assignPermDialogVisible" :title="'【' + checkedRole.name + '】权限分配'" size="500">
      <div class="flex-x-between">
        <el-input v-model="permKeywords" clearable class="w-[150px]" placeholder="菜单权限名称">
          <template #prefix>
            <Search />
          </template>
        </el-input>

        <div class="flex-center ml-5">
          <el-button type="primary" size="small" plain @click="togglePermTree">
            <template #icon>
              <Switch />
            </template>
            {{ isExpanded ? "收缩" : "展开" }}
          </el-button>
          <el-checkbox v-model="parentChildLinked" class="ml-5" @change="handleparentChildLinkedChange">父子联动</el-checkbox>

          <el-tooltip placement="bottom">
            <template #content>如果只需勾选菜单权限，不需要勾选子菜单或者按钮权限，请关闭父子联动</template>
            <el-icon class="ml-1 color-[--el-color-primary] inline-block cursor-pointer">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </div>

      <el-tree
        ref="permTreeRef"
        node-key="value"
        show-checkbox
        :data="menuPermOptions"
        :filter-node-method="handlePermFilter"
        :default-expand-all="true"
        :check-strictly="!parentChildLinked"
        class="mt-5"
      >
        <template #default="{ data }">
          {{ data.label }}
        </template>
      </el-tree>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAssignPermSubmit">确 定</el-button>
          <el-button @click="assignPermDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Role",
  inheritAttrs: false,
});

import RoleAPI, { RolePageVO, RoleForm, RolePageQuery } from "@/api/system/role";
import MenuAPI from "@/api/system/menu";
import { deepChangeOption } from "@/utils";
import { StatusEnum } from "@/enums/MenuTypeEnum";

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);
const permTreeRef = ref<InstanceType<typeof ElTree>>();

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RolePageQuery>({
  page: 1,
  limit: 20,
  title: "",
  name: "",
});

// 角色表格数据
const roleList = ref<RolePageVO[]>();
// 菜单权限下拉
const menuPermOptions = ref<OptionType[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 角色表单
const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  title: "",
  name: "",
});

const rules = reactive({
  title: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

function selectableHandler(row: RolePageVO) {
  if (row.id === 1) return false;
  return true;
}

// 选中的角色
interface CheckedRole {
  id?: number;
  name?: string;
}
const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);

const permKeywords = ref("");
const isExpanded = ref(true);

const parentChildLinked = ref(true);

/** 查询 */
function handleQuery() {
  loading.value = true;
  RoleAPI.index(queryParams)
    .then((data) => {
      roleList.value = data;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开角色弹窗 */
function handleOpenDialog(item?: RolePageVO) {
  dialog.visible = true;
  if (item) {
    dialog.title = "修改角色";
    nextTick(() => {
      Object.assign(formData, item);
    });
  } else {
    dialog.title = "新增角色";
    formData.name = "";
    formData.title = "";
    formData.sort = 1;
  }

  /** 切换权限树展开/收缩 */
  function togglePermTree() {
    isExpanded.value = !isExpanded.value;
    permTreeRef.value?.store.defaultExpandAll(isExpanded.value);
  }
}

/** 提交角色表单 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        RoleAPI.update(roleId, formData)
          .then(() => {
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI.add(formData)
          .then(() => {
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭角色弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId, ...ids.value];
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    type: "warning",
  }).then(() => {
    loading.value = true;
    RoleAPI.delete(roleIds)
      .then(() => {
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

// 获取所有的菜单
async function getRouterTree() {
  const res = await MenuAPI.index({ is_tree: 1 });
  menuPermOptions.value = deepChangeOption(res, [
    ["label", "title"],
    ["value", "id"],
  ]);
}
getRouterTree();

/** 打开分配菜单权限弹窗 */
async function handleOpenAssignPermDialog(row: RolePageVO) {
  const roleId = row.id;
  if (roleId) {
    assignPermDialogVisible.value = true;
    checkedRole.value.id = roleId;
    checkedRole.value.name = row.name;
    // 回显角色已拥有的菜单
    const checkedMenuIds = row.permissions.map((item) => item.id);
    function deepLoop(list: OptionType[]) {
      list.forEach((item) => {
        if (item.children) {
          deepLoop(item.children);
        }
        if (checkedMenuIds.includes(item.value)) {
          permTreeRef.value?.setChecked(item.value, true, false);
        } else {
          permTreeRef.value?.setChecked(item.value, false, false);
        }
      });
    }

    nextTick(() => {
      deepLoop(unref(menuPermOptions));
    });
  }
}

/** 分配菜单权限提交 */
function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id;
  if (roleId) {
    const checkedMenuIds = unref(permTreeRef)
      ?.getCheckedNodes(false, true)
      .map((node: any) => node.value);

    loading.value = true;

    RoleAPI.updateRoleMenus(roleId, <number[]>checkedMenuIds)
      .then(() => {
        assignPermDialogVisible.value = false;
        handleResetQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

/** 展开/收缩 菜单权限树  */
function togglePermTree() {
  isExpanded.value = !isExpanded.value;
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand();
      } else {
        node.collapse();
      }
    });
  }
}

/** 权限筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any;
  }
) {
  if (!value) return true;
  return data.label.includes(value);
}

/** 父子菜单节点是否联动 change*/
function handleparentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}
function changeStatus(item: RolePageVO) {
  RoleAPI.update(item.id as number, {
    ...item,
    status: item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True,
  }).then(() => {
    handleQuery();
  });
}
onMounted(() => {
  handleQuery();
});
</script>
