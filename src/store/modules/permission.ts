import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import MenuAPI, { type RouteVO } from "@/api/system/menu";
import { useUserStore } from "@/store/modules/user";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

import router from "@/router";

export const usePermissionStore = defineStore("permission", () => {
  /** 所有路由，包括静态和动态路由 */
  const routes = ref<RouteRecordRaw[]>([]);
  /** 混合模式左侧菜单 */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  const isRoutesLoaded = ref(false);
  /**是否有提现订单权限 */
  const hasWithdrawOrder = ref(false);
  /**
   * 生成动态路由
   */
  function generateRoutes() {
    const userStore = useUserStore(store);
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      MenuAPI.getRoutes()
        .then((data) => {
          console.log("🚀 ~ generateRoutes ~ data:", data)
          //data.permissions 存入 userinfo
          userStore.setUserInfoPermission(data.permissions);
          const dynamicRoutes = transformRoutes(data.menu);
          routes.value = constantRoutes.concat(dynamicRoutes);
          isRoutesLoaded.value = true;
          hasOrderPermission(dynamicRoutes)
          resolve(dynamicRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**查询是否有订单页面权限 */
  function hasOrderPermission(list: RouteRecordRaw[]) {
    const res = list.find(i => i.name == 'bill')?.children?.find(i => i.name == "withdrawOrder")
    hasWithdrawOrder.value = !!res
  }



  /**
   * 混合模式菜单下根据顶部菜单路径设置左侧菜单
   *
   * @param topMenuPath - 顶部菜单路径
   */
  const setMixLeftMenus = (topMenuPath: string) => {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  };

  /**
   * 重置路由
   */
  const resetRouter = () => {
    // 删除动态路由，保留静态路由
    routes.value.forEach((route) => {
      if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
        router.removeRoute(route.name); // 从 router 实例中移除动态路由
      }
    });

    routes.value = [];
    mixLeftMenus.value = [];
    isRoutesLoaded.value = false;
  };

  return {
    routes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
    isRoutesLoaded,
    resetRouter,
    hasWithdrawOrder
  };
});

/**
 * 转换路由数据为组件
 */
const transformRoutes = (routes: RouteVO[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw;
    // 顶级目录，替换为 Layout 组件
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout;
    } else {
      // 其他菜单，根据组件路径动态加载组件
      const component = modules[`../../views/${tmpRoute.component}.vue`];
      if (component) {
        tmpRoute.component = component;
      } else {
        tmpRoute.component = modules["../../views/error-page/404.vue"];
      }
    }

    if (tmpRoute.children) {
      if (tmpRoute.children[0].type == 'menu') {
        tmpRoute.children = transformRoutes(route.children);
      } else {
        tmpRoute.children = [];
      }
    }

    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};

/**
 * 在组件外使用 Pinia store 实例
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
