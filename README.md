# code-read

本仓库用于解读主流前端框架（Vue2、Vue3、React）核心原理，并用简洁代码实现其关键机制。每个实现均配有详细中文说明和流程图，帮助你快速理解源码思想，适合前端进阶和面试准备。

## 目录
- `vue2/`  
  - `reactive.js`：vue2响应式核心实现
  - `reactive.md`：详细原理说明与流程图
  - `computed and watch/computed.js`：计算属性computed的简易实现，支持函数和对象两种写法
- `vue3/`  
  - 预留vue3 Proxy响应式等实现
- `react/`  
  - 预留react hooks等实现

## 推荐学习方式
1. 先阅读源码实现，再结合对应md文档理解原理。
2. 可对比vue2、vue3、react在响应式、依赖收集等方面的异同。
3. 欢迎补充更多核心机制的简易实现。