export interface IPredicate {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]): boolean;
}