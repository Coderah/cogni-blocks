import { defaultComponentTypes } from '../sprixle/ecs/manager';
import { SingletonComponent } from '../sprixle/ecs/types';

export enum Shape {
    BALL,
    WALL,
    GLOVE,
}

export const shapeGrids: {
    [key in Shape]: number[][];
} = {
    [Shape.BALL]: [
        [1, 1],
        [1, 1],
    ],
    [Shape.GLOVE]: [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 1],
    ],
    [Shape.WALL]: new Array(14).fill([1]),
};

export enum Direction {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    UP = 'UP',
    DOWN = 'DOWN',
}

export interface Vector2 {
    x: number;
    y: number;
}

export type ComponentTypes = {
    isGameOver: boolean & SingletonComponent;
    didPlayerWin: boolean & SingletonComponent;

    isControlled: true;

    shape: Shape;
    position: Vector2;

    isMoveSignal: true;
    moveDirection: Direction;
} & defaultComponentTypes;
