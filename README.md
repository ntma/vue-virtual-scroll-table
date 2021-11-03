# WIP: Vue Virtual Scroll Table

**Warning** This project is still in a experimental stage.

Vue template component that applies a sliding window to only render visible rows.

This project was inspired by [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) and [vue-auto-virtual-scroll-list](https://github.com/cristovao-trevisan/vue-auto-virtual-scroll-list). 

## Index

* [How it works](#how-it-works)
* [Properties](#properties)
* [Slots](#slots)
* [Example](#example)

## How it works
Given a fixed row size and the table height, this component calculates the starting and ending index of an array of rows to render (a sliding window). The position of the window is adjusted accordingly to the scroll position.

**Important** Note that this component **does not render the main content of the table**. The main and only purpose is to provide the necessary tool to manage the position and size of the sliding window. The main content can be rendered with the slots described in the section [Slots](#slots).

## Properties
| Name | Type | Required | Default | Description |
|-----|---|---|---|---|
| rows | Array  | yes | [] | Array of data |
| rowSize | Number  | no | 48 | Row size in pixels. This is used to calculate the sliding window of visible rows |
| preRenderSize | Number | no | 5 | Number of items to render outside of the sliding window (before and after) |

## Slots

In total there are five `v-slot`'s provided where the most relevant is the `v-slot:row`. Make sure that the rendered rows in this slot have the specified `itemSize`.

| Name | Base Tag | Description |
|-----|---|---|
| colgroup | `<colgroup>` | Slot to render the `colgroup` tag |
| header | `<thead>` | Slot to render the `thead` tag |
| body | `<tr>` | Slot to render each table row |
| footer | `<tfoot>` | Slot to render the `tfoot` tag |

The `v-slot:row` provides the following parameters:
* **rowSize** - should be used to set the `<tr>` height;
* **windowStart** - starting index of the rendered window;
* **windowActiveStart** - starting index of the visible window;
* **windowEnd** - ending index of the rendered window;
* **windowActiveEnd** - ending index of the visibile window;


## Example
```vue
<template>
    <vue-virtual-scroll-table
        :itemSize="64"
        :preRenderSize="5"
        :items="items"
    >
        <!-- Slot to render colgroup -->
        <template v-slot:colgroup></template>

        <!-- Slot to render header -->
        <template v-slot:header>
            <thead>
                <tr>
                    <th v-for="(cell, j) in headers" :key="`cell-${i}`"> cell </th>
                </tr>
            </thead>

        </template>

        <!-- Slot to render rows -->
        <template v-slot:body="{
            itemSize,
            windowStart,
            windowEnd,
            windowSize,
        }">
            <template v-for="idx in windowSize">
                <tr 
                    :key="`row-${items[windowStart + idx].id}`"
                    :style="`height: {itemSize}px`"
                >
                    <td 
                        v-for="(cell, j) in headers"
                        :key="`cell-${items[windowStart + idx].id}-${j}`"
                    >
                        {{items[windowStart + idx][j] }}
                    </td>
                </tr>
            </template>
        </template>
    </vue-virtual-scroll-table>
</template>
<script>
export default {
    data(){
        return {
            headers: [],
            items: [],
        }
    },

    beforeCreate: function(){
        this.headers = ['id', 'h1', 'h2', 'h3'];
        this.items = new Array(1000).fill({}).map((r,i) => {
            return {
                "id": i,
                "h1": Math.random().toString(36).substring(7);,
                "h2": Math.random() * 2 + 1,
                "h3": new Date(
                    start.getTime() + Math.random() * (Math.random() * 6 + 1)
                ),
            }
        })
    }
}
</script>

```