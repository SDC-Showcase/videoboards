# VideoBoards


## Updates

### V2.40 - 2026-01-03
**Mobile Touch Drag-and-Drop Support**
- Full touch drag-and-drop functionality for mobile devices
- Visual feedback with semi-transparent clone following finger during drag
- Touch-action CSS prevents page scrolling during drag operations
- Dedicated touch handlers for drag icon with proper event management
- Improved z-index layering for delete and drag icons
- Enhanced mobile user experience matching desktop drag-and-drop

### V2.30 - 2026-01-03
**Enhanced Tab Navigation**
- Smart tab ordering - most recently accessed tabs appear first in visible tab list
- Improved UX - clicking visible tabs activates without reordering
- Only clicking tabs from "All Boards" dropdown adds them to front of visible list
- Maintains stable tab positions for better navigation experience

### V2.20 - 2026-01-03
**Smart Tab Navigation**
- Hybrid tab navigation system for managing many boards
- Shows 5 most recently accessed tabs as quick-access buttons
- "All Boards" dropdown menu provides access to complete board list
- Recent tabs tracked and persisted across sessions
- Eliminates tab clutter while maintaining easy access to all boards

### V2.10 - 2026-01-03
**Performance & Resource Optimization**
- Implemented lazy loading for video thumbnails - only active tab loads iframes
- Videos display as clickable YouTube thumbnails until loaded
- Significant reduction in browser resource usage and memory consumption
- Multi-tier thumbnail fallback system (maxresdefault → sddefault → hqdefault → mqdefault → default → 0.jpg)
- Custom fallback UI for videos without available thumbnails
- Active tab now persists across page reloads
- Improved URL parsing to support various YouTube URL formats (embed, watch, short links)

### V2.00 - 2025-02-07
- Now using localstorage instead of cookies



VideoBoards is a web application for creating and managing video walls. It allows you to organize multiple video streams or links into customizable boards, making it easy to display and control several videos at once.

