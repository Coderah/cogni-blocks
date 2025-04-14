<script lang="ts" setup>
import { useSingletonEntityComponent } from '../game/systems/vueSystem';

const isGameOver = useSingletonEntityComponent('isGameOver');
const didPlayerWin = useSingletonEntityComponent('didPlayerWin');
</script>

<template>
    <div v-if="isGameOver" class="game-over">
        <h1 v-if="didPlayerWin">YOU WON!</h1>
        <h1 v-else>Game Over</h1>
    </div>
</template>

<style scoped>
.game-over {
    position: absolute;
    inset: 0 0 0 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

h1 {
    font-family: 'Comic Sans';
    font-size: 5.5vw;
    color: white;
    text-align: center;
}
</style>
