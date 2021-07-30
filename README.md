# Vue Virtual Scroll Table

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
| items | Array  | yes | [] | Array of data |
| itemSize | Number  | no | 48 | Row size in pixels. This is used to calculate the sliding window of visible rows |
| preRenderSize | Number | no | 5 | Number of items to render outside of the sliding window (before and after) |

## Slots

In total there are five `v-slot`'s provided where the most relevant is the `v-slot:row`. Make sure that the rendered rows in this slot have the specified `itemSize`.

| Name | Base Tag | Description |
|-----|---|---|
| colgroup | `<colgroup>` | Slot to render the `colgroup` tag |
| header | `<thead>` | Slot to render the `thead` tag |
| before-rows | `<tr>` | Util slot to render the loading/empty data text |
| row | `<tr>` | Slot to render each table row. Note that this slot is executed for each visible row |
| footer | `<tfoot>` | Slot to render the `tfoot` tag |

The `v-slot:row` provides the following parameters:
* **item** - item for the current row (extracted from the input property `items`);
* **index** - index for the current item (based on the input property `items` length);
* **itemSize** - should be used to set the `<tr>` height;
* **windowStart** - starting index of input `items` based on the visible window;
* **windowEnd** - ending index of input `items` based on the visible window;


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
        <template v-slot:row="{
            item,
            index,
            itemSize,
            windowStart,
            windowEnd
        }">
            <tr 
                :key="`row-${item.id}`"
                :style="`height: {itemSize}px`"
            >
                <td v-for="(cell, j) in headers" :key="`cell-${item.id}-${i}`"> item[j] </td>
            </tr>
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