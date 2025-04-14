import { Shape, shapeGrids, Vector2 } from './components';

function checkAABBCollision(
    posA: Vector2,
    shapeA: number[][],
    posB: Vector2,
    shapeB: number[][]
): boolean {
    const heightA = shapeA.length;
    const widthA = shapeA[0]?.length || 0;
    const heightB = shapeB.length;
    const widthB = shapeB[0]?.length || 0;

    if (
        posA.x < posB.x + widthB &&
        posA.x + widthA > posB.x &&
        posA.y < posB.y + heightB &&
        posA.y + heightA > posB.y
    ) {
        return true; // AABBs are overlapping, potential collision
    }
    return false; // AABBs are not overlapping, no collision possible
}

export function areShapesOverlapping(
    shapeA: Shape,
    positionA: Vector2,
    shapeB: Shape,
    positionB: Vector2
): boolean {
    const gridA = shapeGrids[shapeA];
    const gridB = shapeGrids[shapeB];

    if (!checkAABBCollision(positionA, gridA, positionB, gridB)) {
        return false; // No collision if AABBs don't overlap
    }

    // Perform the detailed pixel-level check only if AABBs overlap
    const heightA = gridA.length;
    const widthA = gridA[0]?.length || 0;
    const heightB = gridB.length;
    const widthB = gridB[0]?.length || 0;

    for (let iA = 0; iA < heightA; iA++) {
        for (let jA = 0; jA < widthA; jA++) {
            if (gridA[iA][jA] !== 0) {
                const worldXA = positionA.x + jA;
                const worldYA = positionA.y + iA;

                for (let iB = 0; iB < heightB; iB++) {
                    for (let jB = 0; jB < widthB; jB++) {
                        if (gridB[iB][jB] !== 0) {
                            const worldXB = positionB.x + jB;
                            const worldYB = positionB.y + iB;

                            if (worldXA === worldXB && worldYA === worldYB) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}
