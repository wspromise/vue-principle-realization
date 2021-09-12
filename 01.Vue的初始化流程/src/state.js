export function initState(vm) {
  const options = vm.$options;

  if (options.data) {
    initData(vm);
  }
}

function initData(vm) {
  console.log('数据的初始化操作');
}
