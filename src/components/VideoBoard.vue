<template>
  <div class="mt-4 tab-pane fade" :class="{ 'show active': isActive }" :id="'panel-' + name" role="tabpanel" :aria-labelledby="'nav-' + name">
    <div class="cards sortable-container"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <video-card
        v-for="(card, idx) in cards"
        :key="card.id"
        :id="card.id"
        :video-url="card.src"
        :index="idx"
        @delete="deleteCard"
        @dragstart="onDragStart(idx)"
        @dragend="onDragEnd"
        @dragenter="onDragEnter"
      />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import VideoCard from './VideoCard.vue';

export default {
  name: 'VideoBoard',
  components: {
    VideoCard
  },
  props: {
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:cards'],
  data() {
    return {
      cards: [],
      draggedIndex: null
    };
  },
  methods: {
    addCard(url) {
      const id = this.newGuid();
      this.cards.push({ id, src: url });
      this.saveCards();
    },
    deleteCard(id) {
      const index = this.cards.findIndex(card => card.id === id);
      if (index !== -1) {
        this.cards.splice(index, 1);
        this.saveCards();
      }
    },
    onDragStart(idx) {
      this.draggedIndex = idx;
    },
    onDragEnd() {
      this.draggedIndex = null;
      this.saveCards();
    },
    onDragEnter(hoverIdx) {
      if (
        this.draggedIndex === null ||
        this.draggedIndex === hoverIdx ||
        hoverIdx < 0 ||
        hoverIdx >= this.cards.length
      ) return;
      // Prevent duplicate moves
      const moved = this.cards.splice(this.draggedIndex, 1)[0];
      this.cards.splice(hoverIdx, 0, moved);
      this.draggedIndex = hoverIdx;
    },
    onDrop() {
      this.draggedIndex = null;
      this.saveCards();
    },
    newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }).toUpperCase();
    },
    loadCards() {
      const cards = Cookies.get('videowall_' + this.name);
      if (cards) {
        this.cards = JSON.parse(cards);
      }
    },
    saveCards() {
      const jsonPosObj = JSON.stringify(this.cards);
      Cookies.set('videowall_' + this.name, jsonPosObj, { expires: 400 });
      return jsonPosObj;
    }
  },
  mounted() {
    this.loadCards();
  }
};
</script>
