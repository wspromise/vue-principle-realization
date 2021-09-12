import { getDataType } from '../../utils';

class Observe {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      ObjectReactive(data, key, data[key]);
    });
  }
}

// Vue2性能差就差在这个方法中，需要一加载时就递归调用defineProperty,耗性能
// 性能优化原则
// 1. 不要把所有数据都放在data中，否则都会添加get和set
// 2. 数据层级不要过深，尽量扁平化数据
// 3. 不要频繁的获取数据（每次获取数据都会调其get方法， get方法后期会有很多逻辑，耗性能）
// 4. 如果数据不需要响应式，可以调用Object.freeze()冻结对象属性

function ObjectReactive(data, key, value) {
  // value也可能是可监测数据， 对value进行递归监测
  observe(value);

  // 使data中每个属性变成响应式的
  Object.defineProperty(data, key, {
    get() {
      return value;
    },

    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    },
  });
}

export function observe(data) {
  // 如果data不是一个对象和数组(data中某个属性值可能是数组)则不再进行监测
  if (getDataType(data) !== 'Object' && getDataType(data) !== 'Array') return;

  // 监测数据， 用类实现
  new Observe(data);
}
