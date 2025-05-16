import langApi, { contentModel, Form } from "@/api/system/lang";
import api from "@/api/common";

export const useStore = defineStore("common", () => {
  /**语言列表 */
  const langList = ref<Form[]>();
  async function getOptions() {
    langList.value = await langApi.getOptions();
    return Promise.resolve(langList.value);
  }
  const getLangList = computed(() => {
    if (langList.value) return Promise.resolve(langList.value);
    else return getOptions();
  });
  /**vip列表 */
  const _vipList = ref<vipView[]>();
  async function getVipList() {
    _vipList.value = await api.getVipList<vipView[]>();
    return Promise.resolve(_vipList.value);
  }
  const vipList = computed(() => {
    if (!_vipList.value) getVipList();
    return _vipList;
  });
  return {
    getLangList,
    getVipList,
    vipList,
  };
});

type vipView = { id: number; title: string; level: number };
