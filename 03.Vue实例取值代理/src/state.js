import { getDataType } from '../utils';
import { observe } from './observe';

export function initState(vm) {
  const options = vm.$options;

  options.data && initData(vm); // 如果有data则进行初始化
}

function initData(vm) {
  let data = vm.$options.data; // 获取data选项

  // 判断data是否是函数， 如果是则调用得到对象，如果是对象则直接使用即可
  data = vm._data = getDataType(data) === 'Function' ? data.call(vm) : data;

  // 观测数据，使用Object.defineProperty()来使data中数据变成响应式的
  observe(data);

  for (const key in data) {
    proxy(vm, key, '_data');
  }
}

function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}
