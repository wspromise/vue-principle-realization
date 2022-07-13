import { getDataType } from '../../utils';
import { arrayMethods } from './array';

class Observe {
  constructor(data) {
    // 在data上加上属性__ob__, 一是在数组变异方法中能拿到Observe实例，进行监测数组和对象， 二是对已经监测的数据打上标记
    Object.defineProperty(data, '__ob__', {
      value: this, // this是Observe实例
      enumerable: false,
    });

    if (Array.isArray(data)) {
      // 如果是数组改写数组的原型
      data.__proto__ = arrayMethods;
      // 递归监测数组
      this.observeArr(data);
    } else {
      // 递归监测对象
      this.walk(data);
    }
  }

  // 监测数组中的每一项数据
  observeArr(data) {
    data.forEach((item) => observe(item));
  }

  // 监测对象中的每一项数据
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
      console.log(777);
      return value;
    },

    set(newValue) {
      if (newValue === value) return;
      // 对newValue进行监测，如vm.message = {a: 100},那么{a: 100}也是响应式的
      observe(newValue);
      value = newValue;
      console.log(newValue, 'newValue');
    },
  });
}

export function observe(data) {
  // 如果data不是一个对象和数组(data中某个属性值可能是数组)则不再进行监测
  if (
    (getDataType(data) !== 'Object' && getDataType(data) !== 'Array') ||
    data.__ob__
  )
    return;

  // 监测数据， 用类实现
  new Observe(data);
}
