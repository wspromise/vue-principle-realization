// 创建元素类型的虚拟节点
export const createElement = (vm, tag, data = {}, ...children) => {
  return vnode(vm, tag, data, children, data.key, undefined);
};

// 创建文本类型的虚拟节点
export const createText = (vm, text) => {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
};

// 创建虚拟节点
function vnode(vm, tag, data, children, key, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
  };
}

// vnode 其实就是一个对象， 用来描述节点的，描述dom结构的，可以自己去扩展属性
// ast描述语法的，他并没有用户自己的逻辑, 只有语法解析出来的内容
