import VueVirtualScrollTable from "./src/vue-virtual-scroll-table"

function install(Vue, options) {
    Vue.component('vue-virtual-scroll-table', VueVirtualScrollTable)
}

export default {
    install: install
}