## Features
- Add, remove, and arrange video cards on a board
- Save and load different video wall configurations
- Simple drag-and-drop interface
- Responsive design for various screen sizes
- Lazy loading thumbnails for optimal performance
- Smart hybrid tab navigation - recent tabs + dropdown for all boards
- Tab-based organization with persistent active tab state
- Import/Export board configurations

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/SDC-Showcase/videoboards.git
   cd videoboards
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Development
To start the app in development mode with hot reloading:
```sh
npm run dev
```
The app will be available at the URL shown in your terminal (usually http://localhost:5173).

### Production Build
To build the app for production:
```sh
npm run build
```
The production-ready files will be in the `dist` folder. You can deploy these files to any static web server.

To preview the production build locally:
```sh
npm run preview
```

## Project Structure
- `src/` - Main source code (Vue components, main.js, etc.)
- `index.html` - Main HTML entry point
- `vite.config.js` - Vite configuration
- `dist/` - Production build output (after running `npm run build`)

## License
See the LICENSE file for details.


## Demo
A demo of this app is available to use at https://videoboards.dallasdesign.uk/

Usage
- Create a board (Add Board)
- Add a video to the current board (Add Video)
     In Youtube click on share for the selected video. Copy the share link to your clipboard.
     Paste the link into the 'Add Video' popup window and click OK.

Here is an example of some saved boards/videos:

Laravel|[{"id":"5B636842-DBDC-4AC5-9654-71CCEEC27DEC","src":"https://www.youtube.com/embed/iniIUcAKuLA?si=SrngexA-lEqQ7Xid"},{"id":"0F61B141-365D-43CE-8A94-B91EEE6BE754","src":"https://www.youtube.com/embed/-QsyWzabRVc?si=lNBb7wbDePpNGZWy"},{"id":"F3845B63-365D-45BA-8C10-72F2714EE037","src":"https://www.youtube.com/embed/-kR_6zDHR2M?si=vtg4Rq8FnvfFPzKJ"},{"id":"1B521C75-A804-4CFE-83EE-B4E7F019A80D","src":"https://www.youtube.com/embed/9kL1RdMywGo?si=uKNGdWdxRxUNPxSb"},{"id":"60909891-091C-45C3-BBD0-FA244BFD4E6C","src":"https://www.youtube.com/embed/hZRS0NMjQUI?si=7orKrYtcFQPb3gnD"},{"id":"ACC9F3C8-B073-49A7-B401-549773902121","src":"https://www.youtube.com/embed/TNcBZNagXmM?si=vXyBGpw9bXOdRKeg"}]VUE|[{"id":"6EE9A33C-8E05-4ADE-8CE2-4B74C8523F0D","src":"https://www.youtube.com/embed/YrxBCBibVo0?si=xev1SCh4KKQz8b5X"},{"id":"120F2F64-AFAD-47C8-A1FE-60339E6B3CCE","src":"https://www.youtube.com/embed/YrxBCBibVo0?si=DJI8mOkmRsqxTu_2"},{"id":"D141B0FE-E80B-422F-BBE8-F94DFF786A49","src":"https://www.youtube.com/embed/CYPZBK8zUik?si=_tfBNodptIcZDmvR"}]PHPUnit_Testing|[{"id":"0B0A5ACA-B57C-48A1-939F-8F1C91145178","src":"https://www.youtube.com/embed/9-X_b_fxmRM?si=XqfqPGij_-M1Yzch"},{"id":"956131A0-F7A6-4375-8911-858EA03896D7","src":"https://www.youtube.com/embed/EhkeoV8nfCQ?si=xZBMn7N5rvB9q40V"}]TDD|[{"id":"4CA2F379-103C-47DC-859C-FD476B72F260","src":"https://www.youtube.com/embed/llaUBH5oayw?si=KM0fZfnXR36W9sBx"}]Design_Patterns|[{"id":"EE6F6B7A-551D-4A99-9203-4E9004618AA8","src":"https://www.youtube.com/embed/_BpmfnqjgzQ?si=2GvALgFp8dr4LLkB"},{"id":"3F2F7C1C-4EA3-4810-AF2A-570C0F30A0E6","src":"https://www.youtube.com/embed/v9ejT8FO-7I?si=QKZC5uA96c_1qFk6"},{"id":"85461279-AD97-431A-93C2-456611581F97","src":"https://www.youtube.com/embed/GCraGHx6gso?si=aH8FDjJoiJKGHqVO"},{"id":"BF7D7496-06F3-4AE4-92DD-5F0CEEC727BC","src":"https://www.youtube.com/embed/EcFVTgRHJLM?si=q7EBJivkGi12iAWX"},{"id":"B8A7F62C-2DF8-4809-8AF1-5F593EC3B381","src":"https://www.youtube.com/embed/v-GiuMmsXj4?si=pGiC7JmKf5Yaz17I"}]AI|[{"id":"A05E7213-3A86-45C5-A79A-3AD909CE8463","src":"https://www.youtube.com/embed/fJSX8wWIDO8?si=cFnZyXSAasO25Lq-"},{"id":"9D389379-4E4E-4777-A601-327759127F67","src":"https://www.youtube.com/embed/yqq_U2fxd2U?si=GymBKUcShZs09FGX"},{"id":"0B530F2D-768E-4C12-AF7D-FBA74C5A45FE","src":"https://www.youtube.com/embed/cOInknskPlg?si=Yv6FIMDAU740htel"},{"id":"1FADAC8F-9BE2-4C98-BFE9-50B1C4C296F0","src":"https://www.youtube.com/embed/KUnlpNftzXo?si=-SyQI7qI6bFTtK5e"},{"id":"9BE6BFFD-6EA5-4BB4-B0B1-2C3F07024BE7","src":"https://www.youtube.com/embed/xIKy5LXoYAM?si=UVBSAqj6q8Hnibgv"},{"id":"1891613A-8F2D-46AD-A05B-97080383F290","src":"https://www.youtube.com/embed/hw6oTjw9_Ro?si=sVnXl3adhD5-2RsD"},{"id":"A6A1AB24-0425-484E-BC15-AF3701930C03","src":"https://www.youtube.com/embed/w4ERVqyMNcI?si=FdBAjbowoJjaMY_n"},{"id":"4C5C12DA-8F96-44A2-A77D-66935DDFED7B","src":"https://www.youtube.com/embed/rIRkxZSn-A8?si=-KdxG_Ay2z-R7GEl"},{"id":"54C1EC78-87DF-4A30-8468-567138D962AA","src":"https://www.youtube.com/embed/16fWf0VVeIo?si=7JOhe70mh9RdA99g"},{"id":"6503D46B-B9DC-44DE-BB25-C9572F76552A","src":"https://www.youtube.com/embed/cdAb5CigAgQ?si=7Z6_9tfK3qfbOkfD"}]


Copy and paste the text block above into the 'Import Boards' popup window.









