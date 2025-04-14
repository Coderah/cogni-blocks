import { applyVuePlugin } from '../../sprixle/plugins/vuePlugin';
import { ComponentTypes } from '../components';
import { em } from '../entityManager';

export const { vuePipeline, useSingletonEntityComponent, useQuery } =
    applyVuePlugin<ComponentTypes>(em);
