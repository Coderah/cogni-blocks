import { gridSize } from '../../const';
import { interval } from '../../sprixle/util/timing';
import { areShapesOverlapping } from '../collision';
import { Direction, Shape, shapeGrids } from '../components';
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

        const { position, shape } = controlledEntity.components;

        const shapeGrid = shape !== undefined ? shapeGrids[shape] : undefined;
        const width = shapeGrid ? shapeGrid[0].length : 0;
        const height = shapeGrid ? shapeGrid.length : 0;

        const newPosition = {
            x: Math.min(
                Math.max(0, position.x + (patch.x || 0)),
                gridSize - width
            ),
            y: Math.min(
                Math.max(0, position.y + (patch.y || 0)),
                gridSize - height
            ),
        };

        let isValidMove = false;

        if (shape !== undefined) {
            // check collision if controlled entity is a shape

            isValidMove = !shapeQuery.find((otherEntity) => {
                if (otherEntity === controlledEntity) return false;

                return areShapesOverlapping(
                    shape,
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
    },
});
