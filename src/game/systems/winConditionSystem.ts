import { Shape } from '../components';
import { em } from '../entityManager';
import { shapeQuery } from '../queries';

function randomizeSpawnLocation(atLeast: number, randomization = 10) {
    return Math.floor(atLeast + Math.random() * randomization);
}

const consumer = shapeQuery.createConsumer();
export const winConditionSystem = em.createSystem({
    init() {
        console.log('setup win condition');
        em.setSingletonEntityComponent('isGameOver', false);
        em.setSingletonEntityComponent('didPlayerWin', false);

        em.quickEntity({
            isControlled: true,
            shape: Shape.BALL,
            position: { x: 4, y: 19 },
        });

        em.quickEntity({
            shape: Shape.GLOVE,
            position: {
                x: randomizeSpawnLocation(22, 10),
                y: randomizeSpawnLocation(20, 5),
            },
        });

        em.quickEntity({
            shape: Shape.WALL,
            position: {
                x: randomizeSpawnLocation(12, 10),
                y: randomizeSpawnLocation(15, 10),
            },
        });
    },

    tick() {
        // Only check win condition when a shape has been updated
        if (!consumer.updatedEntities.size) return;

        const ballEntity = shapeQuery.get(Shape.BALL)?.first();
        const gloveEntity = shapeQuery.get(Shape.GLOVE)?.first();

        if (!ballEntity || !gloveEntity) {
            throw new Error(
                "Unable to determine completion state, ball or glove doesn't exist."
            );
        }

        const { position: ballPosition } = ballEntity.components;
        const { position: glovePosition } = gloveEntity.components;

        // TODO check if ball and glove are positioned appropriately and apply win condition
        if (
            ballPosition.x === glovePosition.x &&
            ballPosition.y === glovePosition.y + 1
        ) {
            em.setSingletonEntityComponent('isGameOver', true);
            em.setSingletonEntityComponent('didPlayerWin', true);
        }
    },
});
