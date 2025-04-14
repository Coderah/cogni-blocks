/** @reflection never */
import { computed, ref } from 'vue';
import {
    defaultComponentTypes,
    EntityWithComponents,
    Keys,
    Manager,
} from '../ecs/manager';
import { Query } from '../ecs/query';
import { Pipeline } from '../ecs/system';

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
        /** bit gets flipped to communicate computed value has changed to vue */
        const updateTrigger = ref(false);

        // Consumer and System work to communicate updates.
        const consumer = query.createConsumer();
        const system = manager.createSystem(consumer, {
            tick() {
                if (
                    consumer.updatedEntities.size ||
                    consumer.newEntities.size ||
                    consumer.deletedEntities.size
                ) {
                    updateTrigger.value = !updateTrigger.value;

                    consumer.clear();
                }
            },
        });

        vuePipeline.systems.add(system);

        return computed(
            () => {
                updateTrigger.value;
                console.log('[useQuery update]', query);
                return query.entities.map((id) =>
                    computed(() => manager.getEntity(id) as E)
                );
            },
            {
                onTrack(e) {
                    // triggered when count.value is tracked as a dependency
                    console.log('[useQuery] track', query);
                },
                onTrigger(e) {
                    // triggered when count.value is mutated
                    console.log('[useQuery] trigger', query);
                },
            }
        );
    }

    return {
        vuePipeline,
        useQuery,
    };
}
