const toType = (obj) => Object.prototype.toString.call(obj);

const isObject = (obj) => toType(obj) === '[object Object]';

export const isBoolean = (obj) => toType(obj) === '[object Boolean]';

export const deepAssign = (target, ...sources) => {
  while(sources.length) {
    let source = sources.shift();

    if (isObject(target) || isObject(source)) {
      if (!isObject(target)) {
        target = {};
      } else if (!isObject(source)) {
        source = {};
      }

      Object.keys(source).forEach((key) => {
        const value = source[key];
        if (isObject(value)) {
          target[key] = deepAssign(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  }
  return target;
};
