import Dep from './dep';
let id = 0;
class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    // dep的id
    this.depsId = new Set();
    // 存放的dep
    this.deps = [];
    this.getter = fn; // fn就是页面的渲染逻辑
    this.get(); // 上来做一次初始化渲染
  }

  get() {
    Dep.target = this;
    this.getter(); // 页面的渲染逻辑
    Dep.target = null; // 渲染完毕清空标识，只有在渲染的时候才会进行依赖收集
  }

  addDep(dep) {
    let did = dep.id;
    if (!this.depsId.has(did)) {
      this.depsId.add(did);
      // 存放dep
      this.deps.push(dep);

      // 让dep存放watcher
      dep.addSub(this);
    }
  }

  update() {
    console.log('update');
    // 可以做异步更新处理
    this.get();
  }
}
export default Watcher;
