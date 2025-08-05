import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import NProgress from "@/utils/nprogress";
import { getToken } from "@/utils/auth";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const isLogin = !!getToken(); // 判断是否登录
    if (isLogin) {
      if (to.path === "/login") {
        // 已登录，访问登录页，跳转到首页
        next({ path: "/" });
      } else {
        const permissionStore = usePermissionStore();
        // 判断路由是否加载过
        if (permissionStore.isRoutesLoaded) {
          if (to.matched.length === 0) {
            // 路由未匹配，跳转到404
            next("/404");
          } else {
            // 动态设置页面标题
            const title = (to.params.title as string) || (to.query.title as string);
            if (title) {
              to.meta.title = title;
            }
            next();
          }
        } else {
          try {
            // 生成动态路由
            const dynamicRoutes = await permissionStore.generateRoutes();
            dynamicRoutes.reverse()
            console.log("🚀 ~ setupPermission ~ route:", dynamicRoutes)
            dynamicRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route);
            });
            next({ ...to, replace: true }); // 添加动态路由后重新导航
          } catch (error) {
            console.error(error);
            // 路由加载失败，重置 token 并重定向到登录页
            await useUserStore().clearUserSession();
            redirectToLogin(to, next);
            NProgress.done();
          }
        }
      }
    } else {
      // 未登录，判断是否在白名单中
      if (whiteList.includes(to.path)) {
        next();
      } else {
        // 不在白名单，重定向到登录页
        redirectToLogin(to, next);
        NProgress.done(); // 关闭进度条
      }
    }
  });

  // 后置守卫，保证每次路由跳转结束时关闭进度条
  router.afterEach(() => {
    NProgress.done();
  });
}

/** 重定向到登录页 */
function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/** 判断是否有权限 */
export function hasAuth(value: string | string[], type: "button" | "role" = "button") {
  const { roles, perms } = useUserStore().userInfo;

  // 超级管理员 拥有所有权限
  if (roles?.some((val) => val.id == 1)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string" ? auths?.includes(value) : value.some((perm) => auths?.includes(perm));
}
