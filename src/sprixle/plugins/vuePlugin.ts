/** @reflection never */
import { computed, ref, ShallowRef, shallowRef } from 'vue';
import {
    defaultComponentTypes,
    EntityWithComponents,
    Keys,
    Manager,
} from '../ecs/manager';
import { Query } from '../ecs/query';
import { Pipeline } from '../ecs/system';
import { em } from '../../game/entityManager';
import { ShallowRefMarker, triggerRef } from '@vue/reactivity';

export function applyVuePlugin<
    C extends defaultComponentTypes,
    M extends Manager<C> = Manager<C>
>(manager: M) {
    const vuePipeline = new Pipeline(manager);

    // TODO introduce useEntity(id) and useSingletonEntity(componentName)
    // TODO introduce more granular useQuery (update per entity, etc)
    // TODO investigate if a v-for on a useQuery is possible
    function useQuery<
        Includes extends Keys<C>[],
        IndexedComponent extends Keys<C>,
        E extends EntityWithComponents<C, M, Includes[number]>
    >(query: Query<C, Includes, M, IndexedComponent, E>) {
        const cache: {
            [id: string]: ShallowRef<typeof manager.Entity>;
        } = {};

        const ref = shallowRef(query.entities.map((id) => getEntityRef<E>(id)));

        function getEntityRef<E = typeof manager.Entity>(id: string) {
            return (cache[id] =
                cache[id] || shallowRef(em.getEntity(id))) as ShallowRef<E>;
        }

        // Consumer and System work to communicate updates.
        const consumer = query.createConsumer();
        const system = manager.createSystem(consumer, {
            tick() {
                if (
                    consumer.newEntities.size ||
                    consumer.deletedEntities.size
                ) {
                    ref.value = query.entities.map((id) => getEntityRef<E>(id));
                }
            },

            newOrUpdated(entity) {
                triggerRef(getEntityRef(entity.id));
            },
        });

        vuePipeline.systems.add(system);

        return ref;
    }

    return {
        vuePipeline,
        useQuery,
    };
}
