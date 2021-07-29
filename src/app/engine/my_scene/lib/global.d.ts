declare type AnyObject = Record<string, unknown>;
declare type Constructor<T = AnyObject> = new (...args: any[]) => T;
declare type Optional<T> = T | undefined;
