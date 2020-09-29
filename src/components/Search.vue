<template>
  <div class="search-container">
    <span class="icon"></span>
    <input
      type="text"
      v-model="search"
      placeholder="Search like r/india, r/WoahTube"
      @keyup.enter="searchEnter"
    />
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props, { emit }) {
    const search = ref(null);
    const searchEnter = () => {
      emit("search", search.value);
    };

    return {
      search,
      searchEnter,
    };
  },
};
</script>

<style lang="scss">
.search-container {
  height: 33px;
  width: 240px;
  background-color: #404042;
  border-radius: 3px;
  transition: all 0.5s;

  .icon {
    height: 20px;
    width: 20px;
    background-image: url("../assets/search.svg");
    display: inline-block;
    margin-left: 6px;
    vertical-align: middle;
    background-size: 17px;
    background-repeat: no-repeat;
  }

  input {
    width: 83%;
    margin-left: 5px;
    vertical-align: middle;
    height: 100%;
    background: transparent;
    outline: none;
    border: none;
    padding-left: 3px;
    color: #fff;
  }
}

@media (max-width: 576px) {
  .search-container {
    width: 120px;

    input {
      width: calc(100% - 35px);
    }
  }
}
</style>
