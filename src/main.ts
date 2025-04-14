import { createApp } from 'vue';
import './style.css';
import App from './app.vue';
import { gameplayPipeline } from './game/gameplayPipeline';
import { now } from './sprixle/util/now';
import { em } from './game/entityManager';
import { Direction } from './game/components';

const app = createApp(App);

app.mount('#app');

gameplayPipeline.init();

let time = now();
function tick() {
    const newTime = now();
    const delta = newTime - time;

    gameplayPipeline.tick(delta);

    em.tick();

    time = newTime;

    requestAnimationFrame(tick);
}

tick();

if (import.meta.hot) {
    import.meta.hot.accept();
}

document.addEventListener('keydown', function handleKeyDown(event) {
    // For single key presses, you can use event.key
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            em.quickEntity({
                isMoveSignal: true,
                moveDirection: Direction.UP,
            });
            break;
        case 'ArrowDown':
        case 's':
            em.quickEntity({
                isMoveSignal: true,
                moveDirection: Direction.DOWN,
            });
            break;
        case 'ArrowLeft':
        case 'a':
            em.quickEntity({
                isMoveSignal: true,
                moveDirection: Direction.LEFT,
            });
            break;
        case 'ArrowRight':
        case 'd':
            em.quickEntity({
                isMoveSignal: true,
                moveDirection: Direction.RIGHT,
            });
            break;
    }
});
