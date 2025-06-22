<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Videoboards</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav" aria-controls="navbarNav"
            aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" @click.prevent="showAddBoardModal" href="#">Add Board</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="showAddVideoModal" href="#">Add Video</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="importBoard" href="#">Import Board</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="exportBoard" href="#">Export Board</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="deleteBoard" href="#">Remove Board</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click.prevent="exportAllBoards" href="#">Export All Boards</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="row">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            v-for="(board, idx) in boards"
            :key="board.name"
            class="nav-link"
            :class="{ active: currentTab === board.name }"
            :id="'nav-' + board.name"
            :data-name="board.name"
            data-bs-toggle="tab"
            :data-bs-target="'#panel-' + board.name"
            type="button"
            role="tab"
            @click="activateTab(board.name)"
            draggable="true"
            @dragstart="onTabDragStart(idx)"
            @dragover.prevent
            @drop="onTabDrop(idx)"
          >{{ board.name }}</button>
        </div>
      </nav>

      <div class="tab-content" id="nav-tabContent">
        <video-board
          v-for="board in boards"
          :key="board.name"
          :name="board.name"
          :is-active="currentTab === board.name"
          :ref="'board_' + board.name"
        />
      </div>
    </div>

    <!-- Add Board Modal -->
    <div class="modal" ref="boardModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Add Board</h4>
            <button type="button" class="btn-close" @click="hideBoardModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewBoard">
              <div class="mb-3">
                <label for="board-name" class="col-form-label">Board Name:</label>
                <input type="text" class="form-control" id="board-name" v-model="newBoardName">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="addNewBoard">OK</button>
            <button type="button" class="btn btn-danger" @click="hideBoardModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Video Modal -->
    <div class="modal" ref="videoModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Video URL</h4>
            <button type="button" class="btn-close" @click="hideVideoModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewVideo">
              <div class="mb-3">
                <label for="video-url" class="col-form-label">Video URL:</label>
                <input type="text" class="form-control" id="video-url" v-model="newVideoUrl">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="addNewVideo">OK</button>
            <button type="button" class="btn btn-danger" @click="hideVideoModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import VideoBoard from './components/VideoBoard.vue';

const TAB_ORDER_COOKIE = 'videowall_tab_order';

