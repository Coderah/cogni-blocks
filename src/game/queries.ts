import { em } from './entityManager';

export const shapeQuery = em.createQuery({
    includes: ['shape', 'position'],
    index: 'shape',
});

export const moveSignalQuery = em.createQuery({
    includes: ['isMoveSignal', 'moveDirection'],
});

export const isControlledQuery = em.createQuery({
    includes: ['isControlled', 'position'],
});

export const isDeadQuery = em.createQuery({
    includes: ['isDead'],
});
