<!-- 用户管理 -->
<template>
  <div class="app-container">
    <div class="flex_row">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTree v-model="queryParams.department_id" @node-click="handleQuery" />
      </el-col>

      <!-- 用户列表 -->
      <div class="row_item">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="username">
              <el-input v-model="queryParams.username" placeholder="用户名/昵称" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="queryParams.mobile" placeholder="手机号" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="邮箱" prop="emai">
              <el-input v-model="queryParams.email" placeholder="邮箱" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-[100px]">
                <el-option label="正常" :value="StatusEnum.False" />
                <el-option label="禁用" :value="StatusEnum.True" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery">
                <template #icon><Search /></template>
                搜索
              </el-button>
              <el-button @click="handleResetQuery">
                <template #icon><Refresh /></template>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-wrapper">
          <template #header>
            <div class="flex-x-between">
              <div>
                <el-button v-hasPerm="['user:add']" type="success" @click="handleOpenDialog()">
                  <template #icon><Plus /></template>
                  新增
                </el-button>
                <el-button v-hasPerm="['user:delete']" type="danger" :disabled="removeIds.length === 0" @click="handleDelete()">
                  <template #icon><Delete /></template>
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <el-table v-loading="loading" :data="pageData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable="selectableHandler" width="50" align="center" />
            <el-table-column key="uid" label="编号" align="center" prop="uid" width="80" />
            <el-table-column key="username" label="用户名" align="center" prop="username" width="200" />
            <el-table-column label="用户昵称" align="center" prop="nickname" width="200" />

            <el-table-column label="部门" width="150" align="center" prop="department.title" />
            <el-table-column label="手机号码" align="center" prop="mobile" width="120" />

            <el-table-column label="状态" align="center" prop="status" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
                  {{ scope.row.status == StatusEnum.False ? "正常" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="最后登录时间" align="center" prop="last_login_at" width="180" />
            <el-table-column label="操作" fixed="right">
              <template #default="scope">
                <el-button v-hasPerm="['user:edit']" type="primary" size="small" link @click="hancleResetPassword(scope.row)">
                  <template #icon><RefreshLeft /></template>
                  重置密码
                </el-button>
                <template v-if="scope.row.uid !== 1">
                  <el-button v-hasPerm="['user:edit']" type="primary" link size="small" @click="handleOpenDialog(scope.row)">
                    <template #icon><Edit /></template>
                    编辑
                  </el-button>
                  <el-button v-hasPerm="['user:delete']" type="danger" link size="small" @click="handleDelete(scope.row.uid)">
                    <template #icon><Delete /></template>
                    删除
                  </el-button>
                  <el-button
                    v-hasPerm="['user:status']"
                    :type="scope.row.status == StatusEnum.False ? 'danger' : 'success'"
                    link
                    size="small"
                    @click.stop="changeStatus(scope.row)"
                  >
                    {{ scope.row.status == StatusEnum.False ? "禁用" : "启用" }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <template #footer>
            <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.page" v-model:limit="queryParams.limit" @pagination="handleQuery" />
          </template>
        </el-card>
      </div>
    </div>

    <!-- 用户表单弹窗 -->
    <el-drawer v-model="dialog.visible" :title="dialog.title" append-to-body @close="handleCloseDialog">
      <el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :readonly="!!formData.uid" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="department_id">
          <el-tree-select v-model="formData.department_id" placeholder="请选择所属部门" :data="deptOptions" filterable check-strictly :render-after-expand="false" />
        </el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select v-model="formData.roles" multiple placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <template v-if="!formData.uid">
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" maxlength="50" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input v-model="formData.password2" placeholder="请输入确认密码" maxlength="50" />
          </el-form-item>
        </template>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" maxlength="50" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" inline-prompt active-text="正常" inactive-text="禁用" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/system/user";
import DeptAPI from "@/api/system/dept";
import RoleAPI from "@/api/system/role";

import DeptTree from "./dept-tree.vue";
import { deepChangeOption } from "@/utils";
import { StatusEnum } from "@/enums/MenuTypeEnum";

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<UserPageVO[]>();
/** 部门下拉选项 */
const deptOptions = ref<OptionType[]>();
/** 角色下拉选项 */
const roleOptions = ref<OptionType[]>();
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  page: 1,
  limit: 20,
});

/**  用户弹窗对象  */
const dialog = reactive({
  visible: false,
  title: "",
});

/** 导入弹窗显示状态 */
const importDialogVisible = ref(false);

// 用户表单数据
const formData = reactive<UserForm>({
  status: 1,
});

/** 用户表单校验规则  */
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  department_id: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roles: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  password: [
    {
      required: true,
      message: "密码至少需要6位字符，请重新输入",
      trigger: "blur",
      pattern: /^.{6,}$/,
    },
  ],
  password2: [{ required: true, message: "确认密码不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;

  UserAPI.index(queryParams)
    .then((data) => {
      pageData.value = data.data;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.department_id = undefined;
  queryParams.createTime = undefined;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.uid);
}

/** 重置密码 */
function hancleResetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt("请输入用户「" + row.username + "」的新密码", "重置密码").then(({ value }) => {
    if (!value || value.length < 8) {
      // 检查密码是否为空或少于8位
      ElMessage.warning("密码至少需要8位字符，请重新输入");
      return false;
    }
    UserAPI.resetPassword({ uid: row.uid, password: value }).then((data) => {
      ElMessageBox.alert("password:" + value);
    });
  });
}

async function getOPtions() {
  // 加载部门下拉数据源
  deptOptions.value = await DeptAPI.getOptions();
  deptOptions.value = deepChangeOption(deptOptions.value, [
    ["label", "title"],
    ["value", "id"],
  ]);
  // 加载角色下拉数据源
  roleOptions.value = await RoleAPI.options();
  roleOptions.value = deepChangeOption(roleOptions.value, [
    ["label", "title"],
    ["value", "id"],
  ]);
}
getOPtions();
/**
 * 打开弹窗
 */
async function handleOpenDialog(item?: UserPageVO) {
  dialog.visible = true;
  if (item) {
    dialog.title = "修改用户";
    nextTick(() => {
      Object.assign(formData, item);
      formData.roles = item.roles?.map((item) => item.id);
    });
  } else {
    dialog.title = "新增用户";
  }
}

/** 关闭弹窗 */
function handleCloseDialog() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  dialog.visible = false;
  formData.uid = undefined;
  formData.status = 1;
}
function selectableHandler(row: UserPageVO) {
  if (row.uid === 1) return false;
  return true;
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.uid;
      loading.value = true;
      if (userId) {
        UserAPI.update(formData)
          .then(() => {
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.add(formData)
          .then(() => {
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

/** 删除用户 */
function handleDelete(uid?: number) {
  const userIds = [uid || removeIds.value];
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    type: "warning",
  }).then(function () {
    loading.value = true;
    UserAPI.deleteByIds(userIds)
      .then(() => {
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

function changeStatus(item: UserPageVO) {
  item.roles = item.roles?.map((item) => item.id);
  UserAPI.update({
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
<style lang="scss" scoped>
.flex_row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 100%;
  width: 100%;
  .row_item {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 80%;
    :deep(.table-wrapper) {
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .el-card__body {
        flex-grow: 1;
      }
      .el-table {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
