import langApi, { contentModel, Form } from "@/api/system/lang";
import api from "@/api/common";

export const useStore = defineStore("common", () => {
  /**语言列表 */
  const langList = ref<Form[]>();
  async function getLangListAsync() {
    if (!langList.value) langList.value = await langApi.getOptions();
    return Promise.resolve(langList.value);
  }
  /**vip列表 */
  const _vipList = ref<vipView[]>();
  async function getVipListAsync() {
    if (!_vipList.value) _vipList.value = await api.getVipList<vipView[]>();
    return Promise.resolve(_vipList.value);
  }
  const vipList = computed<vipView[]>(() => {
    if (!_vipList.value) getVipListAsync();
    return unref(_vipList);
  });
  return {
    getLangListAsync,
    getVipListAsync,
    vipList,
  };
});

type vipView = { id: number; title: string; level: number };
