let arrayPrototype = Array.prototype;
// arrayMethods的原型是Array.prototype
export let arrayMethods = Object.create(arrayPrototype);
// 数组的变异方法
let arrayList = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'splice',
  'sort',
];

arrayList.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // 数组调用变异方法，先调用数组原生的方法
    arrayPrototype[method].call(this, ...args);
    let inserted = null;
    switch (method) {
      case 'splice':
        inserted = args.slice(2);
        break;

      case 'push':
      case 'unshift':
        inserted = args;
    }

    inserted && this.__ob__.observeArr(inserted);
  };
});
