<template>
  <div :id="id" :ref="id" class="card draggable" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd" @dragenter="onDragEnter" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <span class="delete_icon_span" @click="onDelete" @touchstart.stop>
      <img class="delete_icon" src="/images/delete.svg" alt="delete"/>
    </span>
    <span class="drag_icon_span" @contextmenu.prevent @touchstart="onDragIconTouchStart" @touchmove.prevent @touchend.prevent>
      <img class="drag_icon center-block drag_filter" src="/images/drag-svgrepo-com.svg" alt="drag" draggable="false"/>
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
      showFallback: false,
      touchStartY: 0,
      touchStartX: 0,
      isDragging: false,
      touchMoveThreshold: 10,
      dragClone: null,
      cardOffsetX: 0,
      cardOffsetY: 0
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
    },
    onDragIconTouchStart(e) {
      // Dedicated handler for drag icon - always initiates drag
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.isDragging = false;
    },
    onTouchStart(e) {
      // Don't start drag if touching delete button
      if (e.target.closest('.delete_icon_span')) {
        return;
      }

      // Skip if already handled by drag icon
      if (e.target.closest('.drag_icon_span')) {
        return;
      }

      // Only allow drag from card background (not video content)
      const isCardBackground = e.target.classList.contains('card');
      if (!isCardBackground) {
        return;
      }

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.isDragging = false;
    },
    onTouchMove(e) {
      if (!e.touches.length || this.touchStartX === 0) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);

      // Check if movement exceeds threshold to start dragging
      if (!this.isDragging && (deltaX > this.touchMoveThreshold || deltaY > this.touchMoveThreshold)) {
        this.isDragging = true;
        const card = this.$refs[this.id];
        if (card) {
          card.classList.add("dragging");

          // Create visual clone for drag feedback
          const rect = card.getBoundingClientRect();
          this.cardOffsetX = this.touchStartX - rect.left;
          this.cardOffsetY = this.touchStartY - rect.top;

          this.dragClone = card.cloneNode(true);
          this.dragClone.id = this.id + '-clone';
          this.dragClone.style.cssText = `
            position: fixed !important;
            width: ${rect.width}px !important;
            height: ${rect.height}px !important;
            left: ${touch.clientX - this.cardOffsetX}px !important;
            top: ${touch.clientY - this.cardOffsetY}px !important;
            opacity: 0.7 !important;
            pointer-events: none !important;
            z-index: 9999 !important;
            transform: scale(1.05) !important;
            transition: none !important;
            margin: 0 !important;
          `;
          // Remove any attributes that might interfere
          this.dragClone.removeAttribute('draggable');
          this.dragClone.removeAttribute('data-v-inspector');

          document.body.appendChild(this.dragClone);
          console.log('Drag clone created and appended to body');
        }
        this.$emit('dragstart', this.index);
      }

      if (this.isDragging) {
        e.preventDefault();
        e.stopPropagation();

        // Update clone position
        if (this.dragClone && this.dragClone.parentNode) {
          this.dragClone.style.setProperty('left', (touch.clientX - this.cardOffsetX) + 'px', 'important');
          this.dragClone.style.setProperty('top', (touch.clientY - this.cardOffsetY) + 'px', 'important');
        }

        // Find the element at the touch position
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        const cardAtPoint = elementAtPoint?.closest('.card');

        if (cardAtPoint) {
          const cardId = cardAtPoint.id;
          // Get the parent container and find all cards within it
          const container = cardAtPoint.parentElement;
          const allCards = Array.from(container.querySelectorAll('.card'));
          const targetIndex = allCards.indexOf(cardAtPoint);

          if (targetIndex !== -1 && cardId !== this.id) {
            this.$emit('dragenter', targetIndex);
          }
        }
      }
    },
    onTouchEnd(e) {
      if (this.isDragging) {
        const card = this.$refs[this.id];
        if (card) {
          card.classList.remove("dragging");
        }

        // Remove drag clone
        if (this.dragClone && this.dragClone.parentNode) {
          this.dragClone.parentNode.removeChild(this.dragClone);
          this.dragClone = null;
        }

        this.$emit('dragend');
        this.isDragging = false;
      }
      this.touchStartX = 0;
      this.touchStartY = 0;
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
