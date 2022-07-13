const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名的  aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  aa:aa-xxx
const startTagOpen = new RegExp(`^<${qnameCapture}`); //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>  [1]
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  />    >

// Vue3的编译原理比Vue2好很多， 没有那么多正则了
export default function parserHTML(html) {
  let stack = [];
  let root = null;

  function createASTElment(tag, attrs, parent = null) {
    return {
      type: 1,
      tag,
      parent,
      attrs,
      children: [],
    };
  }

  function start(tagName, attrs) {
    let parent = stack[stack.length - 1];
    let element = createASTElment(tagName, attrs, parent);
    root === null && (root = element);

    parent && parent.children.push(element);

    stack.push(element);
  }

  function end(tagName) {
    stack.pop().tag !== tagName && console.log('标签出错');
  }

  function text(chars) {
    let parent = stack[stack.length - 1];
    chars = chars.replace(/\s/g, '');
    parent &&
      chars &&
      parent.children.push({
        type: 2,
        text: chars,
      });
  }

  function advance(len) {
    html = html.substring(len);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };

      advance(start[0].length);

      let end;
      let attr;

      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
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
      if ((endTagMatch = html.match(endTag))) {
        // 结束标签
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
      break;
    }

    // 文本
    if (index > 0) {
      let chars = html.slice(0, index);
      text(chars);
      advance(chars.length);
    }
  }

  return root;
}
