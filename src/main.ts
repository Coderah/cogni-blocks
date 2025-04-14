import { createApp } from 'vue';
import './style.css';
import App from './app.vue';
import { gameplayPipeline } from './game/gameplayPipeline';
import { now } from './sprixle/util/now';
import { em } from './game/entityManager';
import { hookKeyboard } from './keyboard';

hookKeyboard();

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
