let id = 0;
class Dep {
  constructor() {
    this.subs = [];
    this.id = id++;
  }

  depend() {
    // 在Watcher中添加dep
    Dep.target.addDep(this);
  }

  addSub(watcher) {
    // 在dep中添加watcher
    this.subs.push(watcher);
  }
  
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
Dep.target = null; // 定义一个全局变量
export default Dep;
