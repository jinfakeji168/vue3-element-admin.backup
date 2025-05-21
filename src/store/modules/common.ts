import langApi, { Form } from "@/api/system/lang";
import api from "@/api/common";

export const useStore = defineStore("common", () => {
  /**语言列表 */
  const _langList = ref<Form[]>();
  async function getLangListAsync() {
    if (!_langList.value) _langList.value = await langApi.getOptions();
    return Promise.resolve(_langList.value);
  }
  const langList = computed<Form[]>(() => {
    if (!_langList.value) getLangListAsync();
    return unref(_langList) || [];
  });

  /**vip列表 */
  const _vipList = ref<vipView[]>();
  async function getVipListAsync() {
    if (!_vipList.value) _vipList.value = await api.getVipList<vipView[]>();
    return Promise.resolve(_vipList.value);
  }
  const vipList = computed<vipView[]>(() => {
    if (!_vipList.value) getVipListAsync();
    return unref(_vipList) || [];
  });
  return {
    getLangListAsync,
    getVipListAsync,
    vipList,
    langList,
  };
});

type vipView = { id: number; title: string; level: number };
