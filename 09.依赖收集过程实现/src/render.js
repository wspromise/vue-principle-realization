import { isObject } from '../utils';
import { createElement, createText } from './vdom';

export function renderMixin(Vue) {
  // createElement 创建元素型的节点
  Vue.prototype._c = function () {
    const vm = this;
    return createElement(vm, ...arguments);
  };

  // 创建文本的虚拟节点
  Vue.prototype._v = function (text) {
    const vm = this;
    // 描述虚拟节点是属于哪个实例的
    return createText(vm, text);
  };

  // JSON.stringify()
  Vue.prototype._s = function (val) {
    if (isObject(val)) return JSON.stringify(val);
    return val;
  };

  Vue.prototype._render = function () {
    const vm = this;
    let { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  };
}
