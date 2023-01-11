export type BasePlugin<T> = (option: T, cls: typeof Base)=>any;

export  class Base {
    public extend() {

    }
}