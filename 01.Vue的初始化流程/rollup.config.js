import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

export default {
  input: './src/index.js', // 打包的入口
  output: {
    file: 'dist/vue.js', // 打包的出口
    format: 'umd', // 常见的规范有AMD,CMD,commonJS,ES6
    name: 'Vue', // umd模块需要配置name, 会将导出的name放在window上面
    sourcemap: true, // 可以进行源代码调试
  },

  plugins: [
    nodeResolve({}), // 执行该方法，默认引入index.js
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // babel不编译node_modules下面的所有文件
    }),
  ],
};
