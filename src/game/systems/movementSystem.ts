import { gridSize } from '../../const';
import { interval } from '../../sprixle/util/timing';
import { areShapesOverlapping } from '../collision';
import { Direction, Shape } from '../components';
import { em } from '../entityManager';
import { isControlledQuery, moveSignalQuery, shapeQuery } from '../queries';

const directionPatches: {
    [key in Direction]: { x?: number; y?: number };
} = {
    [Direction.LEFT]: { x: -1 },
    [Direction.RIGHT]: { x: +1 },
    [Direction.UP]: { y: -1 },
    [Direction.DOWN]: { y: +1 },
};

export const movementSystem = em.createSystem({
    interval: interval(50),
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

        const newPosition = {
            x: position.x + (patch.x || 0),
            y: position.y + (patch.y || 0),
        };

        let isValidMove = false;

        if (controlledEntity.components.shape !== undefined) {
            // check collision if controlled entity is a shape

            isValidMove = !shapeQuery.find((otherEntity) => {
                if (otherEntity === controlledEntity) return false;

                return areShapesOverlapping(
                    // @ts-expect-error typescript doesn't understand the if condition in the context above this
                    controlledEntity.components.shape,
                    newPosition,
                    otherEntity.components.shape,
                    otherEntity.components.position
                );
            });
        } else {
            // must be a valid move if controlled entity is not a shape (just future proofing here)
            isValidMove = true;
        }

        if (isValidMove) {
            controlledEntity.components.position = newPosition;
        }

        em.deregisterEntity(move);

        gridSize;
    },
});
