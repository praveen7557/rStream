import { ref } from "vue";

export const useAsync = async (request) => {
  const loading = ref(true);
  let data, error;
  try {
    data = await request();
  } catch (err) {
    error = err;
  } finally {
    loading.value = false;
  }
  return {
    data,
    error,
    loading,
  };
};
