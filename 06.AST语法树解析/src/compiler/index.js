import parserHTML from './parser';

export function compileToFunction(template) {
  // 1.将模板变成ast语法树
  let ast = parserHTML(template);
  console.log(ast, 'ast');
}
