<script setup lang="ts">
import { shapeQuery } from '../game/queries';
import { useQuery } from '../game/systems/vueSystem';
import Shape from './shape.vue';

const shapeEntities = useQuery(shapeQuery);
</script>

<template>
    <Shape v-for="shape of shapeEntities" :entity="shape" />
</template>
