import { initState } from './state';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    this.$options = options; // 为 了后续扩展的方法，都可以获取到options了

    // 初始化状态数据
    initState(this);

    if (this.$options.el) {
      console.log('页面要挂载');
    }
  };
}
