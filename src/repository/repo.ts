export type id = string;
export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    getAll: () => Promise<Array<T>>;
    post: (data: Partial<T>) => Promise<T>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
}

export interface ExtraRepo<T> {
    find: (data: any) => Promise<T>;
}
export interface FullRepo<T> {
    get: (id: id) => Promise<T>;
    getAll: () => Promise<Array<T>>;
    post: (data: Partial<T>) => Promise<T>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    find: (data: any) => Promise<T>;
}

export interface Repo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<{ id: id }>;
}
