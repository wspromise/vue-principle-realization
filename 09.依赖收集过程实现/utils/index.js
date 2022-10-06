export function getDataType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

export const isObject = (val) => getDataType(val) === 'Object';
