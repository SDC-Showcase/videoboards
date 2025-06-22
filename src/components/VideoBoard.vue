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

    // This method, onDragEnter, is called when a dragged card
    // enters the area of another card during a drag-and-drop operation.
    // hoverIdx - is the index of the card that is being hovered over.
    onDragEnter(hoverIdx) {
      if (
        this.draggedIndex === null ||       // If no card is being dragged
        this.draggedIndex === hoverIdx ||   // If the dragged card is over the same card
        hoverIdx < 0 ||                     // If the hover index is out of bounds
        hoverIdx >= this.cards.length       // If the hover index exceeds the number of cards
      ) return;

      // Move the dragged card to the new position
      // This is done by removing the card from its original position
      const moved = this.cards.splice(this.draggedIndex, 1)[0];
      this.cards.splice(hoverIdx, 0, moved);  // Insert it at the new position
      this.draggedIndex = hoverIdx;           // Update the dragged index to the new position
    },


    // This method is called when the drag-and-drop operation is completed.
    // It resets the dragged index and saves the current state of the cards.
    onDrop() {
      this.draggedIndex = null;
      this.saveCards();
    },

    // Generates a new GUID for each card
    // This is used to uniquely identify each card in the video wall.
    newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }).toUpperCase();
    },

    // Loads the cards from cookies when the component is mounted.
    // This allows the video wall to persist its state across page reloads.
    loadCards() {
      const cards = Cookies.get('videowall_' + this.name);
      if (cards) {
        this.cards = JSON.parse(cards);
      }
    },

    // Saves the current state of the cards to cookies.
    // This is called whenever a card is added, deleted, or moved.
    saveCards() {
      const jsonPosObj = JSON.stringify(this.cards);
      Cookies.set('videowall_' + this.name, jsonPosObj, { expires: 10000, path: '/' });
      return jsonPosObj;
    }
  },

  // When the component is mounted, it loads the cards from cookies.
  // This ensures that the video wall displays the previously saved state.
  mounted() {
    this.loadCards();
  }
};
</script>
