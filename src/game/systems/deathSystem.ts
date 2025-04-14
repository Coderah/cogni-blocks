import { em } from '../entityManager';
import { isDeadQuery } from '../queries';

export const deathSystem = em.createSystem(isDeadQuery, {
    all(entity) {
        em.deregisterEntity(entity);
    },
});
