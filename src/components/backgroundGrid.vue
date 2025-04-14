<template>
    <div class="background"></div>
</template>

<style scoped>
.background {
    width: 90vw;
    height: 90vw;

    margin: 0;
    overflow: hidden;
    background-color: #222;
    background-image: linear-gradient(to right, #444 1px, transparent 1px),
        linear-gradient(to bottom, #444 1px, transparent 1px);
    background-size: calc(90vw / var(--grid-size)) calc(90vw / var(--grid-size));
    background-repeat: repeat;
}

/* Handle cases where height is the limiting factor */
@media (orientation: landscape) and (max-height: 90vw) {
    .background {
        width: 90vh;
        height: 90vh;

        background-size: calc(90vh / var(--grid-size))
            calc(90vh / var(--grid-size));
    }
}
</style>
