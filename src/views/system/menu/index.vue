<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item :label="$t('quanXianBiaoShi')" prop="name">
          <el-input v-model="queryParams.name" :placeholder="$t('quanXianBiaoShi_0')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item :label="$t('caiDanMingZi')" prop="title">
          <el-input v-model="queryParams.title" :placeholder="$t('caiDanMingZi_0')" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
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

    <el-card shadow="never" class="table-wrapper" v-loading="loading">
      <template #header>
        <el-button v-hasPerm="['menu:add']" type="success" @click="handleOpenDialog()" :disabled="!enabled">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
      </template>

      <el-table
        :data="menuTableData"
        row-key="id"
        :expand-row-keys="expand_rowList"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
        @row-click="handleRowClick"
      >
        <el-table-column :label="$t('caiDanMingCheng')" min-width="200">
          <template #default="scope">
            <template v-if="scope.row.icon && scope.row.icon.startsWith('el-icon')">
              <el-icon style="vertical-align: -0.15em">
                <component :is="scope.row.icon.replace('el-icon-', '')" />
              </el-icon>
            </template>
            <template v-else-if="scope.row.icon">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
            <template v-else>
              <svg-icon icon-class="menu" />
            </template>
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('paiXu')" align="center" width="80" prop="sort" />

        <el-table-column :label="$t('leiXing_0')" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.component === 'Layout'" type="warning">{{ $t("muLu") }}</el-tag>
            <el-tag v-else-if="scope.row.type === MenuTypeEnum.MENU" type="success">{{ $t("caiDan") }}</el-tag>
            <el-tag v-else-if="scope.row.type === MenuTypeEnum.BUTTON" type="danger">{{ $t("anNiu") }}</el-tag>
            <el-tag v-else-if="scope.row.type === MenuTypeEnum.EXTLINK" type="info">{{ $t("waiLian") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('zhuangTai')" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.hidden === StatusEnum.False" type="success">{{ $t("xianShi") }}</el-tag>
            <el-tag v-else type="info">{{ $t("yinCang") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('quanXianBiaoShi_1')" align="left" width="150" prop="name" />

        <el-table-column :label="$t('luYouLuJing')" align="left" width="150" prop="path" />

        <el-table-column :label="$t('zuJianLuJing')" align="left" width="250" prop="component" />

        <el-table-column fixed="right" align="center" :label="$t('caoZuo')" width="220" v-if="enabled">
          <template #default="scope">
            <el-button v-if="scope.row.type == MenuTypeEnum.MENU" v-hasPerm="['menu:add']" type="primary" link size="small" @click.stop="handleOpenDialog(scope.row)">
              <template #icon>
                <Plus />
              </template>
              {{ $t("xinZeng") }}
            </el-button>

            <el-button v-hasPerm="['menu:edit']" type="primary" link size="small" @click.stop="handleOpenDialog(undefined, scope.row)">
              <template #icon>
                <Edit />
              </template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['menu:delete']" type="danger" link size="small" @click.stop="handleDelete(scope.row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="dialog.visible" :title="dialog.title" size="50%" @close="handleCloseDialog">
      <el-form ref="menuFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item :label="$t('fuJiCaiDan')" prop="parent_id">
          <el-tree-select v-model="formData.parent_id" :placeholder="$t('xuanZeShangJiCaiDan')" :data="menuOptions" filterable check-strictly :render-after-expand="false" />
        </el-form-item>

        <el-form-item :label="$t('mingCheng')" prop="title">
          <el-input v-model="formData.title" :placeholder="$t('qingShuRuMingCheng')" />
        </el-form-item>
        <el-form-item :label="$t('quanXianBiaoShi_2')" prop="name">
          <template #label>
            <div class="flex-y-center">
              {{ $t("quanXianBiaoShi_3") }}
              <el-tooltip placement="bottom" effect="light">
                <template #content>{{ $t("heLuYouMingChengGon") }}</template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="formData.name" :placeholder="$t('qingShuRuQuanXianBi')" />
        </el-form-item>
        <el-form-item :label="$t('caiDanLeiXing')" prop="type">
          <el-radio-group v-model="formData.type" @change="handleMenuTypeChange">
            <!-- <el-radio value="CATALOG">目录</el-radio> -->
            <el-radio value="menu">{{ $t("caiDan_0") }}</el-radio>
            <el-radio value="button">{{ $t("anNiu_0") }}</el-radio>
            <el-radio value="link">{{ $t("waiLian_0") }}</el-radio>
            <el-radio value="iframe">iframe</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.type == MenuTypeEnum.EXTLINK" :label="$t('waiLianDiZhi')" prop="path">
          <el-input v-model="formData.path" :placeholder="$t('qingShuRuWaiLianWan')" />
        </el-form-item>

        <el-form-item v-if="formData.type == MenuTypeEnum.MENU" prop="path">
          <template #label>
            <div class="flex-y-center">
              {{ $t("luYouLuJing_0") }}
              <el-tooltip placement="bottom" effect="light">
                <template #content>{{ $t("dingYiYingYongZhong") }}</template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-input v-if="formData.type == MenuTypeEnum.MENU" v-model="formData.path" placeholder="system" />
          <el-input v-else v-model="formData.path" placeholder="user" />
        </el-form-item>

        <el-form-item v-if="formData.type == MenuTypeEnum.MENU" prop="component">
          <template #label>
            <div class="flex-y-center">
              {{ $t("zuJianLuJing_0") }}
              <el-tooltip placement="bottom" effect="light">
                <template #content>{{ $t("muLuSheZhiWeiLayout") }}</template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-input v-model="formData.component" placeholder="system/user/index" style="width: 95%">
            <template v-if="formData.type == MenuTypeEnum.MENU" #prepend>src/views/</template>
            <template v-if="formData.type == MenuTypeEnum.MENU" #append>.vue</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item v-if="formData.type == MenuTypeEnum.MENU">
          <template #label>
            <div class="flex-y-center">
              路由参数
              <el-tooltip placement="bottom" effect="light">
                <template #content>组件页面使用 `useRoute().query.参数名` 获取路由参数值。</template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>

          <div v-if="!formData.params || formData.params.length === 0">
            <el-button type="success" plain @click="formData.params = [{ key: '', value: '' }]">添加路由参数</el-button>
          </div>

          <div v-else>
            <div v-for="(item, index) in formData.params" :key="index">
              <el-input v-model="item.key" placeholder="参数名" style="width: 100px" />

              <span class="mx-1">=</span>

              <el-input v-model="item.value" placeholder="参数值" style="width: 100px" />

              <el-icon
                v-if="formData.params.indexOf(item) === formData.params.length - 1"
                class="ml-2 cursor-pointer color-[var(--el-color-success)]"
                style="vertical-align: -0.15em"
                @click="formData.params.push({ key: '', value: '' })"
              >
                <CirclePlusFilled />
              </el-icon>
              <el-icon class="ml-2 cursor-pointer color-[var(--el-color-danger)]" style="vertical-align: -0.15em" @click="formData.params.splice(formData.params.indexOf(item), 1)">
                <DeleteFilled />
              </el-icon>
            </div>
          </div>
        </el-form-item> -->

        <el-form-item v-if="formData.type !== MenuTypeEnum.BUTTON" prop="hidden" :label="$t('xianShiZhuangTai')">
          <el-radio-group v-model="formData.hidden">
            <el-radio :value="1">{{ $t("xianShi_0") }}</el-radio>
            <el-radio :value="2">{{ $t("yinCang_0") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item
          v-if="
            formData.type === MenuTypeEnum.CATALOG ||
            formData.type === MenuTypeEnum.MENU
          "
        >
          <template #label>
            <div class="flex-y-center">
              始终显示
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  选择“是”，即使目录或菜单下只有一个子节点，也会显示父节点。
                  <br />
                  选择“否”，如果目录或菜单下只有一个子节点，则只显示该子节点，隐藏父节点。
                  <br />
                  如果是叶子节点，请选择“否”。
                </template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-radio-group v-model="formData.alwaysShow">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <!-- <el-form-item
          v-if="formData.type === MenuTypeEnum.MENU"
          label="缓存页面"
        >
          <el-radio-group v-model="formData.keepAlive">
            <el-radio :value="1">开启</el-radio>
            <el-radio :value="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item :label="$t('paiXu')" prop="sort">
          <el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="0" />
        </el-form-item>

        <el-form-item v-if="formData.type !== MenuTypeEnum.BUTTON" :label="$t('tuBiao')" prop="icon">
          <!-- 图标选择器 -->
          <icon-select v-model="formData.icon" />
        </el-form-item>

        <el-form-item v-if="formData.type == MenuTypeEnum.CATALOG" :label="$t('tiaoZhuanLuYou')">
          <el-input v-model="formData.redirect" :placeholder="$t('tiaoZhuanLuYou_0')" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">{{ $t("queDing") }}</el-button>
          <el-button @click="handleCloseDialog">{{ $t("quXiao") }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SysMenu",
  inheritAttrs: false,
});

import MenuAPI, { MenuQuery, MenuForm, MenuVO } from "@/api/system/menu";
import { MenuTypeEnum, StatusEnum } from "@/enums/MenuTypeEnum";

const queryFormRef = ref(ElForm);
const menuFormRef = ref(ElForm);

const loading = ref(false);
const dialog = reactive({
  title: $t("xinZengCaiDan"),
  visible: false,
});

// 查询参数
const queryParams = reactive<MenuQuery>({});
// 菜单表格数据
const menuTableData = ref<MenuVO[]>([]);
// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);

// 初始菜单表单数据
const initialMenuFormData = ref<MenuForm>({
  id: undefined,
  parent_id: 0,
  hidden: StatusEnum.True,
  sort: 1,
  type: MenuTypeEnum.MENU, // 默认菜单
  alwaysShow: 0,
  keepAlive: 1,
  params: [],
  title: "",
});

// 菜单表单数据
const formData = ref({ ...initialMenuFormData.value });

// 表单验证规则
const rules = reactive({
  parent_id: [{ required: true, message: $t("qingXuanZeDingJiCai"), trigger: "blur" }],
  title: [{ required: true, message: $t("qingShuRuCaiDanMing"), trigger: "blur" }],
  name: [{ required: true, message: $t("qingShuRuCaiDanQuan"), trigger: "blur" }],
  type: [{ required: true, message: $t("qingXuanZeCaiDanLei"), trigger: "blur" }],
  path: [{ required: true, message: $t("qingShuRuLuYouLuJi"), trigger: "blur" }],
  component: [{ required: true, message: $t("qingShuRuZuJianLuJ"), trigger: "blur" }],
  hidden: [{ required: true, message: $t("qingXuanZeXianShiZh"), trigger: "blur" }],
});

// 选择表格的行菜单ID
const selectedMenuId = ref<number | undefined>();

/**默认展开的行 */
const expand_rowList = ref<string[]>([]);
/**深度flat 并且排除掉按钮 @stone*/
function deepFlat(list: any[]): any[] {
  return list.flatMap((item: any) => {
    let temp = [];
    if (item.children && item.children.every((val: any) => val.type == MenuTypeEnum.MENU)) {
      temp = deepFlat(item.children);
      return [item, ...temp];
    } else return [];
  });
}

// 查询菜单
async function handleQuery() {
  loading.value = true;
  const data = await MenuAPI.index({ ...queryParams, is_tree: 1, page: 1 });
  menuTableData.value = data;
  loading.value = false;

  expand_rowList.value = deepFlat(data)
    .filter((val) => val.type == MenuTypeEnum.MENU)
    .map((val) => String(val.id));
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

// 行点击事件
function handleRowClick(row: MenuVO) {
  // 记录表格选择的菜单ID，新增子菜单作为父菜单ID
  selectedMenuId.value = row.id as number;
}

function getMenuOptions(list: any[]): any[] {
  return list.map((item) => ({
    value: item.id,
    label: item.title,
    children: item.children ? getMenuOptions(item.children) : [],
  }));
}

/**
 * 打开表单弹窗
 *
 * @param parent_id 父菜单ID
 * @param menuId 菜单ID
 */
async function handleOpenDialog(row?: MenuVO, menu?: MenuVO) {
  // const data = await MenuAPI.getOptions(true);
  menuOptions.value = [
    {
      value: 0,
      label: $t("dingJiCaiDan"),
      children: getMenuOptions(menuTableData.value),
    },
  ];
  dialog.visible = true;
  if (menu) {
    dialog.title = $t("bianJiCaiDan");
    // initialMenuFormData.value = { ...menu };
    nextTick(() => {
      formData.value = { ...menu };
    });
  } else {
    dialog.title = $t("xinZengCaiDan_0");
    formData.value.parent_id = row?.id as number;
    formData.value.sort = (row?.children?.length || 0) + 1;
  }
}

// 菜单类型切换
function handleMenuTypeChange() {
  // 如果菜单类型改变
  if (formData.value.type !== initialMenuFormData.value.type) {
    if (formData.value.type === MenuTypeEnum.MENU) {
      // 目录切换到菜单时，清空组件路径
      if (initialMenuFormData.value.type === MenuTypeEnum.CATALOG) {
        formData.value.component = "";
      } else {
        // 其他情况，保留原有的组件路径
        formData.value.path = initialMenuFormData.value.path;
        formData.value.component = initialMenuFormData.value.component;
      }
    }
  }
}

/** 菜单保存提交 */
function submitForm() {
  menuFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const menuId = formData.value.id;
      if (menuId) {
        MenuAPI.update(menuId as string, formData.value).then(() => {
          handleCloseDialog();
          handleQuery();
        });
      } else {
        MenuAPI.add(formData.value).then(() => {
          handleCloseDialog();
          handleQuery();
        });
      }
    }
  });
}

// 删除菜单
function handleDelete(menuId: number) {
  if (!menuId) {
    ElMessage.warning($t("qingGouXuanShanChuX"));
    return false;
  }

  ElMessageBox.confirm($t("queRenShanChuYiXuan"), $t("jingGao"), {
    type: "warning",
  }).then(() => {
    loading.value = true;
    MenuAPI.deleteById([menuId])
      .then(() => {
        handleQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

// 关闭弹窗
function handleCloseDialog() {
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();
  formData.value.id = undefined;
  dialog.visible = false;
}
const enabled: Ref<boolean> = ref(true);
onMounted(() => {
  handleQuery();
  let count = 0;
  ElMessageBox.confirm("警告，此页面为开发人员开发使用，请谨慎操作！", {
    cancelButtonText: "仅查看",
    confirmButtonText: "开发人员",
    beforeClose(action, instance, done) {
      if (action === "confirm") count++;
      else {
        done();
        enabled.value = false;
      }
      if (count > 5) {
        done();
        enabled.value = true;
      }
    },
  });
});
</script>