export default {
  name: 'App',
  components: {
    VideoBoard
  },
  data() {
    return {
      currentTab: '',
      boards: [],
      newBoardName: '',
      newVideoUrl: '',
      boardModal: null,
      videoModal: null,
      draggedTabIndex: null,
    };
  },
  methods: {

    loadTabs() {

      // Load existing tabs from cookies
      // Cookies are used to persist the state of the video boards across sessions
      const cookies = Object.keys(Cookies.get());

      // Check if the tab order cookie exists
      // If it does, parse it to get the order of tabs
      let tabOrder = Cookies.get(TAB_ORDER_COOKIE);
      let tabNames = [];
      if (tabOrder) {
        tabNames = JSON.parse(tabOrder);
      } else {
        // fallback: get all tab names from cookies
        // This will get all cookies that start with 'videowall_'
        // and extract the names after the prefix
        // This is useful for legacy support or if the tab order cookie is not set
        // It will sort the tab names alphabetically
        tabNames = cookies
          .filter(cookie => cookie.startsWith('videowall_'))
          .map(cookie => cookie.split(/_(.*)/s)[1])
          .sort();
      }
      this.boards = [];
      tabNames.forEach(name => {
        if (name && cookies.includes('videowall_' + name)) {
          this.boards.push({ name });
        }
      });

      // if boards are loaded, set the current tab to the first one
      if (this.boards.length > 0) {
        this.currentTab = this.boards[0].name;
      }
    },

    // Save the order of tabs to a cookie
    saveTabOrder() {
      const order = this.boards.map(b => b.name);
      Cookies.set(TAB_ORDER_COOKIE, JSON.stringify(order), { expires: 10000, path: '/' });
    },

    // Add a new board
    // If the name is not provided, use the newBoardName data property
    addNewBoard(name, saveState = true) {
      if (typeof name === 'object') {
        name = this.newBoardName;
      }

      // Replace spaces with underscores and trim the name
      name = name.trim().replace(/\s+/g, '_');
      if (this.boards.some(board => board.name === name)) {
        swal("Already Exists", "A tab with this name already exists", "error");
        return false;
      }
      this.boards.push({ name });
      this.activateTab(name);
      this.saveTabOrder();
      if (saveState) {
        this.hideBoardModal();
        this.newBoardName = '';
      }
      return true;
    },

    // Delete the current board
    // It will prompt the user for confirmation before deleting
    deleteBoard() {
      if (!this.currentTab) return;
      swal({
        title: "Are you sure?",
        text: "Delete this tab and its contents?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          const index = this.boards.findIndex(board => board.name === this.currentTab);
          if (index !== -1) {
            this.boards.splice(index, 1);
            Cookies.remove('videowall_' + this.currentTab, { path: '/' });
            this.saveTabOrder();
            this.currentTab = this.boards[0]?.name || '';
          }
        }
      });
    },

    activateTab(name) {
      this.currentTab = name;
    },

    showAddBoardModal() {
      this.boardModal.show();
      this.$nextTick(() => {
        const input = document.getElementById('board-name');
        if (input) input.focus();
      });
    },

    hideBoardModal() {
      this.boardModal.hide();
    },

    showAddVideoModal() {
      if (!this.currentTab) {
        swal("Add a Board", "Please add a board first", "error");
        return;
      }
      this.videoModal.show();
      this.$nextTick(() => {
        const input = document.getElementById('video-url');
        if (input) input.focus();
      });
    },

    hideVideoModal() {
      this.videoModal.hide();
    },

    addNewVideo() {
      if (!this.currentTab) return;

      let url = this.newVideoUrl;
      let itemText = url.replace('https://youtu.be/', '');
      itemText = itemText.replace('https://www.youtube.com/live/', '');

      const src = "https://www.youtube.com/embed/" + itemText;

      // Use ref to call addCard on the correct board
      const refName = 'board_' + this.currentTab;
      const boardComp = this.$refs[refName];
      if (boardComp && boardComp[0] && typeof boardComp[0].addCard === 'function') {
        boardComp[0].addCard(src);
      }

      this.hideVideoModal();
      this.newVideoUrl = '';
    },

    /**
     * Exports the current board as a text string.
     * The format is: "boardName|[card1, card2, ...]"
     * where each card is saved in JSON format.
     */
    exportBoard() {
      // Use the same ref logic as addNewVideo
      const refName = 'board_' + this.currentTab;
      const boardComp = this.$refs[refName];
      if (boardComp && boardComp[0] && typeof boardComp[0].saveCards === 'function') {
        const board = boardComp[0].saveCards();
        const exportText = this.currentTab + '|' + board;
        swal("Export: Copy & paste this text for another person to import", exportText, "success");
      }
    },

    /**
     * Exports all boards as a single text string.
     * Each board's name and its cards are concatenated with a pipe '|'.
     * The cards are saved in JSON format.
     */
    exportAllBoards() {
      let boardData = this.boards.map(board => {
        const refName = 'board_' + board.name;
        const boardComp = this.$refs[refName];
        if (boardComp && boardComp[0] && typeof boardComp[0].saveCards === 'function') {
          return board.name + '|' + boardComp[0].saveCards();
        }
        return '';
      }).join('');
      swal("Export: Copy & paste this text for another person to import", boardData, "success");
    },

    /**
     * Imports a board from a previously exported text string.
     * The text should be in the format: "boardName|[card1, card2, ...]"
     * where each card is saved in JSON format.
     */
    importBoard() {
      swal({
        text: "Paste previously exported text into this box to create a new video board",
        content: "input",
      })
      .then(text => {
        if (!text) throw null;
        // Parse all boards and cards first
        let i = 0;
        const boardsToAdd = [];
        while (i < text.length) {
          const pipe = text.indexOf('|', i);
          if (pipe === -1) break;
          const boardName = text.substring(i, pipe);
          if (text[pipe + 1] !== '[') break;
          let arrStart = pipe + 1;
          let arrEnd = arrStart + 1;
          let depth = 1;
          while (arrEnd < text.length && depth > 0) {
            if (text[arrEnd] === '[') depth++;
            if (text[arrEnd] === ']') depth--;
            arrEnd++;
          }
          const boardText = text.substring(arrStart, arrEnd);
          let cards = [];
          try {
            cards = JSON.parse(boardText);
          } catch (e) {}
          boardsToAdd.push({ boardName, cards });
          i = arrEnd;
        }
        // Add all boards first
        boardsToAdd.forEach(({ boardName }) => {
          this.addNewBoard(boardName);
        });
        // After DOM updates, add cards to each board and set currentTab
        this.$nextTick(() => {
          if (boardsToAdd.length > 0) {
            this.currentTab = boardsToAdd[0].boardName;
          }
          boardsToAdd.forEach(({ boardName, cards }) => {
            const refName = 'board_' + boardName;
            const boardComp = this.$refs[refName];
            if (boardComp && boardComp[0]) {
              if (typeof boardComp[0].addCard === 'function') {
                cards.forEach(card => boardComp[0].addCard(card.src));
              }
              if (typeof boardComp[0].loadCards === 'function') {
                boardComp[0].loadCards();
              }
            }
          });
        });
      });
    },

    onTabDragStart(idx) {
      this.draggedTabIndex = idx;
    },

    onTabDrop(idx) {
      if (this.draggedTabIndex === null || this.draggedTabIndex === idx) return;
      const moved = this.boards.splice(this.draggedTabIndex, 1)[0];
      this.boards.splice(idx, 0, moved);
      this.draggedTabIndex = null;
      this.saveTabOrder();
    },
  },

  mounted() {
    this.loadTabs();
    this.$nextTick(() => {
      this.boardModal = new Modal(this.$refs.boardModal);
      this.videoModal = new Modal(this.$refs.videoModal);
    });
  },


  // Watch for changes in the current tab
  // When the tab changes, save the current board's cards to cookies
  watch: {
    currentTab(newVal, oldVal) {
      if (newVal !== oldVal && oldVal) {
        const refName = 'board_' + oldVal;
        const boardComp = this.$refs[refName];
        if (boardComp && boardComp[0] && typeof boardComp[0].saveCards === 'function') {
          boardComp[0].saveCards();
        }
      }
    }
  }
};
</script>

<style>
.container-fluid {
  padding: 0;
}

.navbar {
  padding: 0.5rem 1rem;
}

.nav-link {
  cursor: pointer;
}

.tab-content {
  border-top: 1px solid #dee2e6;
  padding: 1rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
}

.btn-close {
  padding: 0.5rem 1rem;
}
</style>
