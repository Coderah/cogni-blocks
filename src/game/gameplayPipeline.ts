import { Pipeline } from '../sprixle/ecs/system';
import { em } from './entityManager';
import { deathSystem } from './systems/deathSystem';
import { movementSystem } from './systems/movementSystem';
import { vuePipeline } from './systems/vueSystem';
import { winConditionSystem } from './systems/winConditionSystem';

export const gameplayPipeline = new Pipeline(
    em,
    movementSystem,
    winConditionSystem,
    vuePipeline,
    deathSystem
);
