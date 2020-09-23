<template>
  <div class="body-container">
    <Sidebar />
    <div class="content-container">
      <section class="top-section">
        <Dropdown name="Type" :values="types" @selected="typeChange" :defaultValue="selectedType" />
        <Search @search="search" />
      </section>
      <section class="main-section">
        <div class="loading" v-if="loading">Loading...</div>
        <div class="no-videos" v-else-if="videos.length === 0">No Videos</div>
        <section class="videos" v-else>
          <div class="video-show">
            <div class="video-player" v-if="activeVideo.iframe" v-html="activeVideo?.html"></div>
            <div v-else>
              <video controls @play="videoPlaying" @pause="videoPaused" :src="activeVideo.videoURL"></video>
              <audio controls ref="audioRef" :key="activeVideo.audioURL">
                <source :src="activeVideo.audioURL" />
                <source :src="activeVideo.backupAudioURL" />
              </audio>
            </div>
            <h3>{{activeVideo.title}}</h3>
            <a :href="activeVideo.link" target="blank" class="view-reddit">View on Reddit</a>
            <div class="buttons" v-if="videos.length > 2">
              <button :class="activeIdx === 0 && 'disabled'" @click="previous">Previous</button>
              <button :class="activeIdx === videos.length - 1 && 'disabled'" @click="next">Next</button>
              <button @click="random">Play Random Video</button>
            </div>
          </div>
        </section>
        <div class="list" v-if="!loading">
          <div
            class="thumbnail"
            v-for="(item, idx) in videos"
            :key="item.title"
            @click="videoChange(idx)"
          >
            <img :src="item.thumbnail_url" :alt="item.title" :class="!item.iframe && 'small'" />
            <h5>{{item.title}}</h5>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, defineAsyncComponent, computed } from "vue";
import { types } from "../samples/types";
import { subreddits } from "../samples/subs";
import { unescape } from "html-escaper";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Home",
  components: {
    Sidebar: defineAsyncComponent(() => import("./Sidebar.vue")),
    Dropdown: defineAsyncComponent(() => import("./Dropdown.vue")),
    Search: defineAsyncComponent(() => import("./Search.vue")),
  },
  setup() {
    const videos = ref([]);
    const loading = ref(false);
    const selected = ref(null);
    const defaultType = ref(types[0]);
    const selectedType = ref(types[0]);
    const activeIdx = ref(null);
    const audioRef = ref(null);
    const route = useRoute();
    const router = useRouter();

    const getUrl = (sub = "", type) => {
      return `https://api.reddit.com/r/${sub.replace("r/", "")}/${
        type.value
      }.json?limit=100${type.t ? `&t=${type.t}` : ""}`;
    };

    const changeSelected = (name) => {
      selected.value = name;
    };

    const getActiveVideoFormat = (items, idx) => {
      if (idx !== null) {
        if (items[idx].iframe) {
          return {
            ...items[idx],
            html: unescape(items[idx].html),
          };
        } else return items[idx];
      }
      return null;
    };

    const activeVideo = computed(() =>
      getActiveVideoFormat(videos.value, activeIdx.value)
    );

    const list = computed(() =>
      videos.value.filter((e, idx) => idx !== activeIdx.value)
    );

    const fetchVideos = async () => {
      try {
        loading.value = true;
        const url = getUrl(selected.value, selectedType.value);
        const dt = await fetch(url);
        const res = await dt.json();
        videos.value = res.data.children
          .map((e) => e.data)
          .filter((e) => e.media != null)
          .map((e) => {
            if (e.media.oembed) {
              return {
                iframe: true,
                ...e.media.oembed,
                title: e.title,
                link: `https://www.reddit.com${e.permalink}`,
                thumbnail_url: e.media.oembed.thumbnail_url || e.thumbnail,
              };
            } else {
              if (e.media.reddit_video) {
                const videoURL = e.media.reddit_video.fallback_url;
                return {
                  iframe: false,
                  videoURL,
                  audioURL:
                    videoURL.substr(0, videoURL.indexOf("DASH")) +
                    "DASH_audio.mp4",
                  backupAudioURL:
                    videoURL.substr(0, videoURL.indexOf("DASH")) + "audio",
                  title: e.title,
                  link: `https://www.reddit.com${e.permalink}`,
                  thumbnail_url: e.thumbnail,
                };
              }
            }
          });
        activeIdx.value = 0;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    watch([selected, selectedType], () => {
      fetchVideos();
    });

    watch(
      () => route.params,
      async (params) => {
        let sub = params.sub || subreddits[0];
        selected.value = sub;
      }
    );

    const typeChange = (item) => {
      selectedType.value = item;
    };

    const videoChange = (idx) => {
      activeIdx.value = idx;
    };

    // onMounted(fetchVideos);

    const videoPlaying = () => {
      audioRef.value.play();
    };

    const videoPaused = () => {
      audioRef.value.pause();
    };

    const previous = () => {
      activeIdx.value = activeIdx.value - 1;
    };

    const next = () => {
      activeIdx.value = activeIdx.value + 1;
    };

    const random = () => {
      activeIdx.value = Math.ceil(Math.random() * videos.value.length);
    };

    const search = (item) => {
      let sub = item.indexOf("r/") > -1 ? item : `r/${item}`;
      router.push("/" + sub);
    };

    return {
      selected,
      subreddits,
      types,
      videos,
      changeSelected,
      typeChange,
      selectedType,
      loading,
      activeVideo,
      list,
      videoChange,
      videoPlaying,
      audioRef,
      videoPaused,
      activeIdx,
      previous,
      next,
      random,
      search,
    };
  },
};
</script>

<style lang="scss">
.subreddits {
  display: flex;
  .subreddit {
    margin-right: 20px;
  }
}
</style>
