<template>
  <!-- Table Wrapper -->
  <div ref="virtual_scroll_table" class="virtual-scroll-table-wrapper">
    <table class="virtual-scroll-table">
      <!-- Slot for colgroup -->
      <slot name="colgroup"></slot>

      <!-- Slot for header -->
      <slot name="header"></slot>

      <!-- body before content -->
      <tbody class="virtual-scroll-body-before">
        <tr class="virtual-scroll-row-before">
          <td colspan="100%" :style="`height: ${heightStart}px`"></td>
        </tr>
      </tbody>

      <!-- Content body -->
      <tbody>
        <!-- slot for rows -->
        <slot
          name="body"
          v-bind="{
            rowsWindow: rowsWindow,
            itemSize: itemSize,
            windowStart,
            windowEnd,
          }"
        ></slot>
      </tbody>

      <!-- body after content -->
      <tbody class="virtual-scroll-body-after">
        <tr class="virtual-scroll-row-after">
          <td colspan="100%" :style="`height: ${heightEnd}px`"></td>
        </tr>
      </tbody>

      <!-- Slot for table footer -->
      <slot name="footer"></slot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'vue-virtual-scroll-table',

  props: {
    rows: {
      type: Array,
      default: function () {
        return [];
      },
    },

    itemSize: {
      type: Number,
      default: 48,
    },

    preRenderSize: {
      type: Number,
      default: 5,
    },
  },

  data() {
    return {
      rowsWindow: [],

      windowStart: 0,
      windowEnd: 20,
      heightStart: 0,
      heightEnd: 0,

      lastScroll: 0,
    };
  },

  mounted: function () {
    const vst = this.$refs.virtual_scroll_table;

    vst.onscroll = () => {
      const scrollTop = vst.scrollTop || 0;

      // If the scroll is not vertical, defer...
      if (scrollTop === this.lastScroll) {
        return;
      }

      // Track last vertical scroll
      this.lastScroll = scrollTop;

      // recompute window
      this.computeWindow(scrollTop);
    };
  },

  updated: function () {
    this.computeWindow(this.$refs.virtual_scroll_table.scrollTop);

    this.$emit("updated");
  },

  methods: {
    computeWindow: function (position, force) {
      const { preRenderSize, itemSize, rows } = this;

      const vst = this.$refs.virtual_scroll_table;

      // Get the scroll component height
      const height = vst ? vst.clientHeight : itemSize * 10;

      const len = rows.length;

      // Compute the number of items for the window
      const window = Math.floor(height / itemSize);

      // Compute the start index for the slice
      const start = Math.max(
        Math.floor(position / itemSize) - preRenderSize,
        0
      );

      // Compute the end index for the slice
      const end = Math.min(start + window + preRenderSize * 2, len);

      // If the window didn't move, return unless we force the re-render
      if (this.windowStart === start && this.windowEnd === end && !force) {
        return;
      }

      // Update the slice in the next render
      this.$nextTick(function () {
        this.windowStart = start;
        this.windowEnd = end;

        this.heightStart = start * itemSize;
        this.heightEnd = (len - end) * itemSize;

        this.rowsWindow = start >= end ? [] : rows.slice(start, end);
      });
    },
  },

  watch: {
    rows: {
      handler: function (value) {
        const vst = this.$refs.virtual_scroll_table;

        const currScroll = vst ? vst.scrollTop : 0;

        // Force window refresh which time rows change
        this.computeWindow(currScroll, true);
      },
    },
  },
};
</script>
<style scoped>
.virtual-scroll-table-wrapper {
  width: 100%;
  display: block;
  height: inherit;
  overflow-y: scroll;
}

.virtual-scroll-table {
  width: 100%;
}
</style>