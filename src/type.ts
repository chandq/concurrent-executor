export const isBoolean = (any: unknown): any is boolean => typeof any === 'boolean';
export const isNumber = (any: unknown): any is number => typeof any === 'number' && !Number.isNaN(any);
