<template>
  <div :id="id" :ref="id" class="card draggable" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd" @dragenter="onDragEnter">
    <span class="delete_icon_span" @click="onDelete">
      <img class="delete_icon" src="/images/delete.svg" alt="delete"/>
    </span>
    <span class="drag_icon_span">
      <img class="drag_icon center-block drag_filter" src="/images/drag-svgrepo-com.svg" alt="drag"/>
    </span>
    <div v-if="!isLoaded && shouldLoad" class="video_thumbnail" @click="loadVideo">
      <img v-if="!showFallback" :src="thumbnailUrl" :alt="'Video thumbnail'" class="thumbnail_image" @error="onThumbnailError" />
      <div v-else class="thumbnail_fallback">
        <div class="fallback_content">
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="44" cy="44" r="44" fill="#282828"/>
            <path d="M66.52,29.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,22.13,44,22,44,22s-11.79,0.13-17.1,1.55c-2.93,0.78-4.64,3.26-5.42,6.19C20.06,35.05,20,44,20,44s0.06,8.95,1.48,14.26c0.78,2.93,2.49,5.41,5.42,6.19C32.21,65.87,44,66,44,66s11.79-0.13,17.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,52.95,68,44,68,44S67.94,35.05,66.52,29.74z" fill="#f00"/>
            <path d="M54,44 L38,34 L38,54 Z" fill="#fff"/>
          </svg>
          <div class="fallback_text">Click to load video</div>
        </div>
      </div>
      <div class="play_overlay">
        <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"/>
          <path d="M 45,24 27,14 27,34" fill="#fff"/>
        </svg>
      </div>
    </div>
    <iframe
      v-else-if="isLoaded && shouldLoad"
      class="video_iframe"
      :src="videoUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'VideoCard',
  props: {
    id: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: false
    },
    shouldLoad: {
      type: Boolean,
      default: true
    }
  },
  emits: ['delete', 'dragstart', 'dragend', 'dragenter'],
  data() {
    return {
      isLoaded: false,
      thumbnailQuality: 'maxresdefault',
      showFallback: false
    };
  },
  computed: {
    videoId() {
      // Match video ID from various YouTube URL formats
      const embedMatch = this.videoUrl.match(/embed\/([^?&#]+)/);
      if (embedMatch) return embedMatch[1];

      const watchMatch = this.videoUrl.match(/[?&]v=([^?&#]+)/);
      if (watchMatch) return watchMatch[1];

      const shortMatch = this.videoUrl.match(/youtu\.be\/([^?&#]+)/);
      if (shortMatch) return shortMatch[1];

      return null;
    },
    thumbnailUrl() {
      if (this.videoId) {
        return `https://img.youtube.com/vi/${this.videoId}/${this.thumbnailQuality}.jpg`;
      }
      return '';
    }
  },
  methods: {
    onThumbnailError(event) {
      // Fallback chain: maxresdefault -> sddefault -> hqdefault -> mqdefault -> default -> 0
      const qualityFallback = {
        'maxresdefault': 'sddefault',
        'sddefault': 'hqdefault',
        'hqdefault': 'mqdefault',
        'mqdefault': 'default',
        'default': '0'
      };

      if (qualityFallback[this.thumbnailQuality]) {
        this.thumbnailQuality = qualityFallback[this.thumbnailQuality];
      } else {
        // If all fallbacks fail, show custom fallback UI
        this.showFallback = true;
      }
    },
    loadVideo() {
      this.isLoaded = true;
    },
    onDelete() {
      swal({
        title: "Are you sure?",
        text: "Delete this video card?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$emit('delete', this.id);
        }
    });
    },
    onDragStart(e) {
      setTimeout(() => e.target.classList.add("dragging"), 0);
      this.$emit('dragstart', this.index);
    },
    onDragEnd(e) {
      e.target.classList.remove("dragging");
      this.$emit('dragend');
    },
    onDragEnter(e) {
      this.$emit('dragenter', this.index);
    }
  },
  watch: {
    shouldLoad(newVal) {
      if (!newVal) {
        this.isLoaded = false;
      }
    }
  }
};
</script>
