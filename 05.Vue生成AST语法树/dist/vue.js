(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function getDataType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  let arrayPrototype = Array.prototype; // arrayMethods的原型是Array.prototype

  let arrayMethods = Object.create(arrayPrototype); // 数组的变异方法

  let arrayList = ['push', 'pop', 'shift', 'unshift', 'reverse', 'splice', 'sort'];
  arrayList.forEach(method => {
    arrayMethods[method] = function (...args) {
      // 数组调用变异方法，先调用数组原生的方法
      arrayPrototype[method].call(this, ...args);
      let inserted = null;

      switch (method) {
        case 'splice':
          inserted = args.slice(2);
          break;

        case 'push':
        case 'unshift':
          inserted = args;
      }

      inserted && this.__ob__.observeArr(inserted);
    };
  });

  class Observe {
    constructor(data) {
      // 在data上加上属性__ob__, 一是在数组变异方法中能拿到Observe实例，进行监测数组和对象， 二是对已经监测的数据打上标记
      Object.defineProperty(data, '__ob__', {
        value: this,
        // this是Observe实例
        enumerable: false
      });

      if (Array.isArray(data)) {
        // 如果是数组改写数组的原型
        data.__proto__ = arrayMethods; // 递归监测数组

        this.observeArr(data);
      } else {
        // 递归监测对象
        this.walk(data);
      }
    } // 监测数组中的每一项数据


    observeArr(data) {
      data.forEach(item => observe(item));
    } // 监测对象中的每一项数据


    walk(data) {
      Object.keys(data).forEach(key => {
        ObjectReactive(data, key, data[key]);
      });
    }

  } // Vue2性能差就差在这个方法中，需要一加载时就递归调用defineProperty,耗性能
  // 性能优化原则
  // 1. 不要把所有数据都放在data中，否则都会添加get和set
  // 2. 数据层级不要过深，尽量扁平化数据
  // 3. 不要频繁的获取数据（每次获取数据都会调其get方法， get方法后期会有很多逻辑，耗性能）
  // 4. 如果数据不需要响应式，可以调用Object.freeze()冻结对象属性


  function ObjectReactive(data, key, value) {
    // value也可能是可监测数据， 对value进行递归监测
    observe(value); // 使data中每个属性变成响应式的

    Object.defineProperty(data, key, {
      get() {
        return value;
      },

      set(newValue) {
        if (newValue === value) return; // 对newValue进行监测，如vm.message = {a: 100},那么{a: 100}也是响应式的

        observe(newValue);
        value = newValue;
      }

    });
  }

  function observe(data) {
    // 如果data不是一个对象和数组(data中某个属性值可能是数组)则不再进行监测
    if (getDataType(data) !== 'Object' && getDataType(data) !== 'Array' || data.__ob__) return; // 监测数据， 用类实现

    new Observe(data);
  }

  function initState(vm) {
    const options = vm.$options;
    options.data && initData(vm); // 如果有data则进行初始化
  }

  function initData(vm) {
    let data = vm.$options.data; // 获取data选项
    // 判断data是否是函数， 如果是则调用得到对象，如果是对象则直接使用即可

    data = vm._data = getDataType(data) === 'Function' ? data.call(vm) : data; // 观测数据，使用Object.defineProperty()来使data中数据变成响应式的

    observe(data); // 遍历data做数据代理，通过vm访问属性代理到vm._data也就是最终得到的data里

    for (const key in data) {
      proxy(vm, key, '_data');
    }
  }

  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newValue) {
        vm[source][key] = newValue;
      }

    });
  }

  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名的  aa-xxx

  const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  aa:aa-xxx

  const startTagOpen = new RegExp(`^<${qnameCapture}`); //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]

  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>  [1]

  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  console.log('aaa=xxx'.match(attribute)); // [1]是属性的key [3] || [4] || [5]是属性的值

  const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  />    >
  // Vue3的编译原理比Vue2好很多， 没有那么多正则了

  function parserHTML(html) {
    function start(tagName, attrs) {
      console.log('start', tagName, attrs);
    }

    function end(tagName) {
      console.log('end', tagName);
    }

    function text(chars) {
      console.log('chars', chars);
    }

    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      const start = html.match(startTagOpen);

      if (start) {
        const match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        let end;
        let attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      // 解析标签和文本
      let index = html.indexOf('<');

      if (index === 0) {
        // 解析开始标签，并且把属性也解析出来 </div>
        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        let endTagMatch;

        if (endTagMatch = html.match(endTag)) {
          // 结束标签
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }

        break;
      } // 文本


      if (index > 0) {
        let chars = html.slice(0, index);
        text(chars);
        advance(chars.length);
      }
    }
  }

  function compileToFunction(template) {
    // 1.将模板变成ast语法树
    parserHTML(template);
  }

  function initMixin(Vue) {
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
      el = document.querySelector(el); // 将DOM挂载到实例上

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

  function Vue(options) {
    this._init(options); // 实现Vue初始化功能

  }

  initMixin(Vue); // 导出Vue供别人使用

  return Vue;

})));
//# sourceMappingURL=vue.js.map
