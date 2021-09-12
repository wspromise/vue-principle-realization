import { initMixin } from './init';

// Vue2的响应式原理是靠Object.defineProperty(), 双向绑定原理是靠v-model
function Vue(options) {
  this._init(options); // 实现Vue初始化功能
}

initMixin(Vue);

// 导出Vue供别人使用
export default Vue;
