export const countTrue = arr => arr.reduce((acc, current) => acc + current, 0);
export const usedAtLeastOnce = arr => countTrue(arr) > 0;
export const usedMoreThanOnce = arr => countTrue(arr) > 1;
