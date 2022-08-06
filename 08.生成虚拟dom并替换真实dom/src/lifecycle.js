import { patch } from './vdom/patch';

/**
 * 挂载组件
 * @param {*} vm 组件实例
 */
export function mountComponent(vm) {
  vm._update(vm._render());
}

export function lifeCycleMixin() {
  Vue.prototype._update = function (vnode) {
    // 采用的是 先序深度遍历 创建节点（遇到节点就创造节点，递归创建）
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}
