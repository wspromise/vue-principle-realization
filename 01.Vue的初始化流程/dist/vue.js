(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function initState(vm) {
    const options = vm.$options;

    if (options.data) {
      initData();
    }
  }

  function initData(vm) {
    console.log('数据的初始化操作');
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
