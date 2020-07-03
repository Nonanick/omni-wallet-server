export interface Bootable {
    emit(name: string): void;
    getBootDependencies: () => string[];
    getBootableItemName: () => string;
    getBootFunction: (dependencies: {
        [name: string]: any & Bootable;
    }) => (() => Promise<boolean> | boolean);
}
