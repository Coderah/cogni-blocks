<script setup lang="ts">
import AllShapes from './components/allShapes.vue';
import BackgroundGrid from './components/backgroundGrid.vue';
import RealtimeAudioInput from './components/realtimeAudioInput.vue';
</script>

<template>
    <RealtimeAudioInput />

    <div class="game-wrapper">
        <BackgroundGrid />
        <AllShapes />
    </div>
</template>

<style scoped>
.game-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translateX(-50%) translateY(-50%);
}
</style>
