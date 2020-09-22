<template>
  <div class="dropdown-container" ref="node">
    <div class="name" @click="toggle">{{displayName}}</div>
    <div class="select-values" v-if="isOpen">
      <div
        class="select-value"
        v-for="item in values"
        :key="item.value"
        @click="select(item)"
      >{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import { computed, ref, toRefs } from "vue";
import { useClickOutside } from "../hooks/click-outside";
export default {
  props: {
    name: String,
    values: Array,
    defaultValue: Object,
  },
  setup(props, { emit }) {
    const { name, values, defaultValue } = toRefs(props);
    const selected = ref(defaultValue.value);
    const isOpen = ref(false);

    const displayName = computed(() => {
      return selected.value ? selected.value.name : name.value;
    });

    const toggle = (value) => {
      isOpen.value = !isOpen.value;
    };

    const closeMenu = () => {
      isOpen.value = false;
    };

    const select = (item) => {
      selected.value = item;
      closeMenu();
      emit("selected", item);
    };

    const { node } = useClickOutside(closeMenu);

    return {
      displayName,
      values,
      toggle,
      select,
      isOpen,
      node,
    };
  },
};
</script>

<style lang="scss">
.dropdown-container {
  max-width: 90px;
  position: relative;

  .name {
    position: relative;
    display: inline-block;
    color: #fff;
    cursor: pointer;
    font-weight: 500;

    &:after {
      content: "";
      position: absolute;
      right: -17px;
      background-image: url("../assets/caret-down.svg");
      background-repeat: no-repeat;
      height: 12px;
      width: 12px;
      background-size: contain;
      top: 6px;
    }
  }

  .select-values {
    position: absolute;
    width: 120px;
    background: #282828;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    padding: 3px 0;
    margin-top: 3px;
    z-index: 100;

    .select-value {
      padding: 3px 10px;
      cursor: pointer;

      &:hover {
        color: #fff;
        background-color: #333;
        border-color: #333;
        text-decoration: none;
      }
    }
  }
}
</style>
