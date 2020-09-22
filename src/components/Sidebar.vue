<template>
  <nav class="sidebar">
    <router-link to="/">
      <h3 class="brand">rVideos</h3>
      <div class="subs">
        <router-link :to="`/${item}`" v-for="item in subreddits" :key="item" class="sub-link">
          <div class="sub-name">{{item}}</div>
        </router-link>
      </div>
    </router-link>
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
