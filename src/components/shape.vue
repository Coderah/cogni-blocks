<script lang="ts" setup>
import { ComputedRef } from 'vue';
import { Shape, shapeGrids } from '../game/components';
import { shapeQuery } from '../game/queries';

const { entity } = defineProps<{
    entity: ComputedRef<typeof shapeQuery.Entity>;
}>();
</script>

<template>
    <div
        :class="{
            'grid-container': true,
            [Shape[entity.value.components.shape].toLowerCase()]: true,
        }"
        :style="{
            '--col-count':
                shapeGrids[entity.value.components.shape][0].length || 1,
            '--row-count':
                shapeGrids[entity.value.components.shape].length || 1,
            '--x': entity.value.components.position.x,
            '--y': entity.value.components.position.y,
        }"
    >
        <div
            v-for="(row, rowIndex) in shapeGrids[entity.value.components.shape]"
            :key="rowIndex"
            class="grid-row"
        >
            <div
                v-for="(value, colIndex) in row"
                :key="colIndex"
                class="grid-item"
                :class="{ 'empty-cell': value === 0 }"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.grid-container {
    --slot-size: calc(90vw / var(--grid-size));

    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(calc(var(--x) * var(--slot-size)))
        translateY(calc(var(--y) * var(--slot-size)));

    transition: 0.25s linear transform;
}

.grid-row {
    display: flex;
    width: calc(var(--slot-size) * var(--col-count));
    height: var(--slot-size);
}

.grid-item {
    box-sizing: border-box;
    background-color: lightgray;
    border: 1px solid #444; /* Optional: for visualization */
    font-size: 0.8em; /* Optional: for displaying values */
    height: 100%;
    width: var(--slot-size);
}

.ball .grid-item {
    background-color: teal;
}

.wall .grid-item {
    background-color: darkgreen;
}

.glove .grid-item {
    background-color: orange;
}

.empty-cell {
    background-color: transparent !important;
    border: none;
}

@media (orientation: landscape) and (max-height: 90vw) {
    .grid-container {
        --slot-size: calc(90vh / var(--grid-size));
    }
}
</style>
