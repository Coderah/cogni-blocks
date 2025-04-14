import { Direction } from './game/components';
import { em } from './game/entityManager';

// use keyboard for debugging
export function hookKeyboard() {
    document.addEventListener('keydown', function handleKeyDown(event) {
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
}
