<!-- 用户管理 -->
<template>
  <div class="app-container">
    <div class="flex_row">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTree v-model="queryParams.department_id" @node-click="query_handler" />
      </el-col>
      <!-- 用户列表 -->
      <div class="row_item">
        <div class="search-bar">
          <QueryPart ref="queryFormRef" v-model="queryParams" :config="queryConfig" @search="query_handler" @reset="reset_query_handler" />
          <!-- ...existing的el-form已移除... -->
        </div>
        <el-card shadow="never" class="table-wrapper" v-loading="loading">
          <template #header>
            <div class="flex-x-between">
              <div>
                <el-button v-hasPerm="['user:add']" type="success" @click="open_dialog_handler()">
                  <template #icon><Plus /></template>
                  新增
                </el-button>
                <el-button v-hasPerm="['user:delete']" type="danger" :disabled="removeIds.length === 0" @click="delete_handler()">
                  <template #icon><Delete /></template>
                  删除
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="pageData" @selection-change="selection_change_handler">
            <el-table-column type="selection" :selectable="selectableHandler" width="50" align="center" />
            <el-table-column key="uid" label="编号" align="center" prop="uid" width="60" />
            <el-table-column key="username" label="用户名" align="center" prop="username" width="200" />
            <el-table-column label="用户昵称" align="center" prop="nickname" />
            <el-table-column label="部门" width="150" align="center" prop="department.title" />
            <el-table-column label="手机号码" align="center" prop="mobile" width="120" />
            <el-table-column label="邮箱" align="center" prop="email" width="180" />
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
                <el-button v-hasPerm="['user:edit']" type="primary" size="small" link @click="reset_password_handler(scope.row)">
                  <template #icon><RefreshLeft /></template>
                  重置密码
                </el-button>
                <template v-if="scope.row.uid !== 1">
                  <el-button v-hasPerm="['user:edit']" type="primary" link size="small" @click="open_dialog_handler(scope.row)">
                    <template #icon><EditPen /></template>
                    编辑
                  </el-button>
                  <el-button v-hasPerm="['user:delete']" type="danger" link size="small" @click="delete_handler(scope.row.uid)">
                    <template #icon><Delete /></template>
                    删除
                  </el-button>
                  <el-button
                    v-hasPerm="['user:status']"
                    :type="scope.row.status == StatusEnum.False ? 'danger' : 'success'"
                    link
                    size="small"
                    @click.stop="status_change_handler(scope.row)"
                  >
                    <template #icon><Switch /></template>
                    {{ scope.row.status == StatusEnum.False ? "禁用" : "启用" }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.page" v-model:limit="queryParams.limit" @pagination="query_handler" />
          </template>
        </el-card>
      </div>
    </div>
    <!-- 用户表单弹窗 -->
    <user-dialog v-model:visible="dialog.visible" :title="dialog.title" ref="dialogRef" @success="reset_query_handler" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, unref } from "vue";
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import UserAPI, { UserPageQuery, UserPageVO } from "@/api/system/user";
import DeptTree from "./dept-tree.vue";
import UserDialog from "./user-dialog.vue";
import { StatusEnum } from "@/enums/MenuTypeEnum";

/**注释 用户查询表单引用*/
const queryFormRef = ref(ElForm);
/**注释 用户弹窗引用*/
const dialogRef = ref();

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<UserPageVO[]>();
/**注释 用户查询参数*/
const queryParams = reactive<UserPageQuery>({
  page: 1,
  limit: 20,
});
/**注释 用户查询配置*/
const queryConfig = {
  formItem: [
    {
      type: "input",
      modelKey: "username",
      label: "用户名",
      props: { placeholder: "请输入用户名", style: { width: "200px" } },
    },
    {
      type: "input",
      modelKey: "mobile",
      label: "手机号",
      props: { placeholder: "请输入手机号", style: { width: "200px" } },
    },
    {
      type: "input",
      modelKey: "email",
      label: "邮箱",
      props: { placeholder: "请输入邮箱", style: { width: "200px" } },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { value: StatusEnum.False, label: "正常" },
        { value: StatusEnum.True, label: "禁用" },
      ],
      props: { placeholder: "全部", style: { width: "100px" }, clearable: true },
    },
  ],
};
/**注释 用户弹窗对象*/
const dialog = reactive({
  visible: false,
  title: "",
});

function selectableHandler(row: UserPageVO) {
  return row.uid !== 1;
}

/**注释 用户查询 */
async function query_handler() {
  loading.value = true;
  try {
    const data = await UserAPI.index(queryParams);
    pageData.value = data.data;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

/**注释 重置查询 */
async function reset_query_handler() {
  unref(queryFormRef).resetFields();
  queryParams.page = 1;
  queryParams.department_id = undefined;
  queryParams.createTime = undefined;
  await query_handler();
}

/**注释 行复选框选中记录 */
function selection_change_handler(selection: any) {
  removeIds.value = selection.map((item: any) => item.uid);
}

/**注释 重置密码 */
async function reset_password_handler(row: { [key: string]: any }) {
  try {
    const { value } = await ElMessageBox.prompt(`请输入用户「${row.username}」的新密码`, "重置密码");
    if (!value || value.length < 8) {
      ElMessage.warning("密码至少需要8位字符，请重新输入");
      return;
    }
    await UserAPI.resetPassword({ uid: row.uid, password: value });
    ElMessageBox.alert("password:" + value);
  } catch (e) {
    // 用户取消或出错
  }
}

/**注释 打开弹窗 */
function open_dialog_handler(item?: UserPageVO) {
  dialog.visible = true;
  if (item) {
    dialog.title = "修改用户";
    unref(dialogRef)?.setFormData(item);
  } else {
    dialog.title = "新增用户";
  }
}

/**注释 删除用户 */
async function delete_handler(uid?: number) {
  const userIds = uid ? [uid] : removeIds.value;
  if (userIds.length === 0) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  try {
    await ElMessageBox.confirm("确认删除用户?", "警告", { type: "warning" });
    loading.value = true;
    await UserAPI.deleteByIds(userIds);
    await reset_query_handler();
  } finally {
    loading.value = false;
  }
}

/**注释 改变用户状态 */
async function status_change_handler(item: UserPageVO) {
  item.roles = item.roles?.map((r) => r.id);
  await UserAPI.update({
    ...item,
    status: item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True,
  });
  await query_handler();
}

onMounted(() => {
  query_handler();
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
