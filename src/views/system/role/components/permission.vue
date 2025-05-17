<template>
  <!-- 分配权限弹窗 -->
  <el-drawer v-model="visible" title="'权限分配'" size="500">
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
        <el-checkbox v-model="parentChildLinked" class="ml-5" @change="parentChildLinked = $event">父子联动</el-checkbox>

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
      :data="menuPermTreeData"
      :default-expand-all="true"
      :check-strictly="!parentChildLinked"
      :filter-node-method="handlePermFilter"
    >
      <template #default="{ data }">
        {{ data.label }}
      </template>
    </el-tree>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHanlder" :loading="loading">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import MenuAPI from "@/api/system/menu";
import RoleAPI, { RolePageVO } from "@/api/system/role";
import { deepChangeOption } from "@/utils";
const props = defineProps<{
  data?: RolePageVO;
}>();
const visible = defineModel<boolean>();
const permKeywords = ref("");

// 菜单权限树结构
const menuPermTreeData = ref<OptionType[]>([]);

const isExpanded = ref(true);
const permTreeRef = ref<InstanceType<typeof ElTree>>();
const parentChildLinked = ref(true);

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
/** 权限搜索筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});
function handlePermFilter(value: string, data: any) {
  if (!value) return true;
  return data.label.includes(value);
}
// 获取所有的菜单
async function getRouterTree() {
  const res = await MenuAPI.index({ is_tree: 1 });
  menuPermTreeData.value = deepChangeOption(res, [
    ["label", "title"],
    ["value", "id"],
  ]);
}
getRouterTree();

/**  */
async function init(row: RolePageVO) {
  const roleId = row.id;
  if (roleId) {
    // 回显角色已拥有的菜单
    const checkedMenuIds = row.permissions!.map((item) => item.id);
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
      deepLoop(unref(menuPermTreeData));
    });
  }
}

watch(visible, (res) => {
  if (res) init(<RolePageVO>props.data);
});

const emit = defineEmits(["finally"]);

const loading = ref(false);
async function submitHanlder() {
  const checkedMenuIds = unref(permTreeRef)
    ?.getCheckedNodes(false, true)
    .map((node: any) => node.value);
  loading.value = true;
  try {
    await RoleAPI.updateRoleMenus(<number>props.data!.id, <number[]>checkedMenuIds);
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emit("finally");
}
</script>
