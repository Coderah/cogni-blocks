import { gridSize } from '../../const';
import { interval } from '../../sprixle/util/timing';
import { Direction, Shape } from '../components';
import { em } from '../entityManager';
import { isControlledQuery, moveSignalQuery, shapeQuery } from '../queries';

const directionPatches: {
    [key in Direction]: { x: number } | { y: number };
} = {
    [Direction.LEFT]: { x: -1 },
    [Direction.RIGHT]: { x: +1 },
    [Direction.UP]: { y: -1 },
    [Direction.DOWN]: { y: +1 },
};

export const movementSystem = em.createSystem({
    interval: interval(250),
    tick() {
        const move = moveSignalQuery.first();

        if (!move) return;

        const controlledEntity = isControlledQuery.first();
        if (!controlledEntity) {
            throw new Error(
                'Unable to apply moveSignal because no controlled entity exists.'
            );
        }

        const { moveDirection } = move.components;

        const patch = directionPatches[moveDirection];

        const { position } = controlledEntity.components;

        controlledEntity.components.position = {
            x: position.x + (patch.x || 0),
            y: position.y + (patch.y || 0),
        };
        console.log(
            controlledEntity.components.position,
            controlledEntity.previousComponents.position
        );

        controlledEntity.flagUpdate('position');

        em.deregisterEntity(move);

        gridSize;
    },
});
