type Keys<T> = T extends Partial<infer O> ? keyof O : keyof T;

type PathTree<T> = {
    [P in Keys<T>]: T[P] extends object ? [P] | [P, ...Path<T[P]>] : [P];
};

type Path<T> = PathTree<T>[keyof PathTree<T>];

export function keys<T extends Object>(data: T): Array<Keys<T>> {
    return Object.keys(data) as Array<Keys<T>>;
}

export function keySet<T extends Object>(data: T) {
    return new Set(keys(data));
}
