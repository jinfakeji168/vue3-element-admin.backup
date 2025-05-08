export const store = defineStore("common", () => {
  const departmentList = ref([]);

  return {
    departmentList,
  };
});
