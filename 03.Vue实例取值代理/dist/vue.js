(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function getDataType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  class Observe {
    constructor(data) {
      this.walk(data);
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        ObjectReactive(data, key, data[key]);
      });
    }

  } // Vue2性能差就差在这个方法中，需要一加载时就递归调用defineProperty,耗性能
  // 性能优化原则
  // 1. 不要把所有数据都放在data中，否则都会添加get和set
  // 2. 数据层级不要过深，尽量扁平化数据
  // 3. 不要频繁的获取数据（每次获取数据都会调其get方法， get方法后期会有很多逻辑，耗性能）
  // 4. 如果数据不需要响应式，可以调用Object.freeze()冻结对象属性


  function ObjectReactive(data, key, value) {
    // value也可能是可监测数据， 对value进行递归监测
    observe(value); // 使data中每个属性变成响应式的

    Object.defineProperty(data, key, {
      get() {
        console.log(222);
        return value;
      },

      set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
      }

    });
  }

  function observe(data) {
    // 如果data不是一个对象和数组(data中某个属性值可能是数组)则不再进行监测
    if (getDataType(data) !== 'Object' && getDataType(data) !== 'Array') return; // 监测数据， 用类实现

    new Observe(data);
  }

  function initState(vm) {
    const options = vm.$options;
    options.data && initData(vm); // 如果有data则进行初始化
  }

  function initData(vm) {
    let data = vm.$options.data; // 获取data选项
    // 判断data是否是函数， 如果是则调用得到对象，如果是对象则直接使用即可

    data = vm._data = getDataType(data) === 'Function' ? data.call(vm) : data; // 观测数据，使用Object.defineProperty()来使data中数据变成响应式的

    observe(data);

    for (const key in data) {
      proxy(vm, key, '_data');
    }
  }

  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        console.log(111);
        return vm[source][key];
      },

      set(newValue) {
        vm[source][key] = newValue;
      }

    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      this.$options = options; // 为 了后续扩展的方法，都可以获取到options了
      // 初始化状态数据

      initState(this);

      if (this.$options.el) {
        console.log('页面要挂载');
      }
    };
  }

  function Vue(options) {
    this._init(options); // 实现Vue初始化功能

  }

  initMixin(Vue); // 导出Vue供别人使用

  return Vue;

})));
//# sourceMappingURL=vue.js.map
