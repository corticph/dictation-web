/**
 * Constructor signature for Lit class mixins
 * (https://lit.dev/docs/composition/mixins/).
 */
export type Constructor<T extends object = object> = new (...args: any[]) => T;
