import { ref, onMounted, onUnmounted } from "vue";

export const useClickOutside = (setContainerStatus) => {
  const node = ref(null);

  const handleClick = (e) => {
    if (node.value.contains(e.target)) {
      return;
    }
    setContainerStatus();
  };

  onMounted(() => document.addEventListener("mousedown", handleClick));

  onUnmounted(() => document.removeEventListener("mousedown", handleClick));

  return { node };
};
