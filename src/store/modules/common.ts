import langApi, { contentModel, Form } from "@/api/system/lang";

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
  return {
    getLangList,
  };
});
