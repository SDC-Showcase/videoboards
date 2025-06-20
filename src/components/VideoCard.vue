<template>
  <div :id="id" class="card draggable" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd" @dragenter="onDragEnter">
    <span class="delete_icon_span" @click="onDelete">
      <img class="delete_icon" src="/images/delete.svg" alt="delete"/>
    </span>
    <span class="drag_icon_span">
      <img class="drag_icon center-block drag_filter" src="/images/drag-svgrepo-com.svg" alt="drag"/>
    </span>
    <iframe
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
    }
  },
  emits: ['delete', 'dragstart', 'dragend', 'dragenter'],
  methods: {
    onDelete() {
      this.$emit('delete', this.id);
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
  }
};
</script>
