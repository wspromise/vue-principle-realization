import { initState } from './state';
import { compileToFunction } from './compiler';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    this.$options = options; // 为 了后续扩展的方法，都可以获取到options了

    // 初始化状态数据
    initState(this);

    if (options.el) {
      // 将数据挂载到页面上
      // ast--> render --> 虚拟DOM --> 真实DOM
      // 更新的时候再次调用render函数 --> 虚拟DOM --> 新旧对比(diff算法) --> 更新真实DOM

      this.$mount(options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    // 获取真实DOM
    el = document.querySelector(el);
    // 将DOM挂载到实例上
    this.$el = el;
    let options = this.$options;

    if (!options.render) {
      // 模板编译
      let template = options.template;
      if (!template) {
        template = el.outerHTML;
      }

      let render = compileToFunction(template);
      options.render = render;
    }
  };
}
