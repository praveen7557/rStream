<template>
  <nav class="sidebar">
    <router-link to="/">
      <h3 class="brand">
        <img src="../assets/reddit.svg" alt="rStream" /> rStream
      </h3>
    </router-link>
    <div class="subs">
      <router-link
        :to="`/${item.value}`"
        v-for="item in subreddits"
        :key="item.value"
        class="sub-link"
      >
        <div class="sub-name">{{ item.value }}</div>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { subreddits } from "../samples/subs";
export default {
  setup() {
    return {
      subreddits,
    };
  },
};
</script>

<style lang="scss">
</style>
