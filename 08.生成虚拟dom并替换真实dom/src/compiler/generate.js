const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{   xxx  }}

/**
 * 生成属性
 * @param {*} attrs 属性
 * @returns
 */
function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let styles = {};
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1]] = arguments[2];
      });

      attr.value = styles;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function gen(el) {
  if (el.type === 1) {
    // 如果是元素就递归生成
    return generate(el);
  } else {
    let text = el.text;
    // 普通文本
    if (!defaultTagRE.test(text)) return `_v(${text})`;

    // 说明文本里面有表达式
    // 如果正则 +g 配合exec就会有一个问题 lastIndex的问题， 所以每次调gen方法的时候正则的lastIndex要重置
    let lastIndex = (defaultTagRE.lastIndex = 0);
    let match;
    let tokens = [];
    while ((match = defaultTagRE.exec(text))) {
      const index = match.index;
      if (index > lastIndex) {
        const firstText = text.slice(lastIndex, index);
        tokens.push(JSON.stringify(firstText));
      }

      // 添加变量
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }

    // 到最后有可能还剩余一段 <div> aaa</div>
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return `_v(${tokens.join('+')})`; // webpack源码 css-loader 图片处理都是这样处理
  }
}

function genChildren(el) {
  let children = el.children;
  if (children) {
    return children.map((item) => gen(item)).join(',');
  }
  return false;
}

/**
 * 生成模板字符串
 * @param {*} ast ast语法树对象
 * @returns
 */
export function generate(ast) {
  // 生成children
  let children = genChildren(ast);
  // 模板字符串
  let code = `_c(
    '${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : 'undefined'}${
    children ? `,${children}` : ''
  })`;
  return code;
}